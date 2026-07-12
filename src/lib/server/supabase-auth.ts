import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { requireEnv } from "./env";

/**
 * Request-scoped Supabase client bound to the user's session cookies.
 *
 * Unlike the service-role client (src/lib/server/supabase.ts), this one runs as
 * the signed-in user, so RLS applies — use it for anything that should be
 * limited to what that user is allowed to see. Use the service-role client only
 * for trusted operations that must bypass RLS.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` from a Server Component is a no-op; middleware refreshes
            // the session cookie instead. Safe to ignore here.
          }
        },
      },
    },
  );
}

/**
 * Returns the authenticated user, or null. Route handlers should 401 on null
 * before doing any work.
 */
export async function getAuthUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
