import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireBusinessOwner } from "@/lib/api-auth";
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

// PUT /api/businesses — { business_id, name }
// Renames the owner's business. The public slug stays unchanged so the
// website URL keeps working.
export async function PUT(req: Request) {
  const body = await req.json();
  const auth = await requireBusinessOwner(body.business_id);
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  const name = (body.name as string | undefined)?.trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const { data, error } = await supabase
    .from("businesses")
    .update({ name })
    .eq("id", business.id)
    .select("id, name, slug")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ business: data });
}
