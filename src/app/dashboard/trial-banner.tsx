"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, AlertCircle } from "lucide-react";
import { getTrialStatus, formatTrialDate, type TrialStatus } from "@/lib/trial";

// Slim trial banner shown at the top of every dashboard page.
export default function TrialBanner() {
  const [status, setStatus] = useState<TrialStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/businesses/ensure", { method: "POST" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setStatus(getTrialStatus(data.business?.created_at));
      } catch {
        // Banner is non-critical — stay silent on failure.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!status) return null;

  if (status.state === "expired") {
    return (
      <Link
        href="/dashboard/settings"
        className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5 text-white"
        style={{ background: "var(--color-chili)" }}
      >
        <AlertCircle size={20} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold">Your free trial has ended</div>
          <div className="text-[13px] opacity-90">
            Pick a plan to keep your website, menu, and orders running.
          </div>
        </div>
        <span className="text-[14px] font-semibold underline underline-offset-2 shrink-0">
          See plans
        </span>
      </Link>
    );
  }

  const urgent = status.daysLeft <= 7;
  const dayWord = status.daysLeft === 1 ? "day" : "days";
  return (
    <Link
      href="/dashboard/settings"
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 mb-5 border ${
        urgent
          ? "border-red-200 bg-red-50"
          : "border-stone-200 bg-white"
      }`}
    >
      <Clock
        size={20}
        className="shrink-0"
        style={{ color: "var(--color-chili)" }}
        strokeWidth={2}
      />
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-medium text-stone-800">
          {urgent ? (
            <>
              Free trial ends in{" "}
              <span className="font-bold" style={{ color: "var(--color-chili)" }}>
                {status.daysLeft} {dayWord}
              </span>
              {status.endsAt ? ` (${formatTrialDate(status.endsAt)})` : ""}
            </>
          ) : (
            <>
              You&apos;re on your free trial —{" "}
              <span className="font-semibold">{status.daysLeft} {dayWord} left</span>
            </>
          )}
        </div>
      </div>
      <span
        className="text-[14px] font-semibold shrink-0 underline underline-offset-2"
        style={{ color: "var(--color-chili)" }}
      >
        See plans
      </span>
    </Link>
  );
}
