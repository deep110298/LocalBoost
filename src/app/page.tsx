import Link from "next/link";
import Image from "next/image";
import { ChiliLogo } from "@/components/chili-logo";
import { Reveal } from "@/components/reveal";
import { LandingNav } from "@/components/landing-nav";
import {
  Inbox,
  Eye,
  Gauge,
  Check,
  ArrowRight,
  Star,
  Bell,
  Globe,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  Smartphone,
  UtensilsCrossed,
} from "lucide-react";

const marqueeItems = [
  "Website that sells",
  "Commission-free ordering",
  "Review inbox",
  "Google posts on autopilot",
  "Menu sync",
  "Competitor watch",
  "Visibility score",
];

const stats = [
  {
    value: "74%",
    label: "say a restaurant's online presence influences whether they order",
    source: "QSR Magazine",
  },
  {
    value: "94%",
    label: "of diners say reviews influence where they choose to eat",
    source: "Toast",
  },
  {
    value: "54%",
    label: "check the menu and prices online before ordering",
    source: "Menufy / Dynata",
  },
];

const steps = [
  {
    n: "01",
    title: "Connect Google",
    desc: "Link your Business Profile in about two minutes. We pull in your reviews, photos, and hours automatically.",
  },
  {
    n: "02",
    title: "We build your site",
    desc: "Menu, online ordering, and a design that looks like you — built and hosted for you, kept fresh from one dashboard.",
  },
  {
    n: "03",
    title: "Tap approve",
    desc: "AI drafts every review reply and schedules your Google posts. Most owners spend under 10 minutes a week.",
  },
];

