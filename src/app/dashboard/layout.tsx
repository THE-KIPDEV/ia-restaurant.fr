import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
export const metadata={robots:{index:false,follow:false}};
export default async function DashboardLayout({children}:{children:React.ReactNode}){
  const user=await getCurrentUser();if(!user)redirect("/sign-in");
  return <div className="memory-site min-h-screen"><header className="memory-account-header"><Link className="memory-brand" href="/dashboard"><span className="memory-logo">ia.</span><strong>IA Restaurant</strong></Link><nav aria-label="Compte"><Link href="/dashboard">Mon restaurant</Link><Link href="/dashboard/billing">Abonnement</Link><Link href="/dashboard/settings">Mon compte</Link></nav></header><div className="mx-auto max-w-[1500px]">{children}</div></div>;
}
