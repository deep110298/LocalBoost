import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// GET /api/cron/check?since=ISO&secret=...
// Returns events since the given timestamp. Protected by CRON_SECRET.
// Used by the signup-watch cron to notify the moment a client signs up.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since =
    searchParams.get("since") ??
    new Date(Date.now() - 4 * 3600 * 1000).toISOString();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Server not configured (missing Supabase env)" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase
    .from("events")
    .select("id, business_id, user_id, type, data, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data ?? [], since });
}
