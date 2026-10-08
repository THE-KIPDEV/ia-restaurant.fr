import type { Metadata } from "next";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/config";
import "@/styles/globals.css";
import "@/styles/memory.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — L'IA au service de votre restaurant`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.descriptionFr,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — L'IA au service de votre restaurant`,
    description: siteConfig.descriptionFr,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — L'IA au service de votre restaurant`,
    description: siteConfig.descriptionFr,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script src="https://orbeconsent.com/c/006f3daae259c24f.js" />
        <script
          suppressHydrationWarning
          type="text/plain"
          data-consent="mesure"
          src="https://kipstats.com/tracker.js"
          data-site="kp_edd03c1b"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-0 text-text-primary antialiased">
        {children}
        <Toaster
          theme="light"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-surface-3)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
            },
          }}
        />
              {/* kip-pay:gabarit : le paiement se fait dans la page, à la marque du site.
            La colle se repère seule pour trouver son module, et la clé publique
            revient avec la session — rien à déclarer au build. */}
        <link rel="stylesheet" href="/kip-pay.css" />
        <script src="/js/kip-pay-tunnel.js" defer />
      </body>
    </html>
  );
}
