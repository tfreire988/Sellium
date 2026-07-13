"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";
import { NumberSeal } from "./NumberSeal";
import { InvoiceThumb } from "./InvoiceThumb";
import { MiniStamp } from "./MiniStamp";

/**
 * Three equal-weight steps. Every column shares the same anatomy — seal +
 * title, body, and a paper "exhibit" pinned to the bottom (the bills, the
 * recipient chip, the stamped report) — so they read as siblings. The brand's
 * hand-made imperfection lives only in the exhibits' slight rotations.
 */
function Step({
  number,
  title,
  body,
  children,
}: {
  number: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center gap-3 dt:mb-3.5">
        <span className="shrink-0">
          <NumberSeal size={38} number={number} />
        </span>
        <h3 className="m-0 font-serif text-[21px] leading-[1.2] font-semibold dt:text-[24px]">
          {title}
        </h3>
      </div>
      <p className="m-0 text-[14.5px] leading-[1.6] text-[#C7CCC2] dt:text-[15.5px]">
        {body}
      </p>
      <div className="mt-7 dt:mt-auto dt:pt-9">{children}</div>
    </div>
  );
}

export function HowItWorks() {
  const { lang } = useLanguage();
  const t = copy[lang].howItWorks;

  return (
    <section
      id="como-funciona"
      className="mx-auto max-w-[1280px] px-5 pb-[60px] dt:px-14 dt:pb-[120px]"
    >
      <h2 className="m-0 mb-8 font-serif text-[32px] leading-none font-semibold dt:mb-14 dt:text-[64px]">
        {t.title}
      </h2>

      <div className="flex flex-col gap-12 dt:grid dt:grid-cols-3 dt:items-stretch dt:gap-12">
        <Step number="1" title={t.step1.title} body={t.step1.body}>
          <div className="flex items-end gap-3.5">
            <span className="block -rotate-2">
              <InvoiceThumb accent="#B8763A" accentWidth="60%" lineWidths={["100%", "100%", "70%"]} />
            </span>
            <span className="mb-1.5 block rotate-1">
              <InvoiceThumb accent="#7C7368" accentWidth="45%" lineWidths={["100%", "80%", "55%"]} />
            </span>
            <span className="block -rotate-1">
              <InvoiceThumb accent="#4F6B4A" accentWidth="55%" lineWidths={["75%", "100%", "60%"]} />
            </span>
          </div>
        </Step>

        <Step number="2" title={t.step2.title} body={t.step2.body}>
          <div className="flex w-fit items-center gap-2.5 rounded-tl-[8px] rounded-tr-[4px] rounded-br-[9px] rounded-bl-[4px] bg-paper px-3.5 py-3 text-paper-text shadow-[0_10px_24px_rgba(15,10,4,0.38)] -rotate-[0.6deg]">
            <span className="font-mono text-[10.5px] tracking-[1px] text-paper-muted uppercase">
              {t.step2.chipLabel}
            </span>
            <span className="text-[13px] font-medium dt:text-[13.5px]">
              {t.step2.chipValue}
            </span>
            <span className="font-semibold text-verificado">✓</span>
          </div>
        </Step>

        <Step number="3" title={t.step3.title} body={t.step3.body}>
          <div className="relative mr-4 rounded-tl-[6px] rounded-tr-[10px] rounded-br-[5px] rounded-bl-[9px] bg-paper px-5 pt-[18px] pb-4 text-paper-text shadow-[0_10px_24px_rgba(15,10,4,0.38)] rotate-[0.8deg] dt:px-6 dt:pt-[22px] dt:pb-5">
            <p className="m-0 mb-2 font-mono text-[9.5px] tracking-[1px] text-paper-muted uppercase dt:mb-2.5 dt:text-[10.5px] dt:tracking-[1.5px]">
              {t.step3.filename}
            </p>
            <div className="flex items-baseline justify-between border-t-[1.5px] border-paper-text pt-2 dt:pt-2.5">
              <span className="text-[13px] font-semibold dt:text-[14px]">
                {t.step3.totalLabel}
              </span>
              <span className="font-mono text-[17px] font-medium dt:text-[19px]">
                {t.step3.totalValue}
              </span>
            </div>
            <div className="absolute -top-[18px] -right-3 -rotate-[11deg] dt:-top-[20px] dt:-right-4">
              <MiniStamp size={64} word={t.step3.stampWord} variant="step" />
            </div>
          </div>
        </Step>
      </div>
    </section>
  );
}
