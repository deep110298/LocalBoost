"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ReceiptText, Phone, Loader2, RefreshCw } from "lucide-react";
import { formatCents } from "@/lib/slug";

interface OrderLine {
  item_id: string;
  name: string;
  price_cents: number;
  qty: number;
}
interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  note: string | null;
  items: OrderLine[];
  subtotal_cents: number;
  status: string;
  created_at: string;
}

const NEXT_STATUS: Record<string, { label: string; to: string }> = {
  new: { label: "Start preparing", to: "preparing" },
  preparing: { label: "Mark ready", to: "ready" },
  ready: { label: "Complete", to: "completed" },
};

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function orderCode(id: string): string {
  return id.replace(/-/g, "").slice(0, 6).toUpperCase();
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (bid: string) => {
    const res = await fetch(`/api/orders?business_id=${bid}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders as Order[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Resolve the owner's business, then load + poll orders.
    (async () => {
      const res = await fetch("/api/businesses/ensure", { method: "POST" });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      const bid = (data.business?.id ?? null) as string | null;
      setBusinessId(bid);
      if (bid) {
        await load(bid);
        pollRef.current = setInterval(() => load(bid), 20000);
      }
    })();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [load]);

  async function setStatus(order: Order, status: string) {
    if (!businessId) return;
    setUpdating(order.id);
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_id: businessId, order_id: order.id, status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    }
    setUpdating(null);
  }

  const visible = showAll ? orders : orders.filter((o) => ["new", "preparing", "ready"].includes(o.status));
  const activeCount = orders.filter((o) => ["new", "preparing", "ready"].includes(o.status)).length;

  return (
    <div>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight flex items-center gap-2">
            Orders
            {activeCount > 0 && (
              <span
                className="text-[14px] font-bold text-white rounded-full px-2.5 py-0.5"
                style={{ background: "var(--color-chili)" }}
              >
                {activeCount}
              </span>
            )}
          </h1>
          <p className="text-[15px] text-stone-500 mt-1">From your website. Updates every 20 seconds.</p>
        </div>
        <button
          onClick={() => businessId && load(businessId)}
          className="w-11 h-11 rounded-full bg-white border border-stone-200 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          aria-label="Refresh orders"
        >
          <RefreshCw size={20} className="text-stone-600" />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { label: `Active${activeCount > 0 ? ` (${activeCount})` : ""}`, all: false },
          { label: "All", all: true },
        ].map((t) => (
          <button
            key={t.label}
            onClick={() => setShowAll(t.all)}
            className={`min-h-[44px] px-5 rounded-full text-[15px] font-medium ${
              showAll === t.all ? "text-white" : "bg-white border border-stone-200 text-stone-600"
            }`}
            style={showAll === t.all ? { background: "var(--color-chili)" } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-stone-400" /></div>
      ) : visible.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(217,45,32,0.08)" }}>
            <ReceiptText size={28} style={{ color: "var(--color-chili)" }} strokeWidth={1.75} />
          </div>
          <h2 className="text-[18px] font-semibold mb-2">No orders yet</h2>
          <p className="text-[15px] text-stone-500 max-w-[280px] mx-auto leading-relaxed">
            When customers order from your website, they&apos;ll show up here instantly.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => {
            const next = NEXT_STATUS[o.status];
            return (
              <div key={o.id} className="card p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[20px] font-bold tracking-[0.15em]">{orderCode(o.id)}</span>
                  <span className="text-[13px] text-stone-400">{timeAgo(o.created_at)}</span>
                </div>
                <div className="text-[16px] font-semibold">{o.customer_name}</div>
                <div className="text-[14px] text-stone-500 flex items-center gap-1.5 mb-3">
                  <Phone size={14} /> {o.customer_phone}
                </div>
                <div className="bg-stone-50 rounded-xl p-4 mb-3 space-y-1.5">
                  {(o.items as OrderLine[]).map((l, i) => (
                    <div key={i} className="flex justify-between text-[15px]">
                      <span>{l.qty} × {l.name}</span>
                      <span className="font-medium">{formatCents(l.price_cents * l.qty)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-[15px] font-bold pt-1.5 border-t border-stone-200/70">
                    <span>Total</span>
                    <span>{formatCents(o.subtotal_cents)}</span>
                  </div>
                </div>
                {o.note && <p className="text-[14px] text-stone-500 italic mb-3">“{o.note}”</p>}
                <div className="flex gap-2">
                  {next ? (
                    <button
                      onClick={() => setStatus(o, next.to)}
                      disabled={updating === o.id}
                      className="btn-primary flex-1"
                    >
                      {updating === o.id ? <Loader2 size={18} className="animate-spin" /> : next.label}
                    </button>
                  ) : (
                    <span className="flex-1 text-center text-[14px] font-medium text-stone-400 py-3 capitalize">
                      {o.status}
                    </span>
                  )}
                  {o.status !== "cancelled" && o.status !== "completed" && (
                    <button
                      onClick={() => setStatus(o, "cancelled")}
                      disabled={updating === o.id}
                      className="min-h-[52px] px-5 rounded-[14px] border border-stone-200 text-[15px] font-medium text-stone-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
