import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

/** Verifies the caller is signed in and owns the business. Returns 401/404 responses on failure. */
export async function requireBusinessOwner(businessId: string | null) {
  if (!businessId) {
    return { error: NextResponse.json({ error: "business_id required" }, { status: 400 }) };
  }
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  }
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("id", businessId)
    .eq("user_id", user.id)
    .single();
  if (!business) {
    return { error: NextResponse.json({ error: "Business not found" }, { status: 404 }) };
  }
  return { supabase, user, business: business as { id: string; name: string } };
}
