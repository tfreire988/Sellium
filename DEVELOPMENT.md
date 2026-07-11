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

## Out of scope

`project/uploads/sellium-brief-desarrollo.md` describes the full product
architecture (Supabase, Stripe, Claude vision extraction, PDF generation). This
repo implements only the **landing page**; the app screens (`Sellium App.dc.html`)
and backend are separate future work.
