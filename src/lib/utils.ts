import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "EUR", locale = "fr-FR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatNumber(n: number, locale = "fr-FR") {
  return new Intl.NumberFormat(locale).format(n);
}

export function formatDate(date: Date | string, locale = "fr-FR") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export function calculateMargin(sellPrice: number, costPrice: number): number {
  if (sellPrice === 0) return 0;
  return ((sellPrice - costPrice) / sellPrice) * 100;
}

export function classifyDish(
  popularity: number,
  margin: number,
  avgPopularity: number,
  avgMargin: number
): "star" | "puzzle" | "plowhorse" | "dog" {
  const highPop = popularity >= avgPopularity;
  const highMargin = margin >= avgMargin;
  if (highPop && highMargin) return "star";
  if (!highPop && highMargin) return "puzzle";
  if (highPop && !highMargin) return "plowhorse";
  return "dog";
}
