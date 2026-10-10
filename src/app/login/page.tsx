"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { ChiliLogo } from "@/components/chili-logo";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendLink() {
    const trimmed = email.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send the link");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-cream)" }}>
      <header className="px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
            style={{ background: "var(--color-chili)" }}
          >
            <ChiliLogo size={18} />
          </span>
          <span className="font-bold text-lg tracking-tight">LocalBoost</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 pb-16">
        <div className="card p-8 w-full max-w-[400px]">
          {sent ? (
            <div className="text-center py-4">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(217,45,32,0.08)" }}
              >
                <MailCheck size={28} style={{ color: "var(--color-chili)" }} strokeWidth={1.75} />
              </div>
              <h1 className="text-[22px] font-bold tracking-tight mb-2">Check your email</h1>
              <p className="text-[15px] text-stone-500 leading-relaxed">
                We sent a sign-in link to <span className="font-medium text-stone-700">{email.trim()}</span>.
                Tap it and you&apos;re in — no password needed.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-[15px] font-medium mt-5 min-h-[44px]"
                style={{ color: "var(--color-chili)" }}
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-[26px] font-bold tracking-tight mb-2">Welcome back</h1>
              <p className="text-[15px] text-stone-500 mb-6 leading-relaxed">
                Enter your email and we&apos;ll send you a sign-in link. No password to remember.
              </p>
              <label className="block text-[15px] font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendLink()}
                placeholder="you@yourrestaurant.com"
                autoComplete="email"
                className="w-full min-h-[52px] px-4 border border-stone-200 rounded-xl bg-white text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400 mb-3"
              />
              {error && <p className="text-[14px] text-red-600 mb-3">{error}</p>}
              <button
                onClick={sendLink}
                disabled={sending || !email.trim()}
                className="btn-primary w-full !min-h-[52px] disabled:opacity-40"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : "Send sign-in link"}
              </button>
              <p className="text-[13px] text-stone-400 text-center mt-4">
                30 days free · No credit card
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
