"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

export default function BusinessNameForm({
  businessId,
  initialName,
}: {
  businessId: string | null;
  initialName: string;
}) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = name.trim() !== initialName.trim();

  async function save() {
    if (!businessId || !name.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/businesses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: businessId, name: name.trim() }),
      });
      if (!res.ok) throw new Error("Could not save");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Couldn't save the name. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-5 mb-6">
      <label className="block text-[15px] font-medium mb-2" htmlFor="business-name">
        Business name
      </label>
      <input
        id="business-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        placeholder="e.g. Eggholic Jersey City"
        className="w-full min-h-[48px] px-4 border border-stone-200 rounded-xl bg-white text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
      />
      {name.trim() === "My business" && (
        <p className="text-[13px] text-stone-500 mt-2 leading-relaxed">
          This placeholder name shows on your public website — set your real name here.
        </p>
      )}
      {error && (
        <p role="alert" className="text-[14px] text-red-600 mt-2">
          {error}
        </p>
      )}
      <button
        onClick={save}
        disabled={!businessId || saving || !dirty || !name.trim()}
        className="btn-secondary w-full mt-3 disabled:opacity-40"
      >
        {saving ? (
          <Loader2 size={18} className="animate-spin" />
        ) : saved ? (
          <span className="inline-flex items-center gap-1.5">
            <Check size={18} /> Saved
          </span>
        ) : (
          "Save"
        )}
      </button>
    </div>
  );
}
