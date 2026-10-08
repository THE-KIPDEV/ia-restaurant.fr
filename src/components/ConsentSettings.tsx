"use client";
export default function ConsentSettings() {
  return <button type="button" className="text-sm underline underline-offset-4" onClick={() => {
    const consent = (window as unknown as { Consent?: { open: () => void } }).Consent;
    consent?.open();
  }}>Gérer mes cookies</button>;
}
