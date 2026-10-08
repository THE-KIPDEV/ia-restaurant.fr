import { NextResponse } from "next/server";
import { ensureWorkspace,memoryOwner,memoryResponse,sameOrigin,serializeItem,validatedItem } from "@/lib/memory-server";
type Context={params:Promise<{restaurantId:string}>};
export async function POST(request:Request,context:Context){try{
  sameOrigin(request);const {restaurantId}=await context.params;const {paid}=await memoryOwner(restaurantId);await ensureWorkspace(restaurantId,paid);
  return NextResponse.json({item:serializeItem(await validatedItem(restaurantId,await request.json()))},{status:201});
}catch(error){return memoryResponse(error);}}
