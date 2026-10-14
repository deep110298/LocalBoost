import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireBusinessOwner } from "@/lib/api-auth";

const STATUSES = ["new", "preparing", "ready", "completed", "cancelled"] as const;

// GET /api/orders?business_id=xxx — owner's order inbox (newest first)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const auth = await requireBusinessOwner(searchParams.get("business_id"));
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  const status = searchParams.get("status");
  let query = supabase
    .from("orders")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(100);
  if (status && (STATUSES as readonly string[]).includes(status)) {
    query = query.eq("status", status);
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

interface OrderLine {
  item_id: string;
  qty: number;
}

// POST /api/orders — public: place an order from the website.
// Body: { slug, customer_name, customer_phone, note?, items: [{ item_id, qty }] }
// Prices are re-validated server-side from the menu — the client can't set them.
export async function POST(req: Request) {
  const body = await req.json();
  const { slug, customer_name, customer_phone, note, items } = body as {
    slug?: string;
    customer_name?: string;
    customer_phone?: string;
    note?: string;
    items?: OrderLine[];
  };
  if (!slug || !customer_name?.trim() || !customer_phone?.trim() || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "slug, customer_name, customer_phone, and items required" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", slug)
    .single();
  if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });

  // Validate items against the live menu and price from the DB.
  const ids = [...new Set(items.map((i) => i.item_id))];
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("id, name, price_cents")
    .eq("business_id", business.id)
    .eq("available", true)
    .in("id", ids);
  const byId = new Map((menuItems ?? []).map((m) => [m.id, m]));

  const lines: { item_id: string; name: string; price_cents: number; qty: number }[] = [];
  for (const line of items) {
    const menuItem = byId.get(line.item_id);
    const qty = Math.min(Math.max(Math.floor(Number(line.qty) || 0), 0), 20);
    if (!menuItem || qty === 0) continue;
    lines.push({ item_id: menuItem.id, name: menuItem.name, price_cents: menuItem.price_cents, qty });
  }
  if (lines.length === 0) {
    return NextResponse.json({ error: "No valid items in order" }, { status: 400 });
  }
  const subtotal_cents = lines.reduce((s, l) => s + l.price_cents * l.qty, 0);

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      business_id: business.id,
      customer_name: customer_name.trim().slice(0, 80),
      customer_phone: customer_phone.trim().slice(0, 30),
      note: note?.trim().slice(0, 300) || null,
      items: lines,
      subtotal_cents,
    })
    .select("id, created_at")
    .single();
  if (error || !order) return NextResponse.json({ error: "Could not place order" }, { status: 500 });

  // Short pickup code from the order id, e.g. "A3F9K2"
  const code = order.id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return NextResponse.json({ ok: true, order_id: order.id, code, subtotal_cents });
}

// PATCH /api/orders — owner updates status.
// Body: { business_id, order_id, status }
export async function PATCH(req: Request) {
  const body = await req.json();
  const auth = await requireBusinessOwner(body.business_id);
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  const { order_id, status } = body as { order_id?: string; status?: string };
  if (!order_id || !(STATUSES as readonly string[]).includes(status ?? "")) {
    return NextResponse.json({ error: "order_id and valid status required" }, { status: 400 });
  }
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", order_id)
    .eq("business_id", business.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
