"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function SignOutButton() {
  const [working, setWorking] = useState(false);

  async function signOut() {
    setWorking(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={signOut}
      disabled={working}
      className="card w-full flex items-center gap-4 p-4 min-h-[72px] text-left active:scale-[0.99] transition-transform"
    >
      <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
        {working ? (
          <Loader2 size={22} className="text-stone-500 animate-spin" />
        ) : (
          <LogOut size={22} className="text-stone-500" strokeWidth={2} />
        )}
      </div>
      <div className="flex-1">
        <div className="text-[16px] font-medium">Sign out</div>
        <div className="text-[14px] text-stone-500">See you soon</div>
      </div>
    </button>
  );
}
