import Link from "next/link";
import { ChiliLogo } from "@/components/chili-logo";
import {
  Inbox,
  PenLine,
  Eye,
  Gauge,
  Check,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Inbox,
    title: "One inbox for reviews",
    desc: "Google and Yelp reviews land in a single feed. Our AI drafts a personal reply for each one — you just tap approve.",
  },
  {
    icon: PenLine,
    title: "Posts on autopilot",
    desc: "Schedule Google Business updates, photos, and hour changes in minutes. Stay visible without thinking about it.",
  },
  {
    icon: Eye,
    title: "Know your competition",
    desc: "Watch three nearby competitors. A short Monday email tells you who's gaining stars and reviews — and who's slipping.",
  },
  {
    icon: Gauge,
    title: "One score to watch",
    desc: "Your visibility score (0–100) rolls reviews, replies, and posts into a single number. Simple to understand, satisfying to grow.",
  },
];

const plans = [
  {
    name: "Starter",
    price: 99,
    tagline: "For getting started",
    features: ["1 location", "Review inbox", "AI reply drafts"],
  },
  {
    name: "Growth",
    price: 199,
    tagline: "For growing fast",
    features: [
      "Everything in Starter",
      "Autopilot posts",
      "Competitor watch",
      "Monday digest",
    ],
    highlight: true,
  },
  {
    name: "Pro",
    price: 299,
    tagline: "For multiple spots",
    features: [
      "Everything in Growth",
      "Up to 3 locations",
      "Review-request texts",
      "Priority support",
    ],
  },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-cream)", color: "var(--color-espresso)" }}
    >
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ background: "var(--color-terracotta)" }}
            >
              <ChiliLogo size={18} />
            </span>
            <span className="font-bold text-lg tracking-tight">LocalBoost</span>
          </span>
          <Link href="/login" className="btn-primary !min-h-[44px] !text-[15px]">
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[14px] font-medium mb-6"
          style={{ background: "rgba(194,65,12,0.08)", color: "var(--color-terracotta)" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--color-terracotta)" }} />
          Free during beta
        </div>
        <h1 className="text-[36px] md:text-[56px] font-bold tracking-tight leading-[1.08] mb-5">
          Your restaurant&apos;s
          <br />
          online presence,
          <br />
          handled.
        </h1>
        <p className="text-[17px] md:text-[19px] text-stone-500 max-w-xl mx-auto leading-relaxed mb-8">
          Reviews answered, Google profile kept fresh, competitors watched —
          while you run the kitchen. Most owners spend under 10 minutes a week.
        </p>
        <Link href="/login" className="btn-primary !min-h-[56px] !px-10 !text-[17px]">
          Start free <ArrowRight size={18} className="ml-1.5" />
        </Link>
        <p className="text-[14px] text-stone-400 mt-4">
          No credit card · Set up in 5 minutes
        </p>
      </section>

      {/* Product peek */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <div className="card p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[17px] font-semibold">Your review inbox</h3>
            <span className="text-[13px] font-medium px-3 py-1 rounded-full" style={{ background: "rgba(194,65,12,0.08)", color: "var(--color-terracotta)" }}>
              2 waiting
            </span>
          </div>
          <div className="bg-stone-50 rounded-2xl p-5 mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[15px] font-semibold">Aarav M.</span>
              <span className="text-[13px] text-stone-400">Google · ★★★★★</span>
            </div>
            <p className="text-[15px] text-stone-600 leading-relaxed mb-3">
              The paneer tikka was unreal. Staff remembered our order from last month!
            </p>
            <div className="bg-white rounded-xl p-4 border border-stone-100">
              <p className="text-[14px] text-stone-500 leading-relaxed">
                Thank you, Aarav! Thrilled the paneer tikka hit the spot — see you next month.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="btn-primary flex-1 !min-h-[48px]">
              <Check size={18} className="mr-1.5" /> Approve
            </span>
            <span className="btn-secondary !min-h-[48px] !px-5">Edit</span>
          </div>
          <p className="text-[13px] text-stone-400 text-center mt-4">
            This is what it feels like. One tap per review.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight text-center mb-3">
          Everything handled, nothing to learn
        </h2>
        <p className="text-[16px] text-stone-500 text-center max-w-lg mx-auto mb-10">
          If you can tap a button, you can run LocalBoost.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f.title} className="card p-6">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(194,65,12,0.08)" }}
              >
                <f.icon size={22} style={{ color: "var(--color-terracotta)" }} strokeWidth={2} />
              </div>
              <h3 className="text-[18px] font-semibold mb-1.5">{f.title}</h3>
              <p className="text-[15px] text-stone-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-5 pb-20">
        <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight text-center mb-3">
          One flat price. No surprises.
        </h2>
        <p className="text-[16px] text-stone-500 text-center mb-10">
          Less than one catering order a month.
        </p>
        <div className="grid md:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className="card p-6 flex flex-col"
              style={p.highlight ? { border: "2px solid var(--color-terracotta)" } : undefined}
            >
              {p.highlight && (
                <span
                  className="self-start text-[12px] font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white mb-3"
                  style={{ background: "var(--color-terracotta)" }}
                >
                  Most popular
                </span>
              )}
              <h3 className="text-[18px] font-semibold">{p.name}</h3>
              <p className="text-[14px] text-stone-500 mb-4">{p.tagline}</p>
              <div className="mb-5">
                <span className="text-[40px] font-bold tracking-tight">${p.price}</span>
                <span className="text-stone-500 text-[15px]">/month</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] text-stone-600">
                    <Check size={17} className="mt-0.5 shrink-0" style={{ color: "var(--color-terracotta)" }} strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={p.highlight ? "btn-primary w-full" : "btn-secondary w-full"}
              >
                Choose {p.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/60">
        <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col items-center gap-3">
          <span className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
              style={{ background: "var(--color-terracotta)" }}
            >
              <ChiliLogo size={15} />
            </span>
            <span className="font-bold tracking-tight">LocalBoost</span>
          </span>
          <p className="text-[14px] text-stone-400">
            Built for local businesses that deserve to be found.
          </p>
        </div>
      </footer>
    </div>
  );
}
