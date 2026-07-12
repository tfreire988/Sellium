import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark, Wordmark } from "@/components/Logo";

/**
 * Shared layout for the legal documents (aviso legal, privacidad, cookies).
 * Deliberately language-independent: these are jurisdiction-specific documents
 * (España — RGPD/LOPDGDD/LSSI-CE) and are served in Spanish only, so they do
 * NOT use the ES/EN copy dictionary or the client language context.
 */
export function LegalPage({
  title,
  updated,
  current,
  children,
}: {
  title: string;
  updated: string;
  current: "aviso-legal" | "privacidad" | "cookies";
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="mx-auto flex max-w-[820px] items-center justify-between px-5 py-[18px] dt:py-[26px]">
        <Link href="/" className="flex items-center gap-[9px] no-underline hover:no-underline">
          <LogoMark size={28} />
          <Wordmark className="text-[19px]" />
        </Link>
        <Link href="/" className="text-[13.5px] text-ink-muted no-underline hover:text-ink-text">
          ← Volver al inicio
        </Link>
      </nav>

      <main className="mx-auto max-w-[820px] px-5 pt-6 pb-16 dt:pt-10 dt:pb-24">
        <h1 className="m-0 mb-2 font-serif text-[32px] leading-[1.12] font-semibold dt:text-[44px]">
          {title}
        </h1>
        <p className="m-0 mb-8 font-mono text-[12.5px] text-ink-muted dt:mb-12 dt:text-[13px]">
          Última actualización: {updated}
        </p>

        <div className="flex flex-col gap-6 text-[15px] leading-[1.65] text-[#C7CCC2] dt:text-[16px]">
          {children}
        </div>

        <nav className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-line pt-6 text-[13.5px]">
          <LegalNavLink href="/legal/aviso-legal" active={current === "aviso-legal"}>
            Aviso legal
          </LegalNavLink>
          <LegalNavLink href="/legal/privacidad" active={current === "privacidad"}>
            Política de privacidad
          </LegalNavLink>
          <LegalNavLink href="/legal/cookies" active={current === "cookies"}>
            Política de cookies
          </LegalNavLink>
        </nav>
      </main>
    </div>
  );
}

function LegalNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  if (active) {
    return <span className="font-medium text-ink-text">{children}</span>;
  }
  return (
    <Link href={href} className="text-link no-underline hover:text-sello">
      {children}
    </Link>
  );
}

/* ---- Prose helpers ---------------------------------------------------- */

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="m-0 mt-6 mb-1 font-serif text-[22px] font-semibold text-ink-text dt:text-[26px]">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="m-0 mt-3 mb-1 text-[16px] font-semibold text-ink-text dt:text-[17px]">
      {children}
    </h3>
  );
}

export function P({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`m-0 ${className}`}>{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="pl-1">{children}</li>;
}

/** Placeholder the operator must fill with their real company data before launch. */
export function Fill({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded-[3px] bg-alerta/25 px-1 py-px font-mono text-[0.85em] text-ink-text">
      [{children}]
    </mark>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-tl-[8px] rounded-tr-[4px] rounded-br-[9px] rounded-bl-[5px] border border-ink-line">
      <table className="w-full border-collapse text-left text-[13.5px] dt:text-[14px]">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="border-b border-ink-line px-3 py-2.5 font-medium text-ink-text"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td
                  key={j}
                  className="border-b border-ink-line/60 px-3 py-2.5 align-top text-[#C7CCC2] last:border-b-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
