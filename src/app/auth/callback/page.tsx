"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

// /auth/callback — Supabase Auth redirects here after a magic-link tap.
// With implicit flow the session arrives in the URL hash
// (#access_token=...), which only client JS can read, so this must be a
// client page: the Supabase browser client detects the session from the URL,
// persists it to cookies, and we land on the dashboard. Failures also arrive
// as a hash fragment (#error=...&error_code=...).
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const hash = new URLSearchParams(
        typeof window !== "undefined" ? window.location.hash.slice(1) : ""
      );
      if (hash.get("error") || hash.get("error_code")) {
        router.replace("/login?error=auth");
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      router.replace(data.session ? "/dashboard" : "/login?error=auth");
    })();
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--color-cream)" }}
    >
      <div className="flex flex-col items-center gap-3 text-stone-500">
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: "var(--color-chili)" }}
        />
        <p className="text-[15px]">Signing you in…</p>
      </div>
    </div>
  );
}
