"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { createT, type TranslationKey } from "@/lib/i18n";

const faqKeys = [
  { q: "faq.q1" as TranslationKey, a: "faq.a1" as TranslationKey },
  { q: "faq.q2" as TranslationKey, a: "faq.a2" as TranslationKey },
  { q: "faq.q3" as TranslationKey, a: "faq.a3" as TranslationKey },
  { q: "faq.q4" as TranslationKey, a: "faq.a4" as TranslationKey },
  { q: "faq.q5" as TranslationKey, a: "faq.a5" as TranslationKey },
];

export function FAQ({ locale }: { locale: Locale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = createT(locale);

  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">{t("faq.title")}</span>
        </h2>

        <div className="space-y-3">
          {faqKeys.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="pr-4 font-medium text-text-primary">
                  {t(faq.q)}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-text-muted transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="border-t border-border-dim px-5 pb-5 pt-3">
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {t(faq.a)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
