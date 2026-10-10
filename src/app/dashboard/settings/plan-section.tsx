"use client";

import { useState } from "react";
import { Check, Loader2, CreditCard, ChevronRight } from "lucide-react";
import { getTrialStatus, formatTrialDate } from "@/lib/trial";

const PLANS: {
  id: string;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  highlight?: boolean;
}[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    tagline: "For getting started",
    features: ["1 location", "Website creation + hosting", "Review inbox", "AI reply drafts"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 199,
    tagline: "For growing fast",
    features: ["Everything in Starter", "Commission-free ordering", "Autopilot Google posts", "Competitor watch"],
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 299,
    tagline: "For multiple spots",
    features: ["Everything in Growth", "Up to 3 locations", "Review-request texts", "Menu concierge"],
  },
];

export default function PlanSection({
  businessId,
  createdAt,
}: {
  businessId: string | null;
  createdAt: string | null;
}) {
  const trial = getTrialStatus(createdAt);
  const [chosen, setChosen] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  async function choose(planId: string) {
    if (saving) return;
    setSaving(planId);
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: businessId,
          type: "plan_interest",
          data: { plan: planId, trial_state: trial.state, days_left: trial.daysLeft },
        }),
      });
    } catch {
      // Intent logging is best-effort; the confirmation still shows.
    } finally {
      setSaving(null);
      setChosen(planId);
    }
  }

  return (
    <div className="mb-6">
      <h2 className="text-[15px] font-semibold text-stone-500 uppercase tracking-wide mb-2 px-1">
        Plan
      </h2>

      {/* Trial status */}
      <div className="card p-4 mb-3 flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(217,45,32,0.08)" }}
        >
          <CreditCard size={22} style={{ color: "var(--color-chili)" }} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <div className="text-[16px] font-medium">
            {trial.state === "expired" ? "Free trial ended" : "Free trial"}
          </div>
          <div className="text-[14px] text-stone-500">
            {trial.state === "expired" ? (
              <>
                {trial.endsAt ? `Ended ${formatTrialDate(trial.endsAt)} — ` : ""}pick a plan below
                to keep everything running.
              </>
            ) : (
              <>
                {trial.daysLeft} {trial.daysLeft === 1 ? "day" : "days"} left
                {trial.endsAt ? ` (ends ${formatTrialDate(trial.endsAt)})` : ""} — no credit card
                needed.
              </>
            )}
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-3 md:grid-cols-3">
        {PLANS.map((p) => {
          const isChosen = chosen === p.id;
          return (
            <div
              key={p.id}
              className={`card p-5 flex flex-col ${p.highlight ? "border-2" : ""}`}
              style={p.highlight ? { borderColor: "var(--color-chili)" } : undefined}
            >
              <div className="text-[16px] font-bold tracking-tight">{p.name}</div>
              <div className="text-[13px] text-stone-500 mb-2">{p.tagline}</div>
              <div className="mb-3">
                <span className="text-[26px] font-bold tracking-tight">${p.price}</span>
                <span className="text-[14px] text-stone-500">/mo</span>
              </div>
              <ul className="text-[13px] text-stone-600 space-y-1 mb-4 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-1.5">
                    <Check size={14} className="shrink-0 mt-0.5 text-emerald-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {isChosen ? (
                <div className="rounded-xl bg-emerald-50 text-emerald-700 text-[14px] font-medium text-center px-4 py-3 min-h-[48px] flex items-center justify-center">
                  You&apos;re on the list — we&apos;ll reach out to activate {p.name}.
                </div>
              ) : (
                <button
                  onClick={() => choose(p.id)}
                  disabled={saving !== null}
                  className={`w-full min-h-[48px] rounded-[14px] text-[15px] font-semibold active:scale-[0.99] transition-transform disabled:opacity-40 ${
                    p.highlight ? "text-white" : "border border-stone-200 text-stone-800"
                  }`}
                  style={p.highlight ? { background: "var(--color-chili)" } : undefined}
                >
                  {saving === p.id ? (
                    <Loader2 size={18} className="animate-spin mx-auto" />
                  ) : (
                    `Choose ${p.name}`
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[13px] text-stone-400 text-center mt-3 px-4 leading-relaxed">
        Billing opens soon — choosing a plan today just reserves your spot. Nothing to pay yet.
      </p>
    </div>
  );
}
