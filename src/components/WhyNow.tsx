"use client";

import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";

/**
 * "¿Por qué ahora?" — three tight dossier rows instead of floating blocks.
 * Left: the section's voice (eyebrow + title). Right: one row per reason,
 * each anchored to a concrete institution via a paper tag chip, separated by
 * hairline rules. A terracotta accent bar grows on hover — structure first,
 * whitespace second.
 */
export function WhyNow() {
  const { lang } = useLanguage();
  const t = copy[lang].whyNow;

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-14 dt:grid dt:grid-cols-[34fr_66fr] dt:items-start dt:gap-[70px] dt:px-14 dt:py-[100px]">
      <div className="mb-9 dt:mb-0">
        <p className="m-0 mb-3 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase dt:text-[13px] dt:tracking-[2.5px]">
          {t.eyebrow}
        </p>
        <h2 className="text-pretty m-0 font-serif text-[30px] leading-[1.12] font-semibold dt:text-[44px] dt:leading-[1.1]">
          {t.title}
        </h2>
      </div>

      <ol className="m-0 flex list-none flex-col p-0">
        {t.reasons.map((r, i) => (
          <li
            key={r.tag}
            className="group relative border-t border-ink-line py-7 pl-5 first:border-t-0 first:pt-0 dt:py-8 dt:pl-7 dt:first:pt-1"
          >
            {/* Accent bar: hairline at rest, grows terracotta on hover */}
            <span
              aria-hidden
              className="absolute top-3 bottom-3 left-0 w-[2px] bg-ink-line transition-colors duration-300 group-first:top-0 group-hover:bg-sello"
            />
            <div className="mb-2.5 flex items-center gap-3">
              <span className="font-mono text-[12.5px] text-sello dt:text-[13.5px]">
                0{i + 1}
              </span>
              <span className="rounded-tl-[6px] rounded-tr-[3px] rounded-br-[7px] rounded-bl-[3px] bg-paper px-2.5 py-[3px] font-mono text-[10px] font-medium tracking-[1.2px] text-paper-text uppercase dt:text-[10.5px]">
                {r.tag}
              </span>
            </div>
            <p className="text-pretty m-0 mb-2 max-w-[34ch] font-serif text-[21px] leading-[1.25] font-semibold dt:text-[27px]">
              {r.lead}
            </p>
            <p className="m-0 max-w-[58ch] text-[14.5px] leading-[1.6] text-[#C7CCC2] dt:text-[16px]">
              {r.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
