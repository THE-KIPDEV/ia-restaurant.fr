import { memoryOwner,memoryResponse } from "@/lib/memory-server";
import { prisma } from "@/lib/prisma";
type Context={params:Promise<{restaurantId:string;id:string}>};
export async function GET(_request:Request,context:Context){try{
  const {restaurantId,id}=await context.params;await memoryOwner(restaurantId);const item=await prisma.restaurantMemoryItem.findFirst({where:{restaurantId,id},select:{fileData:true,fileMime:true}});
  if(!item?.fileData)return new Response("Document introuvable",{status:404});
  return new Response(new Uint8Array(item.fileData),{headers:{"Content-Type":item.fileMime||"application/octet-stream","Content-Disposition":"inline","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
}catch(error){return memoryResponse(error);}}
