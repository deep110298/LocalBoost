import { NextResponse } from "next/server";
import { getValidAccessToken, listReviews, numericId } from "@/lib/google";
import { requireBusinessOwner } from "@/lib/api-auth";

// POST /api/reviews/sync
// Body: { business_id }
// Pulls the latest Google reviews for the connected location and upserts
// them into the reviews table. Safe to call on a schedule.
export async function POST(req: Request) {
  const body = await req.json();
  const auth = await requireBusinessOwner(body.business_id);
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  try {
    const { token, connection } = await getValidAccessToken(supabase, business.id);
    if (!connection.google_account_id || !connection.google_location_id) {
      return NextResponse.json(
        { error: "No Google location selected — pick one in Settings first" },
        { status: 409 }
      );
    }
    const reviews = await listReviews(
      token,
      numericId(connection.google_account_id),
      numericId(connection.google_location_id)
    );

    let upserted = 0;
    for (const r of reviews) {
      const { error } = await supabase.from("reviews").upsert(
        {
          business_id: business.id,
          source: "google",
          external_id: r.external_id,
          author_name: r.author_name,
          rating: r.rating,
          text: r.text,
          review_time: r.review_time,
          replied: r.replied,
          reply_text: r.reply_text,
          replied_at: r.replied_at,
        },
        { onConflict: "business_id,source,external_id" }
      );
      if (!error) upserted++;
    }
    return NextResponse.json({ ok: true, fetched: reviews.length, upserted });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    const status = message.includes("not connected") || message.includes("reconnect") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
