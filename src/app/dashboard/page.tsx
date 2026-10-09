import Link from "next/link";
import {
  Star,
  MessageCircle,
  TrendingUp,
  CalendarCheck,
  ChevronRight,
  Sparkles,
  ReceiptText,
  PenLine,
  Eye,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      {/* Greeting */}
      <h1 className="text-[28px] font-bold tracking-tight mb-1">
        Good afternoon
      </h1>
      <p className="text-[15px] text-stone-500 mb-6">
        Here&apos;s how your business looks online today.
      </p>

      {/* Visibility score hero card */}
      <div className="card p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium text-stone-500 uppercase tracking-wide mb-1">
              Visibility score
            </div>
            <div className="text-[44px] font-bold leading-none tracking-tight">
              —
            </div>
            <p className="text-[14px] text-stone-500 mt-2 max-w-[220px]">
              Connect Google to see your score and what&apos;s holding it back.
            </p>
          </div>
          <div
            className="w-[88px] h-[88px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(194,65,12,0.08)" }}
          >
            <Sparkles size={36} style={{ color: "var(--color-terracotta)" }} strokeWidth={1.75} />
          </div>
        </div>
        <Link href="/dashboard/settings" className="btn-primary w-full mt-5">
          Connect Google Business
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: MessageCircle, label: "Reviews waiting", value: "—" },
          { icon: Star, label: "Avg. rating", value: "—" },
          { icon: CalendarCheck, label: "Posts this month", value: "—" },
          { icon: TrendingUp, label: "Views trend", value: "—" },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <s.icon size={20} className="text-stone-400 mb-2" strokeWidth={2} />
            <div className="text-[22px] font-bold tracking-tight">{s.value}</div>
            <div className="text-[13px] text-stone-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Next steps */}
      <h2 className="text-[17px] font-semibold mb-3">Get set up</h2>
      <div className="card divide-y divide-stone-100 mb-6">
        {[
          {
            title: "Connect Google Business",
            desc: "Sync reviews and post updates",
            href: "/dashboard/settings",
          },
          {
            title: "Add your menu",
            desc: "It goes live on your website instantly",
            href: "/dashboard/menu",
          },
          {
            title: "Review your first AI reply",
            desc: "Approve it with one tap",
            href: "/dashboard/reviews",
          },
        ].map((step, i) => (
          <Link
            key={step.title}
            href={step.href}
            className="flex items-center gap-4 p-4 min-h-[68px] active:bg-stone-50"
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-[15px] font-bold text-white shrink-0"
              style={{ background: "var(--color-terracotta)" }}
            >
              {i + 1}
            </span>
            <span className="flex-1">
              <span className="block text-[16px] font-medium">{step.title}</span>
              <span className="block text-[14px] text-stone-500">{step.desc}</span>
            </span>
            <ChevronRight size={20} className="text-stone-300 shrink-0" />
          </Link>
        ))}
      </div>

      {/* Marketing */}
      <h2 className="text-[17px] font-semibold mb-3">Marketing</h2>
      <div className="card divide-y divide-stone-100">
        {[
          {
            icon: ReceiptText,
            title: "Today's orders",
            desc: "See what's coming in from your website",
            href: "/dashboard/orders",
          },
          {
            icon: PenLine,
            title: "Google posts",
            desc: "Keep your profile fresh on autopilot",
            href: "/dashboard/posts",
          },
          {
            icon: Eye,
            title: "Competitor watch",
            desc: "See how you stack up nearby",
            href: "/dashboard/competitors",
          },
        ].map((row) => (
          <Link
            key={row.title}
            href={row.href}
            className="flex items-center gap-4 p-4 min-h-[68px] active:bg-stone-50"
          >
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(194,65,12,0.08)" }}
            >
              <row.icon size={20} style={{ color: "var(--color-terracotta)" }} strokeWidth={2} />
            </span>
            <span className="flex-1">
              <span className="block text-[16px] font-medium">{row.title}</span>
              <span className="block text-[14px] text-stone-500">{row.desc}</span>
            </span>
            <ChevronRight size={20} className="text-stone-300 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
