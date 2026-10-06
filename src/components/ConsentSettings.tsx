"use client";
export default function ConsentSettings({locale="fr"}:{locale?:"fr"|"en"}){return <button type="button" className="text-sm text-text-secondary underline underline-offset-4" onClick={()=>{(window as unknown as {Consent?:{open:()=>void}}).Consent?.open();}}>{locale==="fr"?"Gérer mes cookies":"Cookie preferences"}</button>;}
