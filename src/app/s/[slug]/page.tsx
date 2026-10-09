import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import OrderSite from "./order-site";

export default async function PublicSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, address, phone, slug")
    .eq("slug", slug)
    .single();
  if (!business) notFound();

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

  return (
    <OrderSite
      business={business}
      categories={categories ?? []}
      items={items ?? []}
    />
  );
}
