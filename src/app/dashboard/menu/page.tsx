"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Loader2, ExternalLink, Copy, Check, UtensilsCrossed } from "lucide-react";
import { formatCents } from "@/lib/slug";

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
  available: boolean;
}

export default function MenuPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Add-category form
  const [newCat, setNewCat] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  // Add-item form
  const [showItemForm, setShowItemForm] = useState<string | null>(null); // category id or "none"
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [savingItem, setSavingItem] = useState(false);

  const load = useCallback(async (bid: string) => {
    const [catsRes, itemsRes] = await Promise.all([
      fetch(`/api/menu/categories?business_id=${bid}`),
      fetch(`/api/menu/items?business_id=${bid}`),
    ]);
    if (catsRes.ok) setCategories(((await catsRes.json()).categories ?? []) as Category[]);
    if (itemsRes.ok) setItems(((await itemsRes.json()).items ?? []) as MenuItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/businesses/ensure", { method: "POST" });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setBusinessId(data.business.id);
      setSlug(data.business.slug);
      await load(data.business.id);
    })();
  }, [load]);

  async function addCategory() {
    if (!businessId || !newCat.trim()) return;
    setAddingCat(true);
    const res = await fetch("/api/menu/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_id: businessId, name: newCat.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      setCategories((prev) => [...prev, data.category]);
      setNewCat("");
    }
    setAddingCat(false);
  }

  async function addItem() {
    if (!businessId || !itemName.trim() || !itemPrice) return;
    setSavingItem(true);
    const res = await fetch("/api/menu/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_id: businessId,
        category_id: showItemForm === "none" ? null : showItemForm,
        name: itemName.trim(),
        description: itemDesc.trim() || undefined,
        price_cents: Math.round(parseFloat(itemPrice) * 100),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((prev) => [...prev, data.item]);
      setItemName("");
      setItemDesc("");
      setItemPrice("");
      setShowItemForm(null);
    }
    setSavingItem(false);
  }

  async function toggleAvailable(item: MenuItem) {
    if (!businessId) return;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i)));
    await fetch("/api/menu/items", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_id: businessId, id: item.id, available: !item.available }),
    });
  }

  async function deleteItem(id: string) {
    if (!businessId || !confirm("Remove this item from the menu?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/menu/items?business_id=${businessId}&id=${id}`, { method: "DELETE" });
  }

  async function seedSample() {
    if (!businessId) return;
    setLoading(true);
    await fetch("/api/menu/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_id: businessId }),
    });
    await load(businessId);
  }

  function copyLink() {
    if (!slug) return;
    const url = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const siteUrl = slug ? `/s/${slug}` : null;
  const grouped = categories.map((c) => ({
    ...c,
    items: items.filter((i) => i.category_id === c.id),
  }));
  const uncategorized = items.filter((i) => !i.category_id);

  return (
    <div>
      <h1 className="text-[28px] font-bold tracking-tight mb-1">Menu</h1>
      <p className="text-[15px] text-stone-500 mb-5">Changes go live on your website instantly.</p>

      {/* Website link card */}
      {siteUrl && (
        <div className="card p-5 mb-5">
          <div className="text-[13px] font-medium text-stone-500 uppercase tracking-wide mb-2">Your website</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[15px] bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 truncate">
              {typeof window !== "undefined" ? `${window.location.origin}${siteUrl}` : siteUrl}
            </code>
            <button onClick={copyLink} className="w-12 h-12 rounded-xl border border-stone-200 flex items-center justify-center shrink-0 active:scale-95" aria-label="Copy link">
              {copied ? <Check size={20} className="text-emerald-600" /> : <Copy size={20} className="text-stone-600" />}
            </button>
            <a href={siteUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl border border-stone-200 flex items-center justify-center shrink-0 active:scale-95" aria-label="Open website">
              <ExternalLink size={20} className="text-stone-600" />
            </a>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-stone-400" /></div>
      ) : categories.length === 0 && items.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(194,65,12,0.08)" }}>
            <UtensilsCrossed size={28} style={{ color: "var(--color-terracotta)" }} strokeWidth={1.75} />
          </div>
          <h2 className="text-[18px] font-semibold mb-2">No menu yet</h2>
          <p className="text-[15px] text-stone-500 max-w-[280px] mx-auto leading-relaxed mb-5">
            Add your dishes below, or start from a sample menu and edit it.
          </p>
          <button onClick={seedSample} className="btn-primary px-8">Load sample menu</button>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((g) => (
            <section key={g.id}>
              <h2 className="text-[18px] font-bold tracking-tight mb-2 px-1">{g.name}</h2>
              <div className="card divide-y divide-stone-100 mb-2">
                {g.items.map((item) => (
                  <ItemRow key={item.id} item={item} onToggle={() => toggleAvailable(item)} onDelete={() => deleteItem(item.id)} />
                ))}
                {g.items.length === 0 && <p className="p-4 text-[14px] text-stone-400">No items yet.</p>}
              </div>
              {showItemForm === g.id ? (
                <ItemForm
                  name={itemName} setName={setItemName}
                  desc={itemDesc} setDesc={setItemDesc}
                  price={itemPrice} setPrice={setItemPrice}
                  saving={savingItem} onSave={addItem} onCancel={() => setShowItemForm(null)}
                />
              ) : (
                <button onClick={() => setShowItemForm(g.id)} className="flex items-center gap-1.5 text-[15px] font-medium min-h-[44px] px-1" style={{ color: "var(--color-terracotta)" }}>
                  <Plus size={18} /> Add item
                </button>
              )}
            </section>
          ))}

          {uncategorized.length > 0 && (
            <section>
              <h2 className="text-[18px] font-bold tracking-tight mb-2 px-1">Other</h2>
              <div className="card divide-y divide-stone-100">
                {uncategorized.map((item) => (
                  <ItemRow key={item.id} item={item} onToggle={() => toggleAvailable(item)} onDelete={() => deleteItem(item.id)} />
                ))}
              </div>
            </section>
          )}

          {showItemForm === "none" ? (
            <ItemForm
              name={itemName} setName={setItemName}
              desc={itemDesc} setDesc={setItemDesc}
              price={itemPrice} setPrice={setItemPrice}
              saving={savingItem} onSave={addItem} onCancel={() => setShowItemForm(null)}
            />
          ) : (
            <button onClick={() => setShowItemForm("none")} className="flex items-center gap-1.5 text-[15px] font-medium min-h-[44px] px-1" style={{ color: "var(--color-terracotta)" }}>
              <Plus size={18} /> Add item without category
            </button>
          )}

          {/* Add category */}
          <div className="card p-4">
            <div className="text-[15px] font-semibold mb-2 px-1">Add a section</div>
            <div className="flex gap-2">
              <input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="e.g. Desserts"
                className="flex-1 min-h-[52px] px-4 border border-stone-200 rounded-xl bg-white text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
              />
              <button onClick={addCategory} disabled={addingCat || !newCat.trim()} className="btn-primary px-6 disabled:opacity-40">
                {addingCat ? <Loader2 size={18} className="animate-spin" /> : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemRow({ item, onToggle, onDelete }: { item: MenuItem; onToggle: () => void; onDelete: () => void }) {
  return (
    <div className={`p-4 flex items-center gap-3 ${item.available ? "" : "opacity-50"}`}>
      <div className="flex-1 min-w-0">
        <div className="text-[16px] font-medium">{item.name}</div>
        <div className="text-[14px] text-stone-500">{formatCents(item.price_cents)}{item.description ? ` · ${item.description}` : ""}</div>
      </div>
      <button
        onClick={onToggle}
        className={`min-h-[44px] px-4 rounded-full text-[14px] font-semibold ${item.available ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}
      >
        {item.available ? "On" : "Off"}
      </button>
      <button onClick={onDelete} className="w-11 h-11 rounded-xl flex items-center justify-center active:scale-95" aria-label={`Delete ${item.name}`}>
        <Trash2 size={18} className="text-stone-400" />
      </button>
    </div>
  );
}

function ItemForm(props: {
  name: string; setName: (v: string) => void;
  desc: string; setDesc: (v: string) => void;
  price: string; setPrice: (v: string) => void;
  saving: boolean; onSave: () => void; onCancel: () => void;
}) {
  return (
    <div className="card p-4 space-y-2.5 mb-2">
      <input value={props.name} onChange={(e) => props.setName(e.target.value)} placeholder="Item name"
        className="w-full min-h-[52px] px-4 border border-stone-200 rounded-xl bg-white text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400" />
      <input value={props.desc} onChange={(e) => props.setDesc(e.target.value)} placeholder="Description (optional)"
        className="w-full min-h-[52px] px-4 border border-stone-200 rounded-xl bg-white text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400" />
      <input value={props.price} onChange={(e) => props.setPrice(e.target.value)} placeholder="Price (e.g. 12.99)" inputMode="decimal"
        className="w-full min-h-[52px] px-4 border border-stone-200 rounded-xl bg-white text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400" />
      <div className="flex gap-2">
        <button onClick={props.onSave} disabled={props.saving || !props.name.trim() || !props.price} className="btn-primary flex-1 disabled:opacity-40">
          {props.saving ? <Loader2 size={18} className="animate-spin" /> : "Save item"}
        </button>
        <button onClick={props.onCancel} className="min-h-[52px] px-6 rounded-[14px] border border-stone-200 text-[15px] font-medium text-stone-600">Cancel</button>
      </div>
    </div>
  );
}
