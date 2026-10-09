"use client";

import { useEffect, useState } from "react";
import { Building2, Check, Loader2, RefreshCw } from "lucide-react";

interface Location {
  location_id: string;
  title: string;
  address: string;
  locality: string;
}

interface Account {
  account_id: string;
  account_name: string;
  locations: Location[];
}

export default function ConnectGoogleButton({
  businessId,
  initiallyConnected,
  initialLocationName,
}: {
  businessId: string | null;
  initiallyConnected: boolean;
  initialLocationName: string | null;
}) {
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [connected, setConnected] = useState(initiallyConnected);
  const [locationName, setLocationName] = useState<string | null>(initialLocationName);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  // Pick up the ?google=connected / ?google=error flag from the OAuth callback.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get("google");
    if (g === "connected") {
      setBanner("Google connected — now pick which location to manage below.");
      setConnected(true);
      window.history.replaceState({}, "", window.location.pathname);
    } else if (g === "error") {
      setBanner("Google connection failed. Please try again.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function ensureBusinessId(): Promise<string> {
    if (businessId) return businessId;
    const res = await fetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "My business" }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Could not create business");
    return data.business.id as string;
  }

  async function connect() {
    setStatus("working");
    try {
      const id = await ensureBusinessId();
      window.location.href = `/api/google/connect?business_id=${id}`;
    } catch {
      setStatus("error");
    }
  }

  async function loadLocations() {
    setStatus("working");
    try {
      const id = await ensureBusinessId();
      const res = await fetch(`/api/google/locations?business_id=${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load locations");
      setAccounts(data.accounts as Account[]);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  async function selectLocation(accountId: string, loc: Location) {
    setStatus("working");
    try {
      const id = await ensureBusinessId();
      const res = await fetch("/api/google/select-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: id,
          google_account_id: `accounts/${accountId}`,
          google_location_id: `accounts/${accountId}/locations/${loc.location_id}`,
          location_name: loc.title,
        }),
      });
      if (!res.ok) throw new Error("Could not save location");
      setLocationName(loc.title);
      setAccounts(null);
      setBanner(`Managing “${loc.title}” — reviews will sync here.`);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  async function syncNow() {
    setStatus("working");
    try {
      const id = await ensureBusinessId();
      const res = await fetch("/api/reviews/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sync failed");
      setBanner(`Synced ${data.upserted} reviews from Google.`);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="card divide-y divide-stone-100 mb-6">
      <div className="flex items-center gap-4 p-4 min-h-[72px]">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(217,45,32,0.08)" }}
        >
          <Building2 size={22} style={{ color: "var(--color-chili)" }} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <div className="text-[16px] font-medium">Google Business</div>
          <div className="text-[14px] text-stone-500">
            {locationName ? `Managing ${locationName}` : "Reviews, posts, and your star rating"}
          </div>
        </div>
        {connected ? (
          <span className="inline-flex items-center gap-1 text-[13px] font-medium px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
            <Check size={14} /> Connected
          </span>
        ) : (
          <button
            onClick={connect}
            disabled={status === "working"}
            className="btn-primary !min-h-[44px] !px-5 text-[15px]"
          >
            {status === "working" ? <Loader2 size={18} className="animate-spin" /> : "Connect"}
          </button>
        )}
      </div>

      {banner && (
        <div className="p-4 text-[14px] text-stone-600 bg-stone-50">{banner}</div>
      )}

      {connected && (
        <div className="p-4 flex flex-col gap-2">
          {!locationName && (
            <button onClick={loadLocations} disabled={status === "working"} className="btn-secondary w-full">
              {status === "working" ? <Loader2 size={18} className="animate-spin" /> : "Choose location to manage"}
            </button>
          )}
          {locationName && (
            <button onClick={syncNow} disabled={status === "working"} className="btn-secondary w-full">
              {status === "working" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <RefreshCw size={18} className="mr-1.5" /> Sync reviews now
                </>
              )}
            </button>
          )}
          {status === "error" && (
            <p className="text-[14px] text-red-600 text-center">Something went wrong — please try again.</p>
          )}
        </div>
      )}

      {accounts && (
        <div className="p-4">
          <div className="text-[14px] font-semibold text-stone-500 uppercase tracking-wide mb-2 px-1">
            Pick a location
          </div>
          {accounts.length === 0 && (
            <p className="text-[14px] text-stone-500 p-2">
              No locations found on this Google account. The Google user must manage a Business Profile.
            </p>
          )}
          {accounts.flatMap((a) =>
            a.locations.map((loc) => (
              <button
                key={loc.location_id}
                onClick={() => selectLocation(a.account_id, loc)}
                disabled={status === "working"}
                className="w-full text-left p-4 min-h-[64px] rounded-xl hover:bg-stone-50 active:bg-stone-100 border border-stone-100 mb-2"
              >
                <div className="text-[16px] font-medium">{loc.title}</div>
                <div className="text-[14px] text-stone-500">
                  {[loc.address, loc.locality].filter(Boolean).join(" · ")}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
