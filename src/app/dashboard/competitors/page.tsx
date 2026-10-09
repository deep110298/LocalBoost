import { Eye, Plus, Bell } from "lucide-react";

export default function CompetitorsPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold tracking-tight">Watch</h1>
      <p className="text-[15px] text-stone-500 mt-1 mb-5">
        Keep an eye on 3 nearby competitors. We&apos;ll tell you every Monday
        who&apos;s pulling ahead.
      </p>

      <div className="card p-10 text-center mb-4">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: "rgba(217,45,32,0.08)" }}
        >
          <Eye size={28} style={{ color: "var(--color-chili)" }} strokeWidth={1.75} />
        </div>
        <h2 className="text-[18px] font-semibold mb-2">No one watched yet</h2>
        <p className="text-[15px] text-stone-500 max-w-[280px] mx-auto leading-relaxed mb-6">
          Add the places your customers compare you to. We track their
          ratings and review counts automatically.
        </p>
        <button className="btn-primary w-full">
          <Plus size={18} className="mr-1.5" /> Add a competitor
        </button>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={18} style={{ color: "var(--color-chili)" }} />
          <h3 className="text-[16px] font-semibold">Monday digest</h3>
        </div>
        <p className="text-[15px] text-stone-500 leading-relaxed">
          One short email each week: their new reviews, rating changes, and
          how you compare. No noise, just what matters.
        </p>
      </div>
    </div>
  );
}
