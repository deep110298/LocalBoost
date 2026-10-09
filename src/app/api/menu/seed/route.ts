import { NextResponse } from "next/server";
import { requireBusinessOwner } from "@/lib/api-auth";

// POST /api/menu/seed — { business_id }
// Loads a sample Indian-restaurant menu so the website is demoable instantly.
// Only runs when the business has no items yet.
const SAMPLE: { category: string; items: { name: string; description: string; price_cents: number }[] }[] = [
  {
    category: "Street Favorites",
    items: [
      { name: "Pav Bhaji", description: "Buttered pav with spiced mashed vegetables", price_cents: 1099 },
      { name: "Vada Pav", description: "Mumbai's famous potato fritter burger", price_cents: 699 },
      { name: "Dabeli", description: "Sweet-spicy potato mix in a bun with pomegranate", price_cents: 799 },
    ],
  },
  {
    category: "Egg Specials",
    items: [
      { name: "Egg Curry with Rice", description: "Homestyle egg curry, steamed basmati", price_cents: 1299 },
      { name: "Masala Omelette Pav", description: "Two-egg masala omelette with buttered pav", price_cents: 899 },
      { name: "Egg Biryani", description: "Fragrant basmati layered with spiced eggs", price_cents: 1399 },
    ],
  },
  {
    category: "Beverages",
    items: [
      { name: "Masala Chai", description: "Brewed with crushed ginger and spices", price_cents: 399 },
      { name: "Mango Lassi", description: "Thick yogurt blended with alphonso mango", price_cents: 599 },
    ],
  },
];

export async function POST(req: Request) {
  const body = await req.json();
  const auth = await requireBusinessOwner(body.business_id);
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  const { count } = await supabase
    .from("menu_items")
    .select("id", { count: "exact", head: true })
    .eq("business_id", business.id);
  if (count && count > 0) {
    return NextResponse.json({ error: "Menu already has items" }, { status: 409 });
  }

  let inserted = 0;
  for (let ci = 0; ci < SAMPLE.length; ci++) {
    const { data: cat, error: catErr } = await supabase
      .from("menu_categories")
      .insert({ business_id: business.id, name: SAMPLE[ci].category, sort_order: ci })
      .select("id")
      .single();
    if (catErr || !cat) continue;
    const rows = SAMPLE[ci].items.map((it, ii) => ({
      business_id: business.id,
      category_id: cat.id,
      name: it.name,
      description: it.description,
      price_cents: it.price_cents,
      sort_order: ii,
    }));
    const { error: itemErr } = await supabase.from("menu_items").insert(rows);
    if (!itemErr) inserted += rows.length;
  }
  return NextResponse.json({ ok: true, inserted });
}
