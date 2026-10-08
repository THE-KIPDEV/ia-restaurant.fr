import {NextRequest,NextResponse} from "next/server";
import {z} from "zod";
import {randomUUID} from "node:crypto";
import {reserveAI,finishAI,refundAI} from "@/lib/memory-ai";
import {MemoryError} from "@/lib/memory-server";
import {requireUser,hasActiveSubscription} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {generateReviewResponse} from "@/lib/ai";
import {rateLimit} from "@/lib/rate-limit";
import {TOKEN_COSTS} from "@/lib/config";
import {generateWithReviewCredits,NoReviewCredits} from "@/lib/review-credits";
const schema=z.object({review:z.string().trim().min(1).max(4000),rating:z.number().int().min(1).max(5).default(3),restaurantName:z.string().trim().max(120).default(""),tone:z.enum(["professional","warm","apologetic"]).default("professional"),language:z.enum(["fr","en"]).default("fr")});
export async function POST(req:NextRequest){try{
 const user=await requireUser();const rl=rateLimit(`ai:review:${user.id}`,10,60000);if(!rl.success)return NextResponse.json({error:"Patientez une minute avant de réessayer."},{status:429});
 let body;try{body=await req.json();}catch{return NextResponse.json({error:"Données invalides."},{status:400});}
 const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({error:"Vérifiez l’avis (4 000 caractères maximum), la note et les choix proposés."},{status:400});
 const input=parsed.data,cost=TOKEN_COSTS.REVIEW_RESPONSE;
 if(!hasActiveSubscription(user))return NextResponse.json({error:"Activez votre abonnement pour utiliser l’IA."},{status:402});
 let holdId="";
 const response=await generateWithReviewCredits({
  reserve:async()=>{const hold=await reserveAI(user.id,null,"REVIEW_RESPONSE",randomUUID());holdId=hold.id;return true;},
  generate:()=>generateReviewResponse(input),
  record:async text=>{await prisma.aiUsage.update({where:{id:holdId},data:{inputData:input.review.slice(0,2000)}});await finishAI(holdId,{response:text});},
  refund:()=>refundAI(holdId),
 });
 return NextResponse.json({response,tokensUsed:cost});
}catch(error){if(error instanceof MemoryError)return NextResponse.json({error:error.message},{status:error.status});if(error instanceof NoReviewCredits)return NextResponse.json({error:"Crédits insuffisants. Consultez votre offre ou attendez le renouvellement."},{status:402});if(error instanceof Error&&error.message==="Unauthorized")return NextResponse.json({error:"Connectez-vous pour préparer une réponse."},{status:401});console.error("Review generation failed:",error instanceof Error?error.name:"Unknown");return NextResponse.json({error:"La génération est temporairement indisponible. Aucun crédit n’est consommé si elle échoue."},{status:503});}}
