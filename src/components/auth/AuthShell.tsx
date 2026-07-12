import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";

/**
 * Centered card layout shared by the login and registro screens. Plain
 * (non-client) component so both server and client pages can use it.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5 py-12">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="mb-8 flex items-center gap-2.5 no-underline hover:no-underline">
          <LogoMark size={30} />
          <Wordmark className="text-[20px] text-ink-text" />
        </Link>

        <div className="rounded-tl-[12px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[6px] bg-paper px-7 py-8 text-paper-text shadow-[0_18px_44px_rgba(15,10,4,0.45)]">
          <h1 className="m-0 mb-1.5 font-serif text-[26px] font-semibold">{title}</h1>
          <p className="m-0 mb-6 text-[14px] leading-[1.5] text-paper-muted">{subtitle}</p>
          {children}
        </div>

        <p className="mt-6 text-center text-[13.5px] text-ink-muted">{footer}</p>
      </div>
    </main>
  );
}

/** Shared input styling for the auth forms. */
export const authInputClass =
  "w-full rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border border-paper-border bg-paper-2 px-3.5 py-2.5 text-[15px] text-paper-text outline-none focus:border-sello";

/** Shared primary-button styling for the auth forms. */
export const authButtonClass =
  "w-full rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-sello py-3 text-center text-[15px] font-semibold text-ink no-underline hover:bg-sello-hover disabled:opacity-60";
