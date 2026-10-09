import { NextResponse } from "next/server";
import { getValidAccessToken, replyToReview, numericId } from "@/lib/google";
import { requireBusinessOwner } from "@/lib/api-auth";

// POST /api/reviews/reply
// Body: { business_id, review_id (LocalBoost uuid), reply_text }
// Posts the approved reply to Google, then marks the review replied locally.
export async function POST(req: Request) {
  const body = await req.json();
  const { business_id, review_id, reply_text } = body;
  const auth = await requireBusinessOwner(business_id);
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  if (!review_id || !reply_text) {
    return NextResponse.json({ error: "review_id and reply_text required" }, { status: 400 });
  }

  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("id, external_id, source")
    .eq("id", review_id)
    .eq("business_id", business.id)
    .single();
  if (reviewError || !review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  if (review.source !== "google") {
    return NextResponse.json({ error: "Only Google reviews can be replied to via API" }, { status: 400 });
  }

  try {
    const { token, connection } = await getValidAccessToken(supabase, business.id);
    if (!connection.google_account_id || !connection.google_location_id) {
      return NextResponse.json({ error: "No Google location selected" }, { status: 409 });
    }
    await replyToReview(
      token,
      numericId(connection.google_account_id),
      numericId(connection.google_location_id),
      review.external_id,
      reply_text
    );
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("reviews")
      .update({ replied: true, reply_text, replied_at: now })
      .eq("id", review_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
