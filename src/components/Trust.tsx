"use client";

import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";

export function Trust() {
  const { lang } = useLanguage();
  const t = copy[lang].trust;

  return (
    <section className="border-b border-ink-line">
      <div className="mx-auto flex max-w-[1280px] flex-col px-5 py-8 dt:flex-row dt:items-center dt:gap-[26px] dt:px-14 dt:py-11">
        <span className="mb-3.5 inline-block w-fit rounded-tl-[6px] rounded-tr-[4px] rounded-br-[7px] rounded-bl-[4px] border border-ink-muted/45 px-3 py-1.5 font-mono text-[11.5px] tracking-[1.5px] text-ink-text dt:mb-0 dt:shrink-0 dt:px-3.5 dt:py-2 dt:text-[13px]">
          {t.badge}
        </span>
        <p className="m-0 text-[14px] leading-[1.55] text-[#C7CCC2] dt:text-[16px] dt:leading-[1.5]">
          {t.body}
        </p>
      </div>
    </section>
  );
}
