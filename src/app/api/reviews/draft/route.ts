import { NextResponse } from "next/server";

// POST /api/reviews/draft — generate an AI reply draft for a review
// TODO(Phase 2): call Muse API with business context + review text.
export async function POST(req: Request) {
  const body = await req.json();
  const { review_text, rating, business_name } = body;
  if (!review_text) {
    return NextResponse.json({ error: "review_text required" }, { status: 400 });
  }

  // Placeholder draft until Muse API is wired up
  const tone = rating >= 4 ? "warm and grateful" : "empathetic and solution-focused";
  const draft = `[AI draft — ${tone}]\n\nThank you for your review of ${business_name || "us"}! ${
    rating >= 4
      ? "We're thrilled you had a great experience and hope to see you again soon."
      : "We're sorry to hear about your experience and would love to make it right. Please reach out to us directly so we can help."
  }`;

  return NextResponse.json({ draft });
}
