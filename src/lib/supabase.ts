import { createBrowserClient } from "@supabase/ssr";

// Implicit flow (not PKCE): the magic link carries the session in the URL
// hash, so tapping it in ANY browser works — including the in-app browser
// that email apps open links in. PKCE required the link to be opened in the
// exact browser that requested it (code verifier lives in its cookies),
// which broke sign-in on phones: request in Safari/Chrome, tap in Gmail's
// in-app browser, fail. Trade-off: tokens briefly appear in the URL.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { flowType: "implicit" } }
  );
}
