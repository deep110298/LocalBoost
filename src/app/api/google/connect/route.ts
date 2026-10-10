import { NextResponse } from "next/server";
import { getGoogleOAuthUrl } from "@/lib/google";
import { requireBusinessOwner } from "@/lib/api-auth";

// GET /api/google/connect?business_id=xxx
// Verifies ownership, then redirects the owner to Google's consent screen.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const auth = await requireBusinessOwner(searchParams.get("business_id"));
  if ("error" in auth) return auth.error;

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.NEXT_PUBLIC_APP_URL) {
    // OAuth isn't wired up in this environment yet — send the owner back to
    // Settings with a friendly banner instead of a raw JSON error page.
    return NextResponse.redirect(`${origin}/dashboard/settings?google=not-configured`);
  }
  return NextResponse.redirect(getGoogleOAuthUrl(auth.business.id));
}
