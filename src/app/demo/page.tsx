import type { Metadata } from "next";
import { RestaurantApp } from "@/components/memory/restaurant-app";
export const metadata:Metadata={title:"Démonstration du copilote restaurant",description:"Explorez la mémoire d’un restaurant fictif : caisse, factures, salle et recettes, sans appel IA.",robots:{index:false,follow:true},alternates:{canonical:"https://ia-restaurant.fr/demo"}};
export default function DemoPage(){return <div className="memory-site memory-dashboard-container"><RestaurantApp demo/></div>;}
