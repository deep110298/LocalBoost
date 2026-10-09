import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { makeSlug } from "@/lib/slug";

// POST /api/businesses — create a business row for the signed-in user.
// Body: { name }
export async function POST(req: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json();
  const name = (body.name as string | undefined)?.trim() || "My business";
  const { data, error } = await supabase
    .from("businesses")
    .insert({ user_id: user.id, name, slug: makeSlug(name) })
    .select("id, name, slug")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ business: data });
}
