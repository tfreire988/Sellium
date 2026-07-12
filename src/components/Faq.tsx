"use client";

import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";

export function Faq() {
  const { lang } = useLanguage();
  const t = copy[lang].faq;

  return (
    <section
      id="faq"
      className="mx-auto max-w-[1280px] px-5 py-14 dt:grid dt:grid-cols-[32fr_68fr] dt:items-start dt:gap-[60px] dt:px-14 dt:py-[110px]"
    >
      <div className="mb-8 dt:mb-0">
        <p className="m-0 mb-3 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase dt:text-[13px] dt:tracking-[2.5px]">
          {t.eyebrow}
        </p>
        <h2 className="m-0 font-serif text-[30px] leading-[1.1] font-semibold dt:text-[44px]">
          {t.title}
        </h2>
      </div>

      <div className="flex flex-col">
        {t.items.map((item) => (
          <div
            key={item.q}
            className="border-t border-ink-line py-6 first:border-t-0 first:pt-0 dt:py-7"
          >
            <h3 className="m-0 mb-2.5 font-serif text-[19px] leading-[1.25] font-semibold text-ink-text dt:text-[22px]">
              {item.q}
            </h3>
            <p className="m-0 max-w-[68ch] text-[14.5px] leading-[1.6] text-[#C7CCC2] dt:text-[16px]">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
