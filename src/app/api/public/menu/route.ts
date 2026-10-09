import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

// GET /api/public/menu?slug=xxx — public menu for the restaurant website.
// No auth: RLS allows public SELECT on menu tables.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, address, phone, slug")
    .eq("slug", slug)
    .single();
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: categories } = await supabase
    .from("menu_categories")
    .select("id, name")
    .eq("business_id", business.id)
    .order("sort_order");
  const { data: items } = await supabase
    .from("menu_items")
    .select("id, category_id, name, description, price_cents")
    .eq("business_id", business.id)
    .eq("available", true)
    .order("sort_order");

  return NextResponse.json({ business, categories: categories ?? [], items: items ?? [] });
}
