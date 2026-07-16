import Link from "next/link";
import { ChefHat, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { createT } from "@/lib/i18n";
import { getNetworkLinks } from "@/lib/network";

export function Footer({ locale }: { locale: Locale }) {
  const t = createT(locale);
  const year = new Date().getFullYear();
  const network = getNetworkLinks("ia-restaurant.fr", 6);

  return (
    <footer className="border-t border-border-dim bg-surface-1">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-glow neon-border">
                <ChefHat className="h-4 w-4 text-neon" />
              </div>
              <span className="text-lg font-bold">
                IA <span className="neon-text">Restaurant</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-text-primary">
              {t("footer.product")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-sm text-text-muted hover:text-neon transition-colors">
                  {t("nav.features")}
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-text-muted hover:text-neon transition-colors">
                  {t("nav.pricing")}
                </Link>
              </li>
              <li>
                <Link href="/formation-ia-restaurant" className="text-sm text-text-muted hover:text-neon transition-colors">
                  {locale === "fr" ? "Formation IA restaurant" : "AI restaurant training"}
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="text-sm text-text-muted hover:text-neon transition-colors">
                  {t("nav.signUp")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-text-primary">
              {t("footer.company")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.pappers.fr/entreprise/kipdev-884120890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-neon transition-colors"
                >
                  Kipdev
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-text-primary">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-text-muted hover:text-neon transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-text-muted hover:text-neon transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-sm text-text-muted hover:text-neon transition-colors">
                  {t("footer.legalNotice")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {network.length > 0 && (
          <div className="mt-10 border-t border-border-dim pt-8">
            <h4 className="mb-4 text-sm font-semibold text-text-primary">
              {locale === "fr" ? "Nos autres outils" : "Our other tools"}
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {network.map((site) => (
                <a
                  key={site.domain}
                  href={`https://${site.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-2 rounded-xl border border-border-dim bg-surface-2 p-3 transition-colors hover:border-neon/40"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-text-secondary group-hover:text-neon transition-colors">
                      {site.label}
                    </span>
                    <span className="block text-xs text-text-muted truncate">
                      {site.desc}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted group-hover:text-neon transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 border-t border-border-dim pt-6">
          <p className="text-center text-xs text-text-muted">
            &copy; {year} Kipdev — IA Restaurant. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
