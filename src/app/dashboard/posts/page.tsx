import { PenLine, Lightbulb, Plus } from "lucide-react";

export default function PostsPage() {
  return (
    <div>
      <h1 className="text-[28px] font-bold tracking-tight">Posts</h1>
      <p className="text-[15px] text-stone-500 mt-1 mb-5">
        Keep your Google profile fresh. One post a week is plenty.
      </p>

      <div className="card p-10 text-center mb-4">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: "rgba(194,65,12,0.08)" }}
        >
          <PenLine size={28} style={{ color: "var(--color-terracotta)" }} strokeWidth={1.75} />
        </div>
        <h2 className="text-[18px] font-semibold mb-2">Nothing scheduled</h2>
        <p className="text-[15px] text-stone-500 max-w-[280px] mx-auto leading-relaxed mb-6">
          Posts with photos get 2× more views. Try announcing this
          weekend&apos;s special.
        </p>
        <button className="btn-primary w-full">
          <Plus size={18} className="mr-1.5" /> Write a post
        </button>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={18} style={{ color: "var(--color-terracotta)" }} />
          <h3 className="text-[16px] font-semibold">Ideas for this week</h3>
        </div>
        <ul className="space-y-2.5">
          {[
            "Weekend special with a mouth-watering photo",
            "New hours for the holiday — let regulars know",
            "A quick thank-you post after a busy night",
          ].map((idea) => (
            <li
              key={idea}
              className="text-[15px] text-stone-600 leading-relaxed flex gap-2.5"
            >
              <span
                className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                style={{ background: "var(--color-terracotta)" }}
              />
              {idea}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
