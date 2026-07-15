import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/features`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/legal`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const seoPages = [
    "ia-restaurant-paris",
    "intelligence-artificielle-restauration",
    "menu-engineering-ia",
    "analyse-marge-restaurant",
    "description-plat-ia",
    "repondre-avis-google-restaurant",
    "traduction-carte-restaurant",
    "optimiser-carte-restaurant",
    "social-media-restaurant-ia",
    "gestion-restaurant-ia",
    "logiciel-restauration-ia",
    "rentabilite-restaurant-ia",
    "formation-ia-restaurant",
  ].map((slug) => ({
    url: `${baseUrl}/seo/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...seoPages];
}
