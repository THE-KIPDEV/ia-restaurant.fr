import type { Locale } from "@/lib/i18n";
import { createT, type TranslationKey } from "@/lib/i18n";
const faqKeys = [1, 2, 3, 4, 5];
export function FAQ({ locale }: { locale: Locale }) {
  const t = createT(locale);
  return <section className="py-20 lg:py-28">
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <h2 className="mb-10 text-center text-3xl font-bold">{t("faq.title")}</h2>
      <div className="space-y-3">{faqKeys.map(i => <details key={i} className="card p-5">
        <summary className="cursor-pointer font-medium text-text-primary">{t(`faq.q${i}` as TranslationKey)}</summary>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">{t(`faq.a${i}` as TranslationKey)}</p>
      </details>)}</div>
    </div>
  </section>;
}
