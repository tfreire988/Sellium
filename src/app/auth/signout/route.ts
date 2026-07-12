import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/server/supabase-auth";

export const runtime = "nodejs";

/** Signs the user out and returns them to /login. */
export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
}
