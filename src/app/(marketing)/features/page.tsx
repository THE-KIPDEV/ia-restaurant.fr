import type { Metadata } from "next";
import { MemoryLanding } from "@/components/memory/landing";
export const metadata:Metadata={title:"La mémoire et le copilote de votre restaurant",description:"Relevés de caisse, CA, factures, couverts, salle, recettes et équipe : découvrez IA Restaurant.",alternates:{canonical:"https://ia-restaurant.fr/features"}};
export default function Page(){return <MemoryLanding focus="features"/>;}