const plans = [
  {
    name: "Starter",
    price: 99,
    tagline: "For getting started",
    features: ["1 location", "Review inbox", "AI reply drafts", "Visibility score"],
  },
  {
    name: "Growth",
    price: 199,
    tagline: "For growing fast",
    features: [
      "Everything in Starter",
      "Website + hosting",
      "Commission-free ordering",
      "Autopilot Google posts",
      "Competitor watch",
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
      "Menu concierge",
      "Priority support",
    ],
  },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-x-clip"
      style={{ background: "var(--color-cream)", color: "var(--color-espresso)" }}
    >
      <LandingNav />

      {/* ============ HERO ============ */}
      <section className="relative max-w-6xl mx-auto px-5 pt-14 md:pt-20 pb-10 text-center">
        <Reveal>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[14px] font-medium mb-7"
            style={{
              background: "rgba(217,45,32,0.08)",
              color: "var(--color-chili)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse-dot"
              style={{ background: "var(--color-chili)" }}
            />
            Free during beta — no credit card
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display font-semibold tracking-[-0.02em] leading-[1.02] text-[44px] md:text-[84px] mb-6">
            Your restaurant&apos;s
            <br />
            online presence,{" "}
            <em
              className="font-display italic font-medium"
              style={{ color: "var(--color-chili)" }}
            >
              handled.
            </em>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-[17px] md:text-[20px] text-stone-500 max-w-2xl mx-auto leading-relaxed mb-9">
            We build your website, keep your menu fresh, take commission-free
            orders, and answer every review — while you run the kitchen.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <Link
              href="/login"
              className="btn-primary !min-h-[56px] !px-9 !text-[17px] w-full sm:w-auto shadow-xl shadow-red-900/20"
            >
              Start free <ArrowRight size={18} className="ml-1.5" />
            </Link>
            <a
              href="#how"
              className="btn-secondary !min-h-[56px] !px-9 !text-[17px] w-full sm:w-auto"
            >
              See how it works
            </a>
          </div>
          <p className="text-[14px] text-stone-400">Set up in 5 minutes · Cancel anytime</p>
        </Reveal>

        {/* Hero visual — food photo with floating product cards */}
        <Reveal delay={120} className="mt-12 md:mt-16">
          <div className="relative max-w-4xl mx-auto">
            <div className="rounded-[28px] overflow-hidden shadow-2xl shadow-stone-900/20 border border-stone-900/10">
              <Image
                src="/images/hero-spread.jpg"
                alt="A vibrant spread of dishes at a restaurant using LocalBoost"
                width={1600}
                height={1000}
                className="w-full h-[320px] md:h-[480px] object-cover"
                priority
              />
            </div>

            {/* Floating review card */}
            <div className="absolute -left-3 md:-left-10 top-8 md:top-14 w-[240px] md:w-[300px] text-left animate-floaty">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl shadow-stone-900/15 border border-white/60">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ background: "var(--color-chili)" }}
                  >
                    <Bell size={15} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold leading-tight">New Google review</p>
                    <p className="text-[11px] text-stone-400">just now</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-1.5" style={{ color: "var(--color-chili)" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-[13px] text-stone-600 leading-snug mb-3">
                  “The paneer tikka was unreal. Staff remembered our order!”
                </p>
                <div className="flex gap-2">
                  <span className="flex-1 text-center text-[13px] font-semibold text-white rounded-xl py-2" style={{ background: "var(--color-chili)" }}>
                    Approve reply
                  </span>
                  <span className="text-[13px] font-semibold rounded-xl py-2 px-3 bg-stone-100 text-stone-600">
                    Edit
                  </span>
                </div>
              </div>
            </div>

            {/* Floating order card */}
            <div className="absolute -right-3 md:-right-10 bottom-8 md:bottom-14 w-[230px] md:w-[280px] text-left animate-floaty-slow">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl shadow-stone-900/15 border border-white/60">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                    <UtensilsCrossed size={15} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold leading-tight">New order #1042</p>
                    <p className="text-[11px] text-stone-400">pickup · $36.50</p>
                  </div>
                </div>
                <p className="text-[13px] text-stone-600 mb-3">2× Chicken Biryani, 1× Naan</p>
                <span className="block text-center text-[13px] font-semibold text-white rounded-xl py-2 bg-stone-900">
                  Accept order
                </span>
              </div>
            </div>

            {/* Rating badge */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 animate-floaty">
              <div className="bg-stone-900 text-white rounded-full pl-2 pr-5 py-2 flex items-center gap-2.5 shadow-xl">
                <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center font-display font-bold text-[15px]">
                  4.8
                </span>
                <span className="text-[13px] font-medium whitespace-nowrap">
                  on Google · 212 reviews
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="mt-16 md:mt-24 py-5 overflow-hidden" style={{ background: "var(--color-espresso)" }}>
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1}>
              {marqueeItems.map((item) => (
                <span key={`${dup}-${item}`} className="flex items-center">
                  <span className="font-display italic text-[20px] md:text-[24px] text-[#faf8f5] px-6">
                    {item}
                  </span>
                  <Sparkles size={16} style={{ color: "var(--color-chili)" }} className="shrink-0" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="max-w-6xl mx-auto px-5 py-16 md:py-24">
        <Reveal>
          <p className="text-center text-[14px] font-semibold uppercase tracking-[0.14em] text-stone-400 mb-10">
            Why your online presence is the dining room
          </p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-10 md:gap-6 text-center">
          {stats.map((s, i) => (
            <Reveal key={s.value} delay={i * 100}>
              <div className="font-display font-semibold text-[56px] md:text-[72px] leading-none mb-3" style={{ color: "var(--color-chili)" }}>
                {s.value}
              </div>
              <p className="text-[16px] text-stone-600 leading-relaxed max-w-xs mx-auto mb-2">
                {s.label}
              </p>
              <p className="text-[13px] text-stone-400">— {s.source}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ BENTO FEATURES ============ */}
      <section id="features" className="max-w-6xl mx-auto px-5 pb-20 md:pb-28 scroll-mt-20">
        <Reveal>
          <h2 className="font-display font-semibold tracking-[-0.02em] text-[34px] md:text-[54px] leading-[1.05] text-center mb-4">
            Everything handled.
            <br />
            <em className="italic font-medium" style={{ color: "var(--color-chili)" }}>
              Nothing to learn.
            </em>
          </h2>
          <p className="text-[16px] md:text-[18px] text-stone-500 text-center max-w-xl mx-auto mb-12">
            One system for your website, menu, orders, and reputation. If you can
            tap a button, you can run LocalBoost.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Big cell — review inbox */}
          <Reveal className="md:col-span-2 md:row-span-2" delay={0}>
            <div className="card p-6 md:p-8 h-full flex flex-col">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "rgba(217,45,32,0.08)" }}
              >
                <Inbox size={24} style={{ color: "var(--color-chili)" }} strokeWidth={2} />
              </div>
              <h3 className="font-display font-semibold text-[26px] md:text-[30px] tracking-tight mb-2">
                One inbox for every review
              </h3>
              <p className="text-[15px] md:text-[16px] text-stone-500 leading-relaxed mb-6 max-w-md">
                Google reviews land in a single feed. Our AI drafts a personal,
                on-brand reply for each one — you just tap approve.
              </p>
              <div className="bg-stone-50 rounded-2xl p-5 mt-auto">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[15px] font-semibold">Aarav M.</span>
                  <span className="flex items-center gap-1 text-[13px] text-stone-400">
                    Google ·
                    <span className="flex gap-px" style={{ color: "var(--color-chili)" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                      ))}
                    </span>
                  </span>
                </div>
                <p className="text-[15px] text-stone-600 leading-relaxed mb-3">
                  The paneer tikka was unreal. Staff remembered our order from last month!
                </p>
                <div className="bg-white rounded-xl p-4 border border-stone-100 mb-4">
                  <p className="text-[13px] font-semibold mb-1 flex items-center gap-1.5" style={{ color: "var(--color-chili)" }}>
                    <Sparkles size={13} /> AI draft
                  </p>
                  <p className="text-[14px] text-stone-500 leading-relaxed">
                    Thank you, Aarav! Thrilled the paneer tikka hit the spot — see you next month.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="btn-primary flex-1 !min-h-[48px]">
                    <Check size={18} className="mr-1.5" /> Approve
                  </span>
                  <span className="btn-secondary !min-h-[48px] !px-6">Edit</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Website cell */}
          <Reveal delay={80}>
            <div className="card overflow-hidden h-full flex flex-col">
              <div className="relative h-44 md:h-48">
                <Image
                  src="/images/restaurant-interior.jpg"
                  alt="A restaurant dining room"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <Globe size={18} style={{ color: "var(--color-chili)" }} />
                  <h3 className="text-[18px] font-semibold tracking-tight">A website that sells</h3>
                </div>
                <p className="text-[15px] text-stone-500 leading-relaxed">
                  Designed, hosted, and kept fresh for you. Your menu updates everywhere at once.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Ordering cell */}
          <Reveal delay={140}>
            <div className="card overflow-hidden h-full flex flex-col">
              <div className="relative h-44 md:h-48">
                <Image
                  src="/images/dish-closeup.jpg"
                  alt="A sizzling dish ready to order"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 text-[13px] font-bold text-white px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur">
                  0% commission
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-[18px] font-semibold tracking-tight mb-2">Ordering, minus the fees</h3>
                <p className="text-[15px] text-stone-500 leading-relaxed">
                  Customers order straight from your site. Every dollar stays with you.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Posts cell */}
          <Reveal delay={0}>
            <div className="card p-6 h-full">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(217,45,32,0.08)" }}
              >
                <CalendarCheck size={22} style={{ color: "var(--color-chili)" }} strokeWidth={2} />
              </div>
              <h3 className="text-[18px] font-semibold tracking-tight mb-1.5">Posts on autopilot</h3>
              <p className="text-[15px] text-stone-500 leading-relaxed">
                Google Business updates, photos, and hour changes — scheduled in minutes, running on their own.
              </p>
            </div>
          </Reveal>

          {/* Competitors cell */}
          <Reveal delay={80}>
            <div className="card p-6 h-full">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(217,45,32,0.08)" }}
              >
                <Eye size={22} style={{ color: "var(--color-chili)" }} strokeWidth={2} />
              </div>
              <h3 className="text-[18px] font-semibold tracking-tight mb-1.5">Know your competition</h3>
              <p className="text-[15px] text-stone-500 leading-relaxed mb-4">
                A short Monday email: who&apos;s gaining stars near you, and who&apos;s slipping.
              </p>
              <div className="space-y-2">
                {[
                  { name: "Spice Route", trend: "+0.2", up: true },
                  { name: "Tandoori Nights", trend: "-0.1", up: false },
                ].map((c) => (
                  <div key={c.name} className="flex items-center justify-between bg-stone-50 rounded-xl px-3.5 py-2.5">
                    <span className="text-[14px] font-medium">{c.name}</span>
                    <span className={`text-[13px] font-bold flex items-center gap-1 ${c.up ? "text-emerald-600" : "text-red-500"}`}>
                      <TrendingUp size={14} className={c.up ? "" : "rotate-180"} /> {c.trend}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Score cell */}
          <Reveal delay={140}>
            <div className="card p-6 h-full text-white flex flex-col justify-between" style={{ background: "var(--color-espresso)" }}>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-white/10"
              >
                <Gauge size={22} style={{ color: "#f87171" }} strokeWidth={2} />
              </div>
              <div>
                <div className="font-display font-semibold text-[64px] leading-none mb-2">
                  87<span className="text-[28px] text-stone-400">/100</span>
                </div>
                <h3 className="text-[18px] font-semibold tracking-tight mb-1.5">One score to watch</h3>
                <p className="text-[15px] text-stone-400 leading-relaxed">
                  Reviews, replies, and posts rolled into a single number. Satisfying to grow.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ DARK PHONE SECTION ============ */}
      <section className="max-w-6xl mx-auto px-5 pb-20 md:pb-28">
        <Reveal>
          <div
            className="rounded-[32px] overflow-hidden px-6 py-14 md:p-16 text-white relative"
            style={{ background: "var(--color-espresso)" }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <Smartphone size={20} style={{ color: "#f87171" }} />
                  <span className="text-[14px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Built for the pass
                  </span>
                </div>
                <h2 className="font-display font-semibold tracking-[-0.02em] text-[34px] md:text-[48px] leading-[1.05] mb-5">
                  Run it from your phone,{" "}
                  <em className="italic font-medium" style={{ color: "#f87171" }}>
                    between services.
                  </em>
                </h2>
                <p className="text-[16px] md:text-[18px] text-stone-400 leading-relaxed mb-8">
                  No laptop, no marketing degree. The whole system fits in your
                  pocket and speaks plain language.
                </p>
                <ul className="space-y-4">
                  {[
                    "Approve review replies with one tap",
                    "Get pinged the second an order lands",
                    "Fix a menu price from the dining room",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-3 text-[16px] text-stone-200">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "rgba(217,45,32,0.25)" }}
                      >
                        <Check size={15} style={{ color: "#f87171" }} strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phone mock */}
              <div className="flex justify-center">
                <div className="w-[280px] rounded-[44px] border-[10px] border-stone-800 bg-[#faf8f5] shadow-2xl overflow-hidden animate-floaty-slow">
                  <div className="pt-4 pb-3 px-5" style={{ background: "var(--color-cream)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                          style={{ background: "var(--color-chili)" }}
                        >
                          <ChiliLogo size={13} />
                        </span>
                        <span className="text-[13px] font-bold text-stone-900">LocalBoost</span>
                      </span>
                      <span className="relative">
                        <Bell size={16} className="text-stone-500" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-chili)" }} />
                      </span>
                    </div>
                    <div className="flex gap-1.5 bg-stone-200/70 rounded-full p-1 mb-1">
                      {["Inbox", "Orders", "Menu"].map((t, i) => (
                        <span
                          key={t}
                          className={`flex-1 text-center text-[11px] font-semibold rounded-full py-1.5 ${
                            i === 0 ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="px-4 py-4 space-y-3 bg-white min-h-[320px]">
                    <div className="rounded-2xl border border-stone-100 p-3.5 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-semibold text-stone-900">Priya S.</span>
                        <span className="flex gap-px" style={{ color: "var(--color-chili)" }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill="currentColor" strokeWidth={0} />
                          ))}
                        </span>
                      </div>
                      <p className="text-[12px] text-stone-500 leading-snug mb-2.5">
                        Best biryani in Jersey City, hands down.
                      </p>
                      <span
                        className="block text-center text-[12px] font-semibold text-white rounded-xl py-2"
                        style={{ background: "var(--color-chili)" }}
                      >
                        Approve
                      </span>
                    </div>
                    <div className="rounded-2xl border border-stone-100 p-3.5 shadow-sm opacity-70">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-semibold text-stone-900">Marcus T.</span>
                        <span className="flex gap-px" style={{ color: "var(--color-chili)" }}>
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} size={10} fill="currentColor" strokeWidth={0} />
                          ))}
                        </span>
                      </div>
                      <p className="text-[12px] text-stone-500 leading-snug">
                        Great naan, wish the wait was shorter on Fridays.
                      </p>
                    </div>
                    <div className="rounded-2xl p-3.5 text-white" style={{ background: "var(--color-espresso)" }}>
                      <p className="text-[12px] font-semibold mb-0.5">Visibility score</p>
                      <p className="font-display font-semibold text-[30px] leading-none">
                        87<span className="text-[16px] text-stone-400">/100</span>
                        <span className="text-[12px] font-sans font-semibold text-emerald-400 ml-2">▲ 4 this week</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="max-w-6xl mx-auto px-5 pb-20 md:pb-28 scroll-mt-20">
        <Reveal>
          <h2 className="font-display font-semibold tracking-[-0.02em] text-[34px] md:text-[54px] leading-[1.05] text-center mb-4">
            Live in a week,{" "}
            <em className="italic font-medium" style={{ color: "var(--color-chili)" }}>
              not a quarter.
            </em>
          </h2>
          <p className="text-[16px] md:text-[18px] text-stone-500 text-center max-w-xl mx-auto mb-14">
            We do the heavy lifting. You keep cooking.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-10 md:gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="font-display font-semibold text-[80px] md:text-[96px] leading-none text-stone-200 mb-4">
                {s.n}
              </div>
              <h3 className="font-display font-semibold text-[24px] tracking-tight mb-2">{s.title}</h3>
              <p className="text-[15px] md:text-[16px] text-stone-500 leading-relaxed">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="max-w-6xl mx-auto px-5 pb-20 md:pb-28 scroll-mt-20">
        <Reveal>
          <h2 className="font-display font-semibold tracking-[-0.02em] text-[34px] md:text-[54px] leading-[1.05] text-center mb-4">
            One flat price.{" "}
            <em className="italic font-medium" style={{ color: "var(--color-chili)" }}>
              No surprises.
            </em>
          </h2>
          <p className="text-[16px] md:text-[18px] text-stone-500 text-center mb-12">
            Less than one catering order a month. Free during beta.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto items-stretch">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 100} className="h-full">
              <div
                className="card p-7 flex flex-col h-full relative"
                style={
                  p.highlight
                    ? { border: "2px solid var(--color-chili)", boxShadow: "0 20px 50px -20px rgba(217,45,32,0.35)" }
                    : undefined
                }
              >
                {p.highlight && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[12px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full text-white whitespace-nowrap"
                    style={{ background: "var(--color-chili)" }}
                  >
                    Most popular
                  </span>
                )}
                <h3 className="font-display font-semibold text-[22px]">{p.name}</h3>
                <p className="text-[14px] text-stone-500 mb-5">{p.tagline}</p>
                <div className="mb-6">
                  <span className="font-display font-semibold text-[52px] tracking-tight">${p.price}</span>
                  <span className="text-stone-500 text-[15px]">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[15px] text-stone-600">
                      <Check size={17} className="mt-0.5 shrink-0" style={{ color: "var(--color-chili)" }} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`${p.highlight ? "btn-primary" : "btn-secondary"} w-full`}
                >
                  Choose {p.name}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="max-w-6xl mx-auto px-5 pb-20 md:pb-28">
        <Reveal>
          <div
            className="rounded-[32px] px-6 py-16 md:py-24 text-center text-white relative overflow-hidden"
            style={{ background: "var(--color-chili)" }}
          >
            <div
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #7f1d1d 0%, transparent 70%)" }}
            />
            <div className="relative">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/15 mb-6">
                <ChiliLogo size={34} />
              </span>
              <h2 className="font-display font-semibold tracking-[-0.02em] text-[38px] md:text-[64px] leading-[1.03] mb-5">
                Ready when
                <br />
                you are.
              </h2>
              <p className="text-[16px] md:text-[19px] text-white/85 max-w-lg mx-auto leading-relaxed mb-9">
                Join the beta free. Your future regulars are searching right now —
                make sure they find you.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center min-h-[56px] px-10 text-[17px] font-semibold rounded-2xl bg-white text-stone-900 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Start free <ArrowRight size={18} className="ml-1.5" />
              </Link>
              <p className="text-[14px] text-white/70 mt-4">No credit card · 5-minute setup</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-stone-900/10">
        <div className="max-w-6xl mx-auto px-5 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ background: "var(--color-chili)" }}
            >
              <ChiliLogo size={17} />
            </span>
            <span className="font-bold tracking-tight text-[17px]">LocalBoost</span>
          </span>
          <p className="text-[14px] text-stone-400 text-center">
            Built for local restaurants that deserve to be found.
          </p>
          <div className="flex items-center gap-6 text-[14px] font-medium text-stone-500">
            <a href="#features" className="hover:text-stone-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors">Pricing</a>
            <Link href="/login" className="hover:text-stone-900 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
