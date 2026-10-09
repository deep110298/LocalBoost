import { Link2, CreditCard, ChevronRight } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import ConnectGoogleButton from "./connect-google-button";
import SignOutButton from "./sign-out-button";

export default async function SettingsPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let businessId: string | null = null;
  let connected = false;
  let locationName: string | null = null;
  if (user) {
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();
    if (business) {
      businessId = business.id;
      const { data: conn } = await supabase
        .from("google_connections")
        .select("access_token, location_name")
        .eq("business_id", business.id)
        .single();
      if (conn?.access_token) {
        connected = true;
        locationName = conn.location_name;
      }
    }
  }

  return (
    <div>
      <h1 className="text-[28px] font-bold tracking-tight mb-5">Settings</h1>

      <h2 className="text-[15px] font-semibold text-stone-500 uppercase tracking-wide mb-2 px-1">
        Connections
      </h2>
      <ConnectGoogleButton
        businessId={businessId}
        initiallyConnected={connected}
        initialLocationName={locationName}
      />
      <div className="card divide-y divide-stone-100 mb-6">
        <div className="flex items-center gap-4 p-4 min-h-[72px]">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(194,65,12,0.08)" }}
          >
            <Link2 size={22} style={{ color: "var(--color-terracotta)" }} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="text-[16px] font-medium">Yelp</div>
            <div className="text-[14px] text-stone-500">Watch reviews (read-only)</div>
          </div>
          <span className="text-[13px] font-medium px-3 py-1.5 rounded-full bg-stone-100 text-stone-500">
            Coming soon
          </span>
        </div>
      </div>

      <h2 className="text-[15px] font-semibold text-stone-500 uppercase tracking-wide mb-2 px-1">
        Business
      </h2>
      <div className="card p-5 mb-6">
        <label className="block text-[15px] font-medium mb-2">
          Business name
        </label>
        <input
          type="text"
          placeholder="e.g. Eggholic Jersey City"
          className="w-full min-h-[48px] px-4 border border-stone-200 rounded-xl bg-stone-50 text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
        <button className="btn-secondary w-full mt-3">Save</button>
      </div>

      <h2 className="text-[15px] font-semibold text-stone-500 uppercase tracking-wide mb-2 px-1">
        Plan
      </h2>
      <button className="card w-full flex items-center gap-4 p-4 min-h-[72px] text-left active:scale-[0.99] transition-transform">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(194,65,12,0.08)" }}
        >
          <CreditCard size={22} style={{ color: "var(--color-terracotta)" }} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <div className="text-[16px] font-medium">Free beta</div>
          <div className="text-[14px] text-stone-500">
            Paid plans launch soon — you&apos;re grandfathered in
          </div>
        </div>
        <ChevronRight size={20} className="text-stone-300" />
      </button>

      <div className="mt-6">
        <SignOutButton />
      </div>
    </div>
  );
}
