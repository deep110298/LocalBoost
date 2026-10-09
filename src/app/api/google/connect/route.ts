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
    return NextResponse.json(
      { error: "Google OAuth is not configured (GOOGLE_CLIENT_ID / NEXT_PUBLIC_APP_URL)" },
      { status: 500 }
    );
  }
  return NextResponse.redirect(getGoogleOAuthUrl(auth.business.id));
}
