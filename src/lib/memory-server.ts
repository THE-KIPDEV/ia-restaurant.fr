import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser, hasActiveSubscription } from "./auth";
import { prisma } from "./prisma";
import { cashOverlaps, cashSchema, emptyWorkspace, itemInputSchema, type MemoryItem } from "./restaurant-memory";

export class MemoryError extends Error { constructor(public status:number,message:string){super(message);} }
export function sameOrigin(request:Request){const origin=request.headers.get("origin");if(origin&&new URL(origin).host!==new URL(request.url).host&&new URL(origin).host!==request.headers.get("host"))throw new MemoryError(403,"Origine de la requête refusée.");}
export async function memoryOwner(restaurantId:string){
  const user=await getCurrentUser();if(!user)throw new MemoryError(401,"Connectez-vous pour accéder à votre restaurant.");
  const restaurant=await prisma.restaurant.findFirst({where:{id:restaurantId,userId:user.id},include:{workspace:true}});
  if(!restaurant)throw new MemoryError(404,"Restaurant introuvable.");
  return {user,restaurant,paid:hasActiveSubscription(user)};
}
export function needPaid(paid:boolean){if(!paid)throw new MemoryError(402,"Activez votre abonnement pour utiliser le copilote et la lecture IA.");}
export async function ensureWorkspace(restaurantId:string,paid:boolean){
  const existing=await prisma.restaurantWorkspace.findUnique({where:{restaurantId}});if(existing)return existing;
  needPaid(paid);return prisma.restaurantWorkspace.upsert({where:{restaurantId},create:{restaurantId,data:emptyWorkspace()},update:{}});
}
export function serializeItem(item:{id:string;kind:string;title:string;status:string;payload:unknown;originalName:string|null;createdAt:Date;fileMime:string|null;history?:unknown}):MemoryItem{return {id:item.id,kind:item.kind,title:item.title,status:item.status,payload:item.payload,originalName:item.originalName,createdAt:item.createdAt.toISOString(),hasFile:!!item.fileMime,history:Array.isArray(item.history)?item.history:[]};}
export const itemSelect={id:true,kind:true,title:true,status:true,payload:true,originalName:true,createdAt:true,fileMime:true,history:true} as const;
export async function checkCashDuplicate(tx:Prisma.TransactionClient,restaurantId:string,payload:unknown,exclude?:string){
  const v=cashSchema.parse(payload);const existing=await tx.restaurantMemoryItem.findMany({where:{restaurantId,kind:"cash",status:"validated",...(exclude?{id:{not:exclude}}:{})},select:{payload:true}});
  if(existing.some(i=>{const b=cashSchema.safeParse(i.payload);return b.success&&cashOverlaps(v,b.data);} ))throw new MemoryError(409,"Un relevé couvre déjà cette date et ce service. Corrigez ce relevé pour éviter un double comptage.");
}
export async function validatedItem(restaurantId:string,input:unknown,existingId?:string){
  const data=itemInputSchema.parse(input);
  for(let attempt=0;attempt<3;attempt++){
    try{return await prisma.$transaction(async tx=>{
      if(data.kind==="cash")await checkCashDuplicate(tx,restaurantId,data.payload,existingId);
      if(data.kind==="invoice"&&data.payload.reference){
        const old=await tx.restaurantMemoryItem.findMany({where:{restaurantId,kind:"invoice",status:"validated",...(existingId?{id:{not:existingId}}:{})},select:{payload:true}});
        if(old.some(v=>{const p=v.payload as {supplier?:string;reference?:string};return p.supplier?.trim().toLowerCase()===data.payload.supplier.trim().toLowerCase()&&p.reference===data.payload.reference;}))throw new MemoryError(409,"Cette référence de facture est déjà enregistrée pour ce fournisseur.");
      }
      if(existingId){const previous=await tx.restaurantMemoryItem.findFirst({where:{id:existingId,restaurantId}});if(!previous)throw new MemoryError(404,"Document introuvable.");const history=[...(Array.isArray(previous.history)?previous.history:[]),{at:new Date().toISOString(),title:previous.title,status:previous.status,payload:previous.payload}];const result=await tx.restaurantMemoryItem.updateMany({where:{id:existingId,restaurantId},data:{...data,status:"validated",history}});if(!result.count)throw new MemoryError(404,"Document introuvable.");return tx.restaurantMemoryItem.findUniqueOrThrow({where:{id:existingId},select:itemSelect});}
      return tx.restaurantMemoryItem.create({data:{restaurantId,...data,status:"validated"},select:itemSelect});
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});}catch(error){if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==="P2034"&&attempt<2)continue;throw error;}
  }
  throw new MemoryError(409,"Une autre modification a été enregistrée. Réessayez.");
}
export function memoryResponse(error:unknown){
  if(error instanceof MemoryError)return NextResponse.json({error:error.message},{status:error.status});
  if(error&&typeof error==="object"&&"issues" in error){const v=error as {issues:Array<{message:string}>};return NextResponse.json({error:v.issues[0]?.message||"Données invalides."},{status:400});}
  if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==="P2002")return NextResponse.json({error:"Ce document a déjà été importé."},{status:409});
  console.error("restaurant-memory:",error instanceof Error?error.name:"error");return NextResponse.json({error:"L’opération n’a pas abouti. Réessayez."},{status:500});
}
