import Link from "next/link";
import { Database } from "lucide-react";
import { getCurrentUser,hasActiveSubscription,getUserPlan } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS,type PlanKey } from "@/lib/stripe";
import { RestaurantApp } from "@/components/memory/restaurant-app";
export const metadata={title:"La mémoire de votre restaurant"};
export default async function Dashboard(){
  const user=await getCurrentUser();if(!user)return null;
  const restaurants=await prisma.restaurant.findMany({where:{userId:user.id},orderBy:{createdAt:"asc"},select:{id:true,name:true,workspace:{select:{id:true}}}});
  const paid=hasActiveSubscription(user),existing=restaurants.some(r=>r.workspace);
  if(!paid&&!existing)return <div className="memory-site memory-paid-gate"><Database size={32}/><h1>Activez la mémoire de votre restaurant.</h1><p>La démonstration est ouverte à tous. Pour conserver vos documents et utiliser le copilote avec vos propres données, activez votre abonnement.</p><div className="memory-actions"><Link className="memory-button primary" href="/dashboard/billing">Activer mon copilote · 29 € / mois</Link><Link className="memory-button" href="/demo">Explorer la démonstration</Link></div></div>;
  const key=getUserPlan(user).toLowerCase() as PlanKey;
  return <div className="memory-dashboard-container"><RestaurantApp restaurants={restaurants.map(({id,name})=>({id,name}))} balance={user.tokenBalance} maxCredits={PLANS[key]?.tokens||2000} paid={paid}/></div>;
}
