"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";

export function FinalCta() {
  const { lang } = useLanguage();
  const t = copy[lang].finalCta;

  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-[60px] pb-[70px] dt:px-14 dt:py-[110px]">
      <h2 className="text-pretty m-0 mb-6 font-serif text-[30px] leading-[1.15] font-semibold dt:mb-[34px] dt:max-w-[20ch] dt:text-[52px] dt:leading-[1.1]">
        {t.title}
      </h2>
      <div className="flex flex-col gap-3.5 dt:flex-row dt:items-center dt:gap-[18px]">
        <Link
          href="/registro"
          className="block rounded-tl-[9px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[6px] bg-cta py-[15px] text-center text-[16px] font-semibold text-paper-2 no-underline hover:bg-cta-hover hover:text-paper-2 hover:no-underline dt:px-[30px] dt:text-[17px]"
        >
          {t.cta}
        </Link>
        <span className="text-center font-mono text-[12px] text-ink-muted dt:text-left dt:text-[13px]">
          {t.note}
        </span>
      </div>
    </section>
  );
}
