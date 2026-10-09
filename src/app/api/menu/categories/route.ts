import { NextResponse } from "next/server";
import { requireBusinessOwner } from "@/lib/api-auth";

// GET /api/menu/categories?business_id=xxx — list categories with items
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const auth = await requireBusinessOwner(searchParams.get("business_id"));
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  const { data: categories, error } = await supabase
    .from("menu_categories")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories });
}

// POST /api/menu/categories — { business_id, name }
export async function POST(req: Request) {
  const body = await req.json();
  const auth = await requireBusinessOwner(body.business_id);
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  const name = (body.name as string | undefined)?.trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const { data, error } = await supabase
    .from("menu_categories")
    .insert({ business_id: business.id, name })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ category: data });
}
