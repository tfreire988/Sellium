"use client";

import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";

export function Problem() {
  const { lang } = useLanguage();
  const t = copy[lang].problem;
  const lines = [t.line1, t.line2, t.line3];

  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-5 pb-[60px] dt:px-14 dt:pt-[30px] dt:pb-[110px]">
      <p className="m-0 mb-6 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase dt:mb-[38px] dt:text-[13px] dt:tracking-[2.5px]">
        {t.eyebrow}
      </p>

      <div className="dt:grid dt:grid-cols-[58fr_42fr] dt:items-center dt:gap-[70px]">
        {/* Pain points with mono index + hairline rule */}
        <div>
          <ul className="m-0 flex list-none flex-col gap-0 p-0">
            {lines.map((line, i) => (
              <li
                key={i}
                className="flex gap-4 border-t border-ink-line py-[18px] first:border-t-0 first:pt-0 dt:gap-6 dt:py-[26px]"
              >
                <span className="mt-1 shrink-0 font-mono text-[13px] text-sello dt:text-[15px]">
                  0{i + 1}
                </span>
                <p
                  className={`text-pretty m-0 font-serif text-[20px] leading-[1.3] font-medium dt:text-[30px] dt:leading-[1.25] ${
                    i === 0 ? "" : i === 1 ? "text-[#C7CCC2]" : "text-ink-muted"
                  }`}
                >
                  {line}
                </p>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-8 border-l-2 border-sello pl-4 text-[15px] leading-[1.55] text-[#C7CCC2] dt:mt-11 dt:max-w-[52ch] dt:text-[18px]">
            {t.closing}
          </p>
        </div>

        {/* The email that starts it all — the trigger, made concrete */}
        <div className="mt-9 dt:mt-0">
          <div className="relative mx-auto max-w-[420px] rotate-[0.6deg] rounded-tl-[11px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[7px] bg-paper p-5 text-paper-text shadow-[0_16px_40px_rgba(15,10,4,0.45)] dt:p-6">
            <div className="mb-3 flex items-start justify-between gap-3 border-b border-paper-border pb-3">
              <div className="min-w-0">
                <p className="m-0 truncate font-mono text-[11.5px] text-paper-text dt:text-[12.5px]">
                  {t.email.from}
                </p>
                <p className="m-0 mt-0.5 font-mono text-[10.5px] text-paper-muted dt:text-[11px]">
                  {t.email.date}
                </p>
              </div>
              <span className="shrink-0 rounded-tl-[5px] rounded-tr-[3px] rounded-br-[6px] rounded-bl-[3px] bg-error/12 px-2 py-1 font-mono text-[9.5px] font-semibold tracking-[0.5px] text-error uppercase">
                {t.email.tag}
              </span>
            </div>
            <p className="m-0 mb-2 font-serif text-[16px] font-semibold leading-[1.25] dt:text-[18px]">
              {t.email.subject}
            </p>
            <p className="m-0 text-[13.5px] leading-[1.6] text-[#4A443A] dt:text-[14.5px]">
              {t.email.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
