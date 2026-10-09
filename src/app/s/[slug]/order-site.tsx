"use client";

import { useMemo, useState } from "react";
import { MapPin, Phone, Plus, Minus, ShoppingBag, Check, Loader2, ArrowLeft } from "lucide-react";
import { ChiliLogo } from "@/components/chili-logo";
import { formatCents } from "@/lib/slug";

interface Business {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  slug: string;
}
interface Category {
  id: string;
  name: string;
}
interface MenuItem {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price_cents: number;
}

type Screen = "menu" | "checkout" | "done";

export default function OrderSite({
  business,
  categories,
  items,
}: {
  business: Business;
  categories: Category[];
  items: MenuItem[];
}) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [screen, setScreen] = useState<Screen>("menu");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ item: itemById.get(id)!, qty }))
        .filter((l) => l.item && l.qty > 0),
    [cart, itemById]
  );
  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);
  const subtotal = cartLines.reduce((s, l) => s + l.item.price_cents * l.qty, 0);

  const grouped = useMemo(() => {
    const cats = categories.length > 0 ? categories : [{ id: "__none", name: "Menu" }];
    return cats.map((c) => ({
      ...c,
      items: items.filter((i) => (c.id === "__none" ? true : i.category_id === c.id)),
    })).filter((g) => g.items.length > 0);
  }, [categories, items]);

  function setQty(id: string, qty: number) {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(qty, 20);
      return next;
    });
  }

  async function placeOrder() {
    if (!name.trim() || !phone.trim() || cartLines.length === 0) return;
    setPlacing(true);
    setOrderError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: business.slug,
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          note: note.trim() || undefined,
          items: cartLines.map((l) => ({ item_id: l.item.id, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not place order");
      setOrderCode(data.code);
      setCart({});
      setScreen("done");
    } catch (e) {
      setOrderError(e instanceof Error ? e.message : "Could not place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-cream)" }}>
      {/* Restaurant header */}
      <header className="bg-white border-b border-stone-200/60">
        <div className="max-w-2xl mx-auto px-5 pt-10 pb-6 text-center">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white"
            style={{ background: "var(--color-chili)" }}
          >
            <ChiliLogo size={28} />
          </div>
          <h1 className="text-[32px] font-bold tracking-tight">{business.name}</h1>
          <div className="mt-2 space-y-1">
            {business.address && (
              <p className="text-[14px] text-stone-500 flex items-center justify-center gap-1.5">
                <MapPin size={14} /> {business.address}
              </p>
            )}
            {business.phone && (
              <p className="text-[14px] text-stone-500 flex items-center justify-center gap-1.5">
                <Phone size={14} /> {business.phone}
              </p>
            )}
          </div>
          <p className="text-[13px] text-stone-400 mt-3">Order ahead · pay at pickup</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pb-40">
        {screen === "menu" && (
          <div className="pt-6 space-y-8">
            {grouped.length === 0 && (
              <div className="card p-10 text-center">
                <p className="text-[16px] font-medium mb-1">Menu coming soon</p>
                <p className="text-[14px] text-stone-500">Check back shortly — we&apos;re setting up.</p>
              </div>
            )}
            {grouped.map((g) => (
              <section key={g.id}>
                <h2 className="text-[20px] font-bold tracking-tight mb-3">{g.name}</h2>
                <div className="card divide-y divide-stone-100">
                  {g.items.map((item) => {
                    const qty = cart[item.id] ?? 0;
                    return (
                      <div key={item.id} className="p-4 flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className="text-[16px] font-semibold">{item.name}</h3>
                            <span className="text-[15px] font-semibold shrink-0">{formatCents(item.price_cents)}</span>
                          </div>
                          {item.description && (
                            <p className="text-[14px] text-stone-500 mt-0.5 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                        {qty === 0 ? (
                          <button
                            onClick={() => setQty(item.id, 1)}
                            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white active:scale-95 transition-transform"
                            style={{ background: "var(--color-chili)" }}
                            aria-label={`Add ${item.name}`}
                          >
                            <Plus size={20} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setQty(item.id, qty - 1)}
                              className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center active:scale-95"
                              aria-label="Remove one"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-6 text-center font-bold text-[16px]">{qty}</span>
                            <button
                              onClick={() => setQty(item.id, qty + 1)}
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white active:scale-95"
                              style={{ background: "var(--color-chili)" }}
                              aria-label="Add one"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {screen === "checkout" && (
          <div className="pt-6">
            <button onClick={() => setScreen("menu")} className="flex items-center gap-1 text-[15px] font-medium text-stone-500 mb-4 min-h-[44px]">
              <ArrowLeft size={18} /> Back to menu
            </button>
            <h2 className="text-[24px] font-bold tracking-tight mb-4">Your order</h2>
            <div className="card divide-y divide-stone-100 mb-4">
              {cartLines.map((l) => (
                <div key={l.item.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-[16px] font-medium">{l.item.name}</div>
                    <div className="text-[14px] text-stone-500">
                      {formatCents(l.item.price_cents)} × {l.qty}
                    </div>
                  </div>
                  <div className="text-[16px] font-semibold">{formatCents(l.item.price_cents * l.qty)}</div>
                </div>
              ))}
              <div className="p-4 flex items-center justify-between">
                <span className="text-[16px] font-bold">Total due at pickup</span>
                <span className="text-[20px] font-bold">{formatCents(subtotal)}</span>
              </div>
            </div>
            <div className="card p-5 space-y-3">
              <div>
                <label className="block text-[15px] font-medium mb-1.5">Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya"
                  className="w-full min-h-[52px] px-4 border border-stone-200 rounded-xl bg-white text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                />
              </div>
              <div>
                <label className="block text-[15px] font-medium mb-1.5">Phone number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="We'll text when it's ready"
                  inputMode="tel"
                  className="w-full min-h-[52px] px-4 border border-stone-200 rounded-xl bg-white text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                />
              </div>
              <div>
                <label className="block text-[15px] font-medium mb-1.5">Note <span className="text-stone-400 font-normal">(optional)</span></label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. extra spicy, no onion"
                  className="w-full min-h-[52px] px-4 border border-stone-200 rounded-xl bg-white text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                />
              </div>
              {orderError && <p className="text-[14px] text-red-600">{orderError}</p>}
              <button
                onClick={placeOrder}
                disabled={placing || !name.trim() || !phone.trim()}
                className="btn-primary w-full !min-h-[56px] text-[17px] disabled:opacity-40"
              >
                {placing ? <Loader2 size={20} className="animate-spin" /> : `Place order · ${formatCents(subtotal)}`}
              </button>
              <p className="text-[13px] text-stone-400 text-center">Pay at pickup. No account needed.</p>
            </div>
          </div>
        )}

        {screen === "done" && orderCode && (
          <div className="pt-16 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 mx-auto mb-5 flex items-center justify-center">
              <Check size={36} className="text-emerald-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-[26px] font-bold tracking-tight mb-2">Order placed!</h2>
            <p className="text-[15px] text-stone-500 mb-6 max-w-[300px] mx-auto leading-relaxed">
              Show this code at pickup. We&apos;ll text you when it&apos;s ready.
            </p>
            <div className="card inline-block px-10 py-6 mb-8">
              <div className="text-[13px] font-medium text-stone-400 uppercase tracking-widest mb-1">Pickup code</div>
              <div className="text-[40px] font-bold tracking-[0.2em]">{orderCode}</div>
            </div>
            <div>
              <button onClick={() => { setScreen("menu"); setOrderCode(null); }} className="btn-secondary px-8">
                Back to menu
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Sticky cart bar */}
      {screen === "menu" && cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-white via-white to-transparent">
          <button
            onClick={() => setScreen("checkout")}
            className="btn-primary w-full !min-h-[56px] text-[17px] max-w-2xl mx-auto shadow-lg"
          >
            <ShoppingBag size={20} className="mr-2" />
            View order · {cartCount} item{cartCount === 1 ? "" : "s"} · {formatCents(subtotal)}
          </button>
        </div>
      )}

      <footer className="max-w-2xl mx-auto px-5 pb-10 text-center">
        <p className="text-[13px] text-stone-400">Website powered by LocalBoost</p>
      </footer>
    </div>
  );
}
