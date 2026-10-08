import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { workspaceSchema } from "@/lib/restaurant-memory";
import { memoryOwner,memoryResponse,sameOrigin,serializeItem,validatedItem } from "@/lib/memory-server";
type Context={params:Promise<{restaurantId:string;id:string}>};
export async function PATCH(request:Request,context:Context){try{
  sameOrigin(request);const {restaurantId,id}=await context.params;await memoryOwner(restaurantId);
  return NextResponse.json({item:serializeItem(await validatedItem(restaurantId,await request.json(),id))});
}catch(error){return memoryResponse(error);}}
export async function DELETE(request:Request,context:Context){try{
  sameOrigin(request);const {restaurantId,id}=await context.params;await memoryOwner(restaurantId);
  await prisma.$transaction(async tx=>{
    const saved=await tx.restaurantWorkspace.findUnique({where:{restaurantId}});
    if(saved){const data=workspaceSchema.parse(saved.data);if(data.ingredients.some(i=>i.sourceId===id))await tx.restaurantWorkspace.update({where:{restaurantId},data:{data:{...data,ingredients:data.ingredients.map(i=>i.sourceId===id?{...i,sourceId:null}:i)},revision:{increment:1}}});}
    await tx.restaurantMemoryItem.deleteMany({where:{restaurantId,id}});
  });return NextResponse.json({success:true});
}catch(error){return memoryResponse(error);}}
