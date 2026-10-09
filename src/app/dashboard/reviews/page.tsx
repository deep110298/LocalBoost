import { Inbox, Star, RefreshCw, Check, Pencil } from "lucide-react";

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= n ? "fill-amber-400 text-amber-400" : "text-stone-300"}
        />
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const reviews: never[] = [];

  return (
    <div>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight">Reviews</h1>
          <p className="text-[15px] text-stone-500 mt-1">
            Every review, one place. Tap approve and you&apos;re done.
          </p>
        </div>
        <button
          className="w-11 h-11 rounded-full bg-white border border-stone-200 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          aria-label="Sync reviews"
        >
          <RefreshCw size={20} className="text-stone-600" />
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="card p-10 text-center">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(217,45,32,0.08)" }}
          >
            <Inbox size={28} style={{ color: "var(--color-chili)" }} strokeWidth={1.75} />
          </div>
          <h2 className="text-[18px] font-semibold mb-2">All caught up</h2>
          <p className="text-[15px] text-stone-500 max-w-[280px] mx-auto leading-relaxed">
            When new Google or Yelp reviews come in, they&apos;ll show up here
            with a ready-to-send reply. You just approve.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* review cards render here */}
        </div>
      )}

      {/* How it works */}
      <div className="card p-5 mt-6">
        <h3 className="text-[16px] font-semibold mb-3">How replies work</h3>
        <ol className="space-y-3">
          {[
            "A customer leaves a review on Google or Yelp.",
            "LocalBoost drafts a personal, on-brand reply instantly.",
            "You tap Approve — it's posted. Or tap Edit to tweak it first.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 mt-0.5"
                style={{ background: "var(--color-chili)" }}
              >
                {i + 1}
              </span>
              <span className="text-[15px] text-stone-600 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// Example of an approved-state review card (used when reviews exist):
export function ReviewCardExample() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[16px] font-semibold">Priya S.</span>
        <span className="text-[13px] text-stone-400">Google · 2h ago</span>
      </div>
      <Stars n={5} />
      <p className="text-[15px] text-stone-600 mt-2 leading-relaxed">
        Best dosa outside of Chennai! The staff remembered us from last time.
      </p>
      <div className="bg-stone-50 rounded-xl p-4 mt-3">
        <div className="text-[12px] font-semibold text-stone-400 uppercase tracking-wide mb-1">
          Suggested reply
        </div>
        <p className="text-[15px] leading-relaxed">
          Thank you so much, Priya! We&apos;re thrilled the dosa hit the spot —
          can&apos;t wait to welcome you back.
        </p>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="btn-primary flex-1">
          <Check size={18} className="mr-1.5" /> Approve & post
        </button>
        <button
          className="w-12 h-12 rounded-[14px] border border-stone-200 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          aria-label="Edit reply"
        >
          <Pencil size={18} className="text-stone-600" />
        </button>
      </div>
    </div>
  );
}
