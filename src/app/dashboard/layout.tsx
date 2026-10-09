"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  Inbox,
  UtensilsCrossed,
  Settings,
  Flame,
} from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/orders", label: "Orders", icon: ReceiptText },
  { href: "/dashboard/reviews", label: "Reviews", icon: Inbox },
  { href: "/dashboard/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (t: (typeof tabs)[number]) =>
    t.exact ? pathname === t.href : pathname.startsWith(t.href);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-cream)" }}>
      {/* Desktop top bar */}
      <header className="hidden md:block bg-white/90 backdrop-blur border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "var(--color-terracotta)" }}>
              <Flame size={18} strokeWidth={2.5} />
            </span>
            <span className="font-bold text-lg tracking-tight">LocalBoost</span>
          </Link>
          <nav className="flex gap-1">
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`px-4 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                  isActive(t)
                    ? "text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
                style={isActive(t) ? { background: "var(--color-terracotta)" } : undefined}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="md:hidden bg-white/90 backdrop-blur border-b border-stone-200/60 sticky top-0 z-40">
        <div className="px-5 py-3.5 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: "var(--color-terracotta)" }}>
            <Flame size={16} strokeWidth={2.5} />
          </span>
          <span className="font-bold text-[17px] tracking-tight">LocalBoost</span>
        </div>
      </header>

      {/* Content — extra bottom padding for tab bar on mobile */}
      <main className="max-w-5xl mx-auto px-5 md:px-6 pt-6 pb-28 md:pb-12">
        {children}
      </main>

      {/* iOS-style bottom tab bar (mobile only) */}
      <nav className="tab-bar md:hidden">
        <div className="flex justify-around max-w-md mx-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = isActive(t);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`tab-item ${active ? "active" : ""}`}
              >
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
