import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { itemSelect,memoryOwner,memoryResponse,needPaid,sameOrigin,serializeItem } from "@/lib/memory-server";
import { daySchema,memoryContext,workspaceSchema } from "@/lib/restaurant-memory";
import { askMemory,finishAI,refundAI,reserveAI,settleStaleAI } from "@/lib/memory-ai";
import { rateLimit } from "@/lib/rate-limit";
type Context={params:Promise<{restaurantId:string}>};
export async function POST(request:Request,context:Context){let reservation:string|undefined;try{
  sameOrigin(request);const {restaurantId}=await context.params;const {user,restaurant,paid}=await memoryOwner(restaurantId);needPaid(paid);
  if(!rateLimit("memory:ai:"+user.id,12,60000).success)return NextResponse.json({error:"Trop de demandes. Réessayez dans une minute."},{status:429});
  const input=z.object({question:z.string().trim().min(3).max(2000),date:daySchema,requestId:z.string().uuid()}).parse(await request.json());
  const workspace=workspaceSchema.parse(restaurant.workspace?.data);await settleStaleAI(user.id);
  const held=await reserveAI(user.id,restaurantId,"COPILOT",input.requestId);if(held.cached)return NextResponse.json({...held.cached,balance:(await prisma.user.findUniqueOrThrow({where:{id:user.id},select:{tokenBalance:true}})).tokenBalance});reservation=held.id;await prisma.aiUsage.update({where:{id:held.id},data:{inputData:input.question}});
  const items=(await prisma.restaurantMemoryItem.findMany({where:{restaurantId},select:itemSelect})).map(serializeItem);
  const previous=await prisma.aiUsage.findMany({where:{userId:user.id,restaurantId,feature:"COPILOT",status:"completed"},orderBy:{createdAt:"desc"},take:5,select:{inputData:true,outputData:true}});
  const conversation=previous.reverse().flatMap(p=>{try{return [{question:p.inputData,answer:JSON.parse(p.outputData||"null")?.reply?.answer?.slice(0,2000)}];}catch{return [];}});
  const info=memoryContext(items,workspace,input.question,input.date);const reply=await askMemory(input.question,{restaurant:{name:restaurant.name,cuisine:restaurant.cuisine},conversation,...info});
  const known=new Set(info.documents.map(d=>d.id));reply.sources=reply.sources.filter(id=>known.has(id));
  const result={reply,balance:(await prisma.user.findUniqueOrThrow({where:{id:user.id},select:{tokenBalance:true}})).tokenBalance,cost:held.cost};await finishAI(held.id,result);return NextResponse.json(result);
}catch(error){if(reservation)await refundAI(reservation).catch(()=>{});return memoryResponse(error);}}
