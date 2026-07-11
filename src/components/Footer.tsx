"use client";

import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";

export function Footer() {
  const { lang } = useLanguage();
  const t = copy[lang].footer;

  return (
    <footer className="border-t border-ink-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2.5 px-5 pt-6 pb-[34px] text-[12.5px] text-ink-muted dt:flex-row dt:items-center dt:justify-between dt:gap-0 dt:px-14 dt:py-[30px] dt:text-[13.5px]">
        <span>{t.copyright}</span>
        <div className="flex gap-5 dt:gap-7">
          <a href="#" className="text-ink-muted no-underline hover:text-ink-muted">
            {t.legal}
          </a>
          <a href="#" className="text-ink-muted no-underline hover:text-ink-muted">
            {t.privacy}
          </a>
          <a
            href={`mailto:${t.email}`}
            className="text-ink-muted no-underline hover:text-ink-muted"
          >
            {t.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
