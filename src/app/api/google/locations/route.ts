import { NextResponse } from "next/server";
import { getValidAccessToken, listAccounts, listLocations, numericId } from "@/lib/google";
import { requireBusinessOwner } from "@/lib/api-auth";

// GET /api/google/locations?business_id=xxx
// Lists the Google accounts + locations the connected Google user manages,
// so the owner can pick which location LocalBoost should manage.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const auth = await requireBusinessOwner(searchParams.get("business_id"));
  if ("error" in auth) return auth.error;
  const { supabase, business } = auth;

  try {
    const { token } = await getValidAccessToken(supabase, business.id);
    const accounts = await listAccounts(token);
    const result = [];
    for (const account of accounts) {
      const locations = await listLocations(token, account.name);
      result.push({
        account_id: numericId(account.name),
        account_name: account.accountName ?? account.name,
        locations: locations.map((l) => ({
          location_id: numericId(l.name),
          title: l.title ?? "Untitled location",
          address: l.storefrontAddress?.addressLines?.join(", ") ?? "",
          locality: l.storefrontAddress?.locality ?? "",
        })),
      });
    }
    return NextResponse.json({ accounts: result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    const status = message.includes("not connected") || message.includes("reconnect") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
