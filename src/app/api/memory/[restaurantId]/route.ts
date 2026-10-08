import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureWorkspace,itemSelect,MemoryError,memoryOwner,memoryResponse,sameOrigin,serializeItem } from "@/lib/memory-server";
import { settleStaleAI } from "@/lib/memory-ai";
import { workspaceSchema } from "@/lib/restaurant-memory";
type Context={params:Promise<{restaurantId:string}>};
export async function GET(_request:Request,context:Context){try{
  const {restaurantId}=await context.params;const {user,paid}=await memoryOwner(restaurantId);
  await settleStaleAI(user.id);
  const workspace=await ensureWorkspace(restaurantId,paid);
  const items=await prisma.restaurantMemoryItem.findMany({where:{restaurantId},select:itemSelect,orderBy:{createdAt:"desc"}});
  const history=await prisma.aiUsage.findMany({where:{userId:user.id,restaurantId,feature:"COPILOT",status:"completed"},orderBy:{createdAt:"desc"},take:20,select:{inputData:true,outputData:true}});
  const messages=history.flatMap(h=>{try{const result=JSON.parse(h.outputData||"null");return h.inputData&&result?.reply?[{question:h.inputData,reply:result.reply}]:[];}catch{return [];}}).reverse();
  const current=await prisma.user.findUniqueOrThrow({where:{id:user.id},select:{tokenBalance:true}});
  return NextResponse.json({messages,workspace:workspace.data,revision:workspace.revision,items:items.map(serializeItem),balance:current.tokenBalance,paid});
}catch(error){return memoryResponse(error);}}
export async function PUT(request:Request,context:Context){try{
  sameOrigin(request);const {restaurantId}=await context.params;const {paid}=await memoryOwner(restaurantId);await ensureWorkspace(restaurantId,paid);
  const input=z.object({revision:z.number().int().min(0),workspace:workspaceSchema}).parse(await request.json());
  const sources=Array.from(new Set(input.workspace.ingredients.flatMap(i=>i.sourceId?[i.sourceId]:[])));
  if(sources.length){const found=await prisma.restaurantMemoryItem.count({where:{restaurantId,id:{in:sources},kind:"invoice",status:"validated"}});if(found!==sources.length)throw new MemoryError(400,"Un prix doit citer une facture confirmée de ce restaurant.");}
  const result=await prisma.restaurantWorkspace.updateMany({where:{restaurantId,revision:input.revision},data:{data:input.workspace,revision:{increment:1}}});
  if(!result.count)return NextResponse.json({error:"Le restaurant a été modifié dans un autre onglet. Rechargez les données avant de réessayer."},{status:409});
  return NextResponse.json({revision:input.revision+1});
}catch(error){return memoryResponse(error);}}
