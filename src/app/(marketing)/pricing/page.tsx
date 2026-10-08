import type { Metadata } from "next";
import { MemoryLanding } from "@/components/memory/landing";
export const metadata:Metadata={title:"Tarifs du copilote restaurant",description:"29 € par mois, 2 000 crédits IA inclus. Mémoire persistante, démonstration interactive sans IA et gestion du restaurant.",alternates:{canonical:"https://ia-restaurant.fr/pricing"}};
export default function Page(){return <MemoryLanding focus="pricing"/>;}
