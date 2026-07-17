"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";

/**
 * FAQ as an accessible accordion: button + aria-expanded, animated with the
 * grid-template-rows trick (works without JS-measured heights). One item open
 * at a time keeps the list scannable.
 *
 * Also emits FAQPage JSON-LD (always the Spanish copy — the crawlable default
 * language of the site) so the questions are eligible for rich results.
 */
export function Faq() {
  const { lang } = useLanguage();
  const t = copy[lang].faq;
  const [open, setOpen] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.es.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section
      id="faq"
      className="mx-auto max-w-[1280px] px-5 py-14 dt:grid dt:grid-cols-[32fr_68fr] dt:items-start dt:gap-[60px] dt:px-14 dt:py-[110px]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8 dt:mb-0">
        <p className="m-0 mb-3 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase dt:text-[13px] dt:tracking-[2.5px]">
          {t.eyebrow}
        </p>
        <h2 className="m-0 font-serif text-[30px] leading-[1.1] font-semibold dt:text-[44px]">
          {t.title}
        </h2>
      </div>

      <div className="flex flex-col">
        {t.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-t border-ink-line first:border-t-0">
              <h3 className="m-0">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-5 bg-transparent py-5 text-left dt:py-6"
                >
                  <span
                    className={`font-serif text-[18px] leading-[1.3] font-semibold transition-colors dt:text-[21px] ${
                      isOpen ? "text-sello" : "text-ink-text"
                    }`}
                  >
                    {item.q}
                  </span>
                  {/* Plus that turns into a minus — drawn, not a glyph */}
                  <span
                    aria-hidden
                    className="relative h-[18px] w-[18px] shrink-0"
                  >
                    <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 bg-ink-muted transition-colors group-hover:bg-ink-text" />
                    <span
                      className={`absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 bg-ink-muted transition-transform duration-300 ${
                        isOpen ? "rotate-90 opacity-0" : ""
                      }`}
                    />
                  </span>
                </button>
              </h3>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="m-0 max-w-[68ch] pb-6 text-[14.5px] leading-[1.65] text-[#C7CCC2] dt:pb-7 dt:text-[16px]">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
