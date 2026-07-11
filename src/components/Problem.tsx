"use client";

import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";

export function Problem() {
  const { lang } = useLanguage();
  const t = copy[lang].problem;

  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-5 pb-[60px] dt:px-14 dt:pt-[30px] dt:pb-[110px]">
      <p className="m-0 mb-6 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase dt:mb-[38px] dt:text-[13px] dt:tracking-[2.5px]">
        {t.eyebrow}
      </p>
      <div className="flex max-w-[880px] flex-col gap-[18px] dt:gap-[26px]">
        <p className="text-pretty m-0 font-serif text-[21px] leading-[1.3] font-medium dt:text-[34px] dt:leading-[1.25]">
          {t.line1}
        </p>
        <p className="text-pretty m-0 ml-[22px] font-serif text-[21px] leading-[1.3] font-medium text-[#C7CCC2] dt:ml-16 dt:text-[34px] dt:leading-[1.25]">
          {t.line2}
        </p>
        <p className="text-pretty m-0 ml-11 font-serif text-[21px] leading-[1.3] font-medium text-ink-muted dt:ml-32 dt:text-[34px] dt:leading-[1.25]">
          {t.line3}
        </p>
      </div>
      <p className="m-0 mt-7 text-[15px] leading-[1.55] text-[#C7CCC2] dt:mt-11 dt:max-w-[56ch] dt:text-[18px]">
        {t.closing}
      </p>
    </section>
  );
}
