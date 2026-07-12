# Sellium — Landing (implementation)

Production implementation of the Sellium marketing landing, built from the
Claude Design handoff bundle in `project/` and `chats/`.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** — design tokens from `project/uploads/sellium-brief-diseno.md`
  are defined as `@theme` custom properties in `src/app/globals.css`
- Fonts: **Fraunces** (serif), **IBM Plex Sans** (body), **IBM Plex Mono** (figures),
  loaded via `next/font` in `src/app/layout.tsx`

## What's built

The mobile design the user had open (`project/Sellium Landing Movil.dc.html`) and
its desktop counterpart (`project/Sellium Landing.dc.html`) are merged into a
**single responsive page**. Per the design system there is exactly one breakpoint
(`dt: 860px` — see `globals.css`): stacked mobile below it, the wide layout at/above.

- `src/app/page.tsx` — composes all sections inside a `LanguageProvider`
- `src/lib/language-context.tsx` — client-side ES/EN toggle (default `es`)
- `src/lib/copy.ts` — all ES/EN copy, single source of truth
- `src/components/` — one component per section plus shared SVG marks
  (`LogoMark`, `HeroStamp`, `MiniStamp`, `NumberSeal`, `InvoiceIcon`, `GrainOverlay`)
- `DemoVideo.tsx` — the interactive 4-scene demo (play/pause, progress, scene
  labels), ported from the desktop prototype's timer logic. The mobile prototype
  omitted this section; here it's given a responsive treatment.

Copy reflects the user's final corrections from the chat: Rovira/Altavera names,
18.6 tCO₂e totals, MITECO 2026, **149 €** single report / **from 29 €/mo**
accountancy plan.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (static prerender)
npm run lint
```

## Backend groundwork (credential-free)

The scaffolding from `project/uploads/sellium-brief-desarrollo.md` that needs **no
keys yet** is in place:

- `supabase/migrations/0001_schema.sql` — full schema (§2)
- `supabase/migrations/0002_rls.sql` — Row Level Security (pyme sees own rows;
  gestoría also sees rows tied to its managed clients)
- `supabase/seed/factores_emision.sql` — **placeholder** factors, loudly flagged;
  must be replaced with the official MITECO figures before any real report (§5)
- `src/lib/emisiones.ts` — pure Scope 1/2/3 calculation, testable without a DB
- `src/lib/server/{env,supabase}.ts` — server-only env accessor + service-role
  client (marked `server-only`, so importing them into a client component fails
  the build)
- `src/app/api/{facturas/extraer, informes/generar, informes/enviar, stripe/webhook}/route.ts`
  — real handlers: input validation, auth-safe DB access, and Stripe signature
  verification are done; the parts needing live credentials (Claude vision call,
  PDF render, email send, Stripe/DB mutations) return `501` with a clear note
- `.env.example` — every key documented; only the two Supabase `NEXT_PUBLIC_*`
  values are browser-exposed, all secrets are server-only

### To make it live (needs credentials)

1. Create a Supabase project; run the two migrations, then the seed **after**
   replacing the placeholder MITECO factors with official values.
2. Fill `.env.local` from `.env.example` (Supabase, `ANTHROPIC_API_KEY`, Stripe,
   Resend).
3. Implement the `501` bodies: Storage download + Claude extraction, PDF render +
   upload, email send, and the Stripe/DB mutations.

## Still out of scope

The app screens (`project/Sellium App.dc.html`) and the authenticated dashboard
UI are separate future work.
