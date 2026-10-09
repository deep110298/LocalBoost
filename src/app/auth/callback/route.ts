import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

// GET /auth/callback?code=... — Supabase Auth redirects here after a magic
// link (or OAuth) sign-in. Exchanges the code for a session, then lands on
// the dashboard.
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth`);
    }
  }
  return NextResponse.redirect(`${origin}/dashboard`);
}
