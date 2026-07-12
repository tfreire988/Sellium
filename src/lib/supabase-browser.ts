"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client, authenticated with the public anon key.
 *
 * The anon key is safe to ship to the client: it grants only what RLS allows
 * for the signed-in user's JWT (see supabase/migrations/0002_rls.sql). All
 * privileged work goes through the server routes with the service-role key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
