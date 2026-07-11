"use client";

import { useLanguage } from "@/lib/language-context";

export function LanguageToggle({ small = false }: { small?: boolean }) {
  const { lang, setLang } = useLanguage();

  const base = `font-mono cursor-pointer border-none bg-transparent text-ink-muted ${
    small ? "px-2.5 py-1.5 text-[11.5px]" : "px-3 py-1.5 text-[12.5px]"
  }`;
  const active = "bg-sello text-ink font-medium";

  return (
    <div className="flex gap-[2px] overflow-hidden rounded-tl-[6px] rounded-tr-[4px] rounded-br-[7px] rounded-bl-[4px] border border-ink-muted/40 font-mono">
      <button
        onClick={() => setLang("es")}
        className={`${base} ${lang === "es" ? active : ""}`}
      >
        ES
      </button>
      <button
        onClick={() => setLang("en")}
        className={`${base} ${lang === "en" ? active : ""}`}
      >
        EN
      </button>
    </div>
  );
}
