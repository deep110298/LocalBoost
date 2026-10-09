import { NextResponse } from "next/server";
import { requireBusinessOwner } from "@/lib/api-auth";

// GET /api/menu/items?business_id=xxx — list items (owner view, includes unavailable)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const auth = await requireBusinessOwner(searchParams.get("business_id"));
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  const { data: items, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items });
}

// POST /api/menu/items — { business_id, category_id?, name, description?, price_cents }
export async function POST(req: Request) {
  const body = await req.json();
  const auth = await requireBusinessOwner(body.business_id);
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  const name = (body.name as string | undefined)?.trim();
  const price_cents = Math.round(Number(body.price_cents));
  if (!name || !Number.isFinite(price_cents) || price_cents < 0) {
    return NextResponse.json({ error: "name and valid price_cents required" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      business_id: business.id,
      category_id: body.category_id || null,
      name,
      description: (body.description as string | undefined)?.trim() || null,
      price_cents,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

// PUT /api/menu/items — { business_id, id, name?, description?, price_cents?, available?, category_id? }
export async function PUT(req: Request) {
  const body = await req.json();
  const auth = await requireBusinessOwner(body.business_id);
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if (body.name !== undefined) patch.name = String(body.name).trim();
  if (body.description !== undefined) patch.description = String(body.description).trim() || null;
  if (body.price_cents !== undefined) {
    const p = Math.round(Number(body.price_cents));
    if (!Number.isFinite(p) || p < 0) return NextResponse.json({ error: "invalid price" }, { status: 400 });
    patch.price_cents = p;
  }
  if (body.available !== undefined) patch.available = !!body.available;
  if (body.category_id !== undefined) patch.category_id = body.category_id || null;

  const { data, error } = await supabase
    .from("menu_items")
    .update(patch)
    .eq("id", body.id)
    .eq("business_id", business.id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

// DELETE /api/menu/items?business_id=xxx&id=yyy
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const auth = await requireBusinessOwner(searchParams.get("business_id"));
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id)
    .eq("business_id", business.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
