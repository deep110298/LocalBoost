import { NextResponse } from "next/server";
import { requireBusinessOwner } from "@/lib/api-auth";

// POST /api/google/select-location
// Body: { business_id, google_account_id, google_location_id, location_name }
// Saves which Google location LocalBoost manages for this business.
export async function POST(req: Request) {
  const body = await req.json();
  const { business_id, google_account_id, google_location_id, location_name } = body;
  const auth = await requireBusinessOwner(business_id);
  if ("error" in auth) return auth.error;
  const { supabase } = auth;

  if (!google_account_id || !google_location_id) {
    return NextResponse.json({ error: "google_account_id and google_location_id required" }, { status: 400 });
  }
  const { error } = await supabase
    .from("google_connections")
    .update({
      google_account_id,
      google_location_id,
      location_name: location_name ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", business_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
