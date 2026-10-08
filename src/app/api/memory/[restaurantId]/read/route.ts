import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { itemSelect,MemoryError,memoryOwner,memoryResponse,needPaid,sameOrigin,serializeItem } from "@/lib/memory-server";
import { parisDay } from "@/lib/restaurant-memory";
import { finishAI,readDocument,refundAI,reserveAI,settleStaleAI } from "@/lib/memory-ai";
import { rateLimit } from "@/lib/rate-limit";
type Context={params:Promise<{restaurantId:string}>};
export async function POST(request:Request,context:Context){let reservation:string|undefined;try{
  sameOrigin(request);const {restaurantId}=await context.params;const {user,paid}=await memoryOwner(restaurantId);needPaid(paid);
  if(!rateLimit("memory:read:"+user.id,6,60000).success)throw new MemoryError(429,"Trop de documents. Réessayez dans une minute.");
  if(Number(request.headers.get("content-length")||0)>5_000_000)throw new MemoryError(413,"Le document doit faire moins de 4 Mo.");
  const form=await request.formData();const file=form.get("file"),kind=z.enum(["cash","invoice"]).parse(form.get("kind")),requestId=z.string().uuid().parse(form.get("requestId"));
  if(!(file instanceof File)||file.size>4_000_000||file.size===0)throw new MemoryError(400,"Choisissez un PDF, JPG, PNG ou WebP de moins de 4 Mo.");
  const bytes=Buffer.from(await file.arrayBuffer());const mime=bytes.subarray(0,5).toString()==="%PDF-"?"application/pdf":bytes[0]===0xff&&bytes[1]===0xd8?"image/jpeg":bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?"image/png":bytes.subarray(0,4).toString()==="RIFF"&&bytes.subarray(8,12).toString()==="WEBP"?"image/webp":null;
  if(!mime)throw new MemoryError(400,"Format de document non pris en charge.");
  const fingerprint=createHash("sha256").update(bytes).digest("hex");const duplicate=await prisma.restaurantMemoryItem.findUnique({where:{restaurantId_fingerprint:{restaurantId,fingerprint}},select:itemSelect});
  if(duplicate)return NextResponse.json({item:serializeItem(duplicate),balance:user.tokenBalance,cost:0,duplicate:true});
  await settleStaleAI(user.id);const held=await reserveAI(user.id,restaurantId,"DOCUMENT_READING",requestId);if(held.cached)return NextResponse.json({...held.cached,balance:(await prisma.user.findUniqueOrThrow({where:{id:user.id},select:{tokenBalance:true}})).tokenBalance});reservation=held.id;
  const extracted=await readDocument(bytes,mime,kind,parisDay());if(extracted.kind!==kind)throw new MemoryError(422,"Type de document non reconnu.");
  const item=await prisma.restaurantMemoryItem.create({data:{restaurantId,...extracted,status:"draft",fileData:bytes,fileMime:mime,originalName:file.name.slice(0,200),fingerprint},select:itemSelect});
  const result={item:serializeItem(item),balance:(await prisma.user.findUniqueOrThrow({where:{id:user.id},select:{tokenBalance:true}})).tokenBalance,cost:held.cost};await finishAI(held.id,result);return NextResponse.json(result);
}catch(error){if(reservation)await refundAI(reservation).catch(()=>{});return memoryResponse(error);}}
