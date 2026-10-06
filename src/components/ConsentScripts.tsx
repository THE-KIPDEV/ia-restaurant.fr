"use client";
import { useEffect } from "react";
export default function ConsentScripts(){useEffect(()=>{
  if(document.getElementById("restaurant-consent"))return;
  const tracker=document.createElement("script");tracker.type="text/plain";tracker.dataset.consent="mesure";tracker.dataset.consentSvc="kipstats";tracker.dataset.site="kp_edd03c1b";tracker.src="https://kipstats.com/tracker.js";document.head.appendChild(tracker);
  const consent=document.createElement("script");consent.id="restaurant-consent";consent.src="https://orbeconsent.com/c/006f3daae259c24f.js";document.head.appendChild(consent);
},[]);return null;}
