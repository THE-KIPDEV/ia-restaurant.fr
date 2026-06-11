"use client";
import Link from "next/link";
import { track } from "@/lib/kipstats";

/** <Link> qui émet `cta_click {cta}` au clic. Drop-in pour les CTA marketing. */
export default function CtaLink({ cta, href, className, children }: {
  cta: string; href: string; className?: string; children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => track("cta_click", { cta })}>
      {children}
    </Link>
  );
}
