import { NextResponse } from "next/server";
import { exchangeCode } from "@/lib/google";
import { requireBusinessOwner } from "@/lib/api-auth";

// GET /api/google/callback?code=...&state=<business_id>
// Google redirects here after consent. Exchanges the code for tokens and
// stores them on the business's google_connections row.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/";
  const fail = (reason: string) =>
    NextResponse.redirect(`${appUrl}/dashboard/settings?google=error&reason=${reason}`);

  const code = searchParams.get("code");
  const businessId = searchParams.get("state");
  if (searchParams.get("error") || !code || !businessId) return fail("denied");

  const auth = await requireBusinessOwner(businessId);
  if ("error" in auth) return fail("auth");
  const { supabase } = auth;

  try {
    const tokens = await exchangeCode(code);
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    // Preserve the existing refresh token if Google didn't return a new one.
    const { data: existing } = await supabase
      .from("google_connections")
      .select("refresh_token")
      .eq("business_id", businessId)
      .single();

    const { error } = await supabase.from("google_connections").upsert(
      {
        business_id: businessId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? existing?.refresh_token ?? null,
        expires_at: expiresAt,
        updated_at: now,
      },
      { onConflict: "business_id" }
    );
    if (error) throw new Error(error.message);

    return NextResponse.redirect(`${appUrl}/dashboard/settings?google=connected`);
  } catch (e) {
    console.error("Google OAuth callback failed:", e);
    return fail("exchange");
  }
}
