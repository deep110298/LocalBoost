// Google Business Profile API client.
// Reviews live on the legacy v4 surface (mybusiness.googleapis.com/v4/...);
// accounts + locations live on the v1 federated APIs. All calls need the
// https://www.googleapis.com/auth/business.manage OAuth scope.

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const ACCOUNT_MGMT = "https://mybusinessaccountmanagement.googleapis.com/v1";
const BUSINESS_INFO = "https://mybusinessbusinessinformation.googleapis.com/v1";
const V4 = "https://mybusiness.googleapis.com/v4";

export const GOOGLE_SCOPE = "https://www.googleapis.com/auth/business.manage";

function redirectUri() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL is not set");
  return `${appUrl}/api/google/callback`;
}

/** Step 1 of OAuth: URL the owner visits to grant access. state = business id. */
export function getGoogleOAuthUrl(businessId: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: GOOGLE_SCOPE,
    access_type: "offline", // we need a refresh token for background syncs
    prompt: "consent",
    state: businessId,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

/** Step 2 of OAuth: exchange the authorization code for tokens. */
export async function exchangeCode(code: string): Promise<GoogleTokens> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri(),
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`Google token exchange failed: ${await res.text()}`);
  return (await res.json()) as GoogleTokens;
}

/** Refresh an expired access token. */
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ access_token: string; expires_in: number }> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Google token refresh failed: ${await res.text()}`);
  return (await res.json()) as { access_token: string; expires_in: number };
}

export interface GoogleConnection {
  id: string;
  business_id: string;
  google_account_id: string | null;
  google_location_id: string | null;
  location_name: string | null;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: string | null;
}

/**
 * Returns a usable access token for the business, refreshing it first if
 * expired. Persists the refreshed token back to the google_connections row.
 */
export async function getValidAccessToken(
  // Minimal Supabase client shape — works with the server client.
  supabase: {
    from: (table: string) => any;
  },
  businessId: string
): Promise<{ token: string; connection: GoogleConnection }> {
  const { data: conn, error } = await supabase
    .from("google_connections")
    .select("*")
    .eq("business_id", businessId)
    .single();
  if (error || !conn) throw new Error("Google not connected for this business");
  const connection = conn as GoogleConnection;

  const expiresAt = connection.expires_at ? new Date(connection.expires_at).getTime() : 0;
  if (connection.access_token && expiresAt > Date.now() + 60_000) {
    return { token: connection.access_token, connection };
  }
  if (!connection.refresh_token) throw new Error("Google session expired — reconnect Google Business");

  const refreshed = await refreshAccessToken(connection.refresh_token);
  const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
  await supabase
    .from("google_connections")
    .update({ access_token: refreshed.access_token, expires_at: newExpiresAt, updated_at: newExpiresAt })
    .eq("business_id", businessId);

  return { token: refreshed.access_token, connection };
}

async function gGet<T>(token: string, url: string): Promise<T> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Google API error ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

export interface GoogleAccount {
  name: string; // "accounts/123456789"
  accountName?: string;
}

export async function listAccounts(token: string): Promise<GoogleAccount[]> {
  const data = await gGet<{ accounts?: GoogleAccount[] }>(token, `${ACCOUNT_MGMT}/accounts`);
  return data.accounts ?? [];
}

export interface GoogleLocation {
  name: string; // "accounts/123/locations/456"
  title?: string;
  storefrontAddress?: { addressLines?: string[]; locality?: string; administrativeArea?: string };
  phoneNumbers?: { primaryPhone?: string };
}

export async function listLocations(token: string, accountName: string): Promise<GoogleLocation[]> {
  const url =
    `${BUSINESS_INFO}/${accountName}/locations` +
    `?readMask=name,title,storefrontAddress,phoneNumbers,websiteUri&pageSize=50`;
  const data = await gGet<{ locations?: GoogleLocation[] }>(token, url);
  return data.locations ?? [];
}

const STAR_MAP: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export interface GoogleReview {
  reviewId: string;
  reviewer?: { displayName?: string };
  starRating?: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewReply?: { comment?: string; updateTime?: string };
}

export interface SyncedReview {
  external_id: string;
  author_name: string | null;
  rating: number | null;
  text: string | null;
  review_time: string | null;
  replied: boolean;
  reply_text: string | null;
  replied_at: string | null;
}

export async function listReviews(
  token: string,
  accountId: string,
  locationId: string
): Promise<SyncedReview[]> {
  const url =
    `${V4}/accounts/${accountId}/locations/${locationId}/reviews` +
    `?pageSize=50&orderBy=updateTime%20desc`;
  const data = await gGet<{ reviews?: GoogleReview[] }>(token, url);
  return (data.reviews ?? []).map((r) => ({
    external_id: r.reviewId,
    author_name: r.reviewer?.displayName ?? null,
    rating: r.starRating ? (STAR_MAP[r.starRating] ?? null) : null,
    text: r.comment ?? null,
    review_time: r.createTime ?? null,
    replied: !!r.reviewReply,
    reply_text: r.reviewReply?.comment ?? null,
    replied_at: r.reviewReply?.updateTime ?? null,
  }));
}

/** Post (or overwrite) the owner's reply to a review. */
export async function replyToReview(
  token: string,
  accountId: string,
  locationId: string,
  reviewId: string,
  comment: string
): Promise<void> {
  const url = `${V4}/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ comment }),
  });
  if (!res.ok) throw new Error(`Google reply failed ${res.status}: ${await res.text()}`);
}

/** Publish a Google Business post (used by Autopilot). */
export async function createLocalPost(
  token: string,
  accountId: string,
  locationId: string,
  summary: string
): Promise<void> {
  const url = `${V4}/accounts/${accountId}/locations/${locationId}/localPosts`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ languageCode: "en-US", summary, topicType: "STANDARD" }),
  });
  if (!res.ok) throw new Error(`Google post failed ${res.status}: ${await res.text()}`);
}

/** "accounts/123" -> "123" */
export function numericId(resourceName: string): string {
  return resourceName.split("/").pop()!;
}
