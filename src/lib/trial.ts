// Free-trial bookkeeping. The trial is anchored to the business row's
// created_at (set on first dashboard visit) — no extra columns needed.
// 30-day trial, no credit card; expiry is soft (banners + plan nudge)
// until Stripe billing lands.

export const TRIAL_DAYS = 30;

export type TrialState = "trial" | "expired";

export interface TrialStatus {
  state: TrialState;
  /** Whole days remaining (0 when expired). */
  daysLeft: number;
  endsAt: Date | null;
}

export function getTrialStatus(createdAt: string | null | undefined): TrialStatus {
  if (!createdAt) {
    return { state: "trial", daysLeft: TRIAL_DAYS, endsAt: null };
  }
  const start = new Date(createdAt).getTime();
  if (!Number.isFinite(start)) {
    return { state: "trial", daysLeft: TRIAL_DAYS, endsAt: null };
  }
  const endsAt = new Date(start + TRIAL_DAYS * 86_400_000);
  const daysLeft = Math.ceil((endsAt.getTime() - Date.now()) / 86_400_000);
  if (daysLeft <= 0) return { state: "expired", daysLeft: 0, endsAt };
  return { state: "trial", daysLeft, endsAt };
}

export function formatTrialDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
