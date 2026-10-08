import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { syncSubscription,creditPurchase } from "@/lib/subscription";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  if(!rateLimit("webhook:stripe",100,60_000).success)return NextResponse.json({error:"Rate limit exceeded"},{status:429});
  const body=await req.text(),signature=req.headers.get("stripe-signature");
  if(!signature)return NextResponse.json({error:"Missing signature"},{status:400});
  const stripe=getStripe();let event;
  try{event=stripe.webhooks.constructEvent(body,signature,process.env.STRIPE_WEBHOOK_SECRET!);}catch{return NextResponse.json({error:"Invalid signature"},{status:400});}
  try{
    switch(event.type){
      case "checkout.session.completed":{
        const session=event.data.object;
        if(session.metadata?.site!=="ia-restaurant.fr"||session.mode!=="subscription"||!session.metadata.userId||session.payment_status!=="paid")break;
        const id=typeof session.subscription==="string"?session.subscription:session.subscription?.id;if(!id)break;
        await syncSubscription(await stripe.subscriptions.retrieve(id),session.metadata.userId);break;
      }
      case "invoice.payment_succeeded":{
        const invoice=event.data.object;const id=typeof invoice.subscription==="string"?invoice.subscription:invoice.subscription?.id;
        if(id)await syncSubscription(await stripe.subscriptions.retrieve(id));break;
      }
      case "customer.subscription.updated":await syncSubscription(event.data.object,undefined,false);break;
      case "customer.subscription.deleted":{
        const subscription=event.data.object;if(subscription.metadata.site!=="ia-restaurant.fr")break;
        await prisma.$transaction(async tx=>{
          const user=await tx.user.findUnique({where:{stripeSubscriptionId:subscription.id}});if(!user) return;
          await tx.$queryRaw`SELECT id FROM users WHERE id=${user.id} FOR UPDATE`;
          const current=await tx.user.findUniqueOrThrow({where:{id:user.id}});
          await tx.user.update({where:{id:user.id},data:{plan:"FREE",stripeSubscriptionId:null,stripePriceId:null,stripeCurrentPeriodEnd:null,tokenBalance:current.purchasedTokenBalance,tokenResetAt:null,creditPeriodEnd:null}});
        });break;
      }
      case "payment_intent.succeeded":{
        const payment=event.data.object;if(payment.metadata.site!=="ia-restaurant.fr")break;
        const amount=Number(payment.metadata.tokenAmount),userId=payment.metadata.userId;
        if(userId && Number.isSafeInteger(amount) && amount>0 && amount<=100000)await creditPurchase(userId,amount,payment.amount/100,payment.id);break;
      }
    }
    return NextResponse.json({received:true});
  }catch(error){console.error("Stripe webhook:",error instanceof Error?error.name:"error");return NextResponse.json({error:"Webhook handler error"},{status:500});}
}
