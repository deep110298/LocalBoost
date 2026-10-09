import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

// GET /api/reviews?business_id=xxx — list reviews for a business
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("business_id");
  if (!businessId) {
    return NextResponse.json({ error: "business_id required" }, { status: 400 });
  }
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("business_id", businessId)
    .order("review_time", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data });
}
