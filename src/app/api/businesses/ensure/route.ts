import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { makeSlug } from "@/lib/slug";

// POST /api/businesses/ensure — get the user's first business, or create one.
// Used by dashboard pages that need a business id without a setup flow.
export async function POST() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: existing } = await supabase
    .from("businesses")
    .select("id, name, slug")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();
  if (existing) return NextResponse.json({ business: existing, created: false });

  const { data, error } = await supabase
    .from("businesses")
    .insert({ user_id: user.id, name: "My business", slug: makeSlug("My business") })
    .select("id, name, slug")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ business: data, created: true });
}
