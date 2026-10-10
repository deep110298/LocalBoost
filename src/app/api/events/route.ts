import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

// POST /api/events — log a user action for follow-ups and analytics.
// Body: { business_id?, type, data? }
// Only allowlisted client-loggable types; anything else is rejected.
const CLIENT_TYPES = ["plan_interest"] as const;

export async function POST(req: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json();
  const type = body.type as string | undefined;
  if (!type || !(CLIENT_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json({ error: "type not allowed" }, { status: 400 });
  }

  // If a business_id is given, verify it belongs to the caller.
  let businessId: string | null = null;
  if (body.business_id) {
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", body.business_id)
      .eq("user_id", user.id)
      .single();
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });
    businessId = business.id;
  }

  const { error } = await supabase.from("events").insert({
    business_id: businessId,
    user_id: user.id,
    type,
    data: (body.data as Record<string, unknown> | undefined) ?? {},
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
