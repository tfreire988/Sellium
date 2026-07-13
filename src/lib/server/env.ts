import "server-only";

/**
 * Server-only environment access. Every secret here MUST stay server-side —
 * none is prefixed with NEXT_PUBLIC (see sellium-brief-desarrollo.md §4).
 *
 * `requireEnv` throws a clear error at call time (not module load) so the app
 * still boots for routes that don't need a given key, and a missing key during
 * local scaffolding surfaces as a readable 500 rather than a crash on import.
 */
export function requireEnv(name: EnvKey): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export function optionalEnv(name: EnvKey): string | undefined {
  return process.env[name] || undefined;
}

export type EnvKey =
  // Supabase
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  // AI invoice extraction — Google Gemini (free tier) is the default;
  // ANTHROPIC_API_KEY stays supported for switching back to Claude.
  | "GEMINI_API_KEY"
  | "ANTHROPIC_API_KEY"
  // Stripe
  | "STRIPE_SECRET_KEY"
  | "STRIPE_WEBHOOK_SECRET"
  | "STRIPE_PRICE_INFORME_UNICO"
  | "STRIPE_PRICE_GESTORIA_MENSUAL"
  // Email
  | "RESEND_API_KEY"
  | "SELLIUM_FROM_EMAIL";
