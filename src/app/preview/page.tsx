import Link from "next/link";
import Image from "next/image";
import { ChiliLogo } from "@/components/chili-logo";
import {
  Star,
  Check,
  ArrowRight,
  Bell,
  MapPin,
  Phone,
  Sparkles,
  Gauge,
  CalendarCheck,
} from "lucide-react";

// Personalized prospect preview: /preview?name=Persis&color=b91c1c&cuisine=indian
// Shows the prospect THEIR restaurant on LocalBoost — website, dashboard, app.

const DEFAULT_COLOR = "#d92d20";

const MENUS: Record<
  string,
  { tagline: string; items: { name: string; price: string; desc: string }[] }
> = {  indian: {
    tagline: "Flavors worth finding.",
    items: [
      { name: "Chicken Biryani", price: "$16.99", desc: "Saffron rice, fried onions, raita" },
      { name: "Paneer Tikka", price: "$13.99", desc: "Charred, smoky, mint chutney" },
      { name: "Butter Chicken", price: "$15.99", desc: "Tomato-fenugreek silk, naan" },
      { name: "Masala Dosa", price: "$11.99", desc: "Crisp crepe, sambar, coconut chutney" },
    ],
  },
  italian: {
    tagline: "Made the slow way.",
    items: [
      { name: "Margherita Pizza", price: "$14.99", desc: "San Marzano, fior di latte, basil" },
      { name: "Cacio e Pepe", price: "$16.99", desc: "Tonnarelli, pecorino, black pepper" },
      { name: "Chicken Parm", price: "$18.99", desc: "Breaded cutlet, marinara, mozzarella" },
      { name: "Tiramisu", price: "$8.99", desc: "Espresso-soaked, mascarpone cloud" },
    ],
  },
  mexican: {
    tagline: "Bold, fresh, every day.",
    items: [
      { name: "Al Pastor Tacos", price: "$12.99", desc: "Marinated pork, pineapple, cilantro" },
      { name: "Burrito Bowl", price: "$13.99", desc: "Cilantro rice, black beans, guac" },
      { name: "Chilaquiles", price: "$11.99", desc: "Salsa roja, crema, fried egg" },
      { name: "Churros", price: "$6.99", desc: "Cinnamon sugar, chocolate dip" },
    ],
  },
  default: {
    tagline: "Your neighborhood favorite.",
    items: [
      { name: "Signature Plate", price: "$15.99", desc: "The dish regulars drive for" },
      { name: "House Special", price: "$13.99", desc: "Made fresh every morning" },
      { name: "Classic Combo", price: "$12.99", desc: "Two favorites, one plate" },
      { name: "Sweet Finish", price: "$6.99", desc: "Save room — trust us" },
    ],
  },
};

// Services mode: /preview?type=service&vertical=spa — booking-focused mock
const SERVICES: Record<
  string,
  { tagline: string; cta: string; items: { name: string; price: string; desc: string }[] }
> = {
  spa: {
    tagline: "Unwind deeply. Right around the corner.",
    cta: "Book appointment",
    items: [
      { name: "Deep Tissue Massage", price: "$95", desc: "60 min · pain relief, muscle recovery" },
      { name: "Swedish Massage", price: "$75", desc: "60 min · full-body relaxation" },
      { name: "Hot Stone Massage", price: "$110", desc: "75 min · deep warmth, total unwind" },
      { name: "Cupping Therapy", price: "$85", desc: "45 min · tension release" },
    ],
  },
  barbershop: {
    tagline: "Sharp looks. Zero wait.",
    cta: "Book appointment",
    items: [
      { name: "Haircut", price: "$30", desc: "30 min · consultation included" },
      { name: "Beard Trim & Shape", price: "$20", desc: "20 min · hot towel finish" },
      { name: "Hot Towel Shave", price: "$35", desc: "30 min · classic straight razor" },
      { name: "Kids Cut", price: "$25", desc: "30 min · under 12" },
    ],
  },
  salon: {
    tagline: "Good hair days. On demand.",
    cta: "Book appointment",
    items: [
      { name: "Women's Cut", price: "$65", desc: "60 min · wash & style included" },
      { name: "Color + Cut", price: "$140", desc: "120 min · full color, cut & finish" },
      { name: "Blowout", price: "$45", desc: "45 min · smooth, bouncy finish" },
      { name: "Manicure", price: "$35", desc: "45 min · shape, cuticle & polish" },
    ],
  },
  auto: {
    tagline: "Fixed right. The first time.",
    cta: "Book service",
    items: [
      { name: "Oil Change", price: "$59", desc: "45 min · full synthetic, filter included" },
      { name: "Brake Inspection", price: "Free", desc: "30 min · pads, rotors & fluid check" },
      { name: "Tire Rotation", price: "$39", desc: "30 min · balance check included" },
      { name: "Diagnostics", price: "$89", desc: "60 min · full systems scan" },
    ],
  },
  default: {
    tagline: "Book in seconds. Not phone calls.",
    cta: "Book appointment",
    items: [
      { name: "Signature Service", price: "$75", desc: "60 min · our most booked" },
      { name: "Classic Service", price: "$55", desc: "45 min · the regular favorite" },
      { name: "Deluxe Package", price: "$120", desc: "90 min · the full treatment" },
      { name: "Quick Fix", price: "$35", desc: "30 min · in and out" },
    ],
  },
};

function sanitizeColor(c: string | undefined): string {
  if (c && /^#?[0-9a-fA-F]{6}$/.test(c)) return c.startsWith("#") ? c : `#${c}`;
  return DEFAULT_COLOR;
}

// Smart hero imagery: each business type gets a matching photo
const VERTICAL_IMAGES: Record<string, string> = {
  spa: "/images/spa-treatment.jpg",
  barbershop: "/images/barbershop.jpg",
  salon: "/images/salon.jpg",
  auto: "/images/auto-shop.jpg",
};

function sanitizeLogo(l: string | undefined): string | null {
  if (!l) return null;
  // Allow our hosted preview logos or any https image URL (their real logo)
  if (l.startsWith("/preview-logos/") && /^\/preview-logos\/[a-z0-9_-]+\.(png|jpg|jpeg|webp|svg)$/.test(l)) return l;
  if (/^https:\/\/[^"'\s<>]+\.(png|jpg|jpeg|webp|svg)(\?[^"'\s<>]*)?$/i.test(l)) return l;
  return null;
}

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; color?: string; cuisine?: string; logo?: string; type?: string; vertical?: string }>;
}) {
  const params = await searchParams;
  const name = (params.name || "Your Restaurant").slice(0, 40);
  const color = sanitizeColor(params.color);
  const isService = (params.type || "").toLowerCase() === "service";
  const cuisineKey = (params.cuisine || "").toLowerCase();
  const verticalKey = (params.vertical || "").toLowerCase();
  const menu = MENUS[cuisineKey] ?? MENUS.default;
  const service = SERVICES[verticalKey] ?? SERVICES.default;
  const logo = sanitizeLogo(params.logo);
  // Unified content for the two modes
  const tagline = isService ? service.tagline : menu.tagline;
  const items = isService ? service.items : menu.items;
  const primaryCta = isService ? service.cta : "Start an order";
  const navCta = isService ? "Book now" : "Order now";
  const heroSub = isService
    ? `Book ${name} online in 30 seconds — no phone tag, no waiting on hold.`
    : `Order direct from ${name} — no fees, no middlemen. Ready for pickup in 20 minutes.`;
  const listTitle = isService ? "Book a service" : "Popular right now";
  const itemCta = isService ? "Book" : "Add";
  const heroImage = isService
    ? (VERTICAL_IMAGES[verticalKey] ?? "/images/restaurant-interior.jpg")
    : "/images/hero-spread.jpg";
  const heroAlt = isService ? `${name} interior` : `${name} dishes`;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-cream)", color: "var(--color-espresso)" }}>
      {/* Preview banner */}
      <div className="text-white text-center px-5 py-3" style={{ background: "var(--color-espresso)" }}>
        <p className="text-[14px] md:text-[15px]">
          <span className="font-semibold">Personalized preview for {name}</span>
          <span className="text-stone-400"> — mocked up by LocalBoost. Imagine this live.</span>
        </p>
      </div>

      {/* ============ THEIR WEBSITE ============ */}
      <section className="max-w-6xl mx-auto px-5 pt-10 pb-16">
        <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-stone-400 mb-6 text-center">
          Their website
        </p>
        <div className="rounded-[28px] overflow-hidden border border-stone-900/10 shadow-2xl shadow-stone-900/15 bg-white">
          {/* site nav */}
          <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-stone-100">
            <span className="flex items-center gap-2">
              {logo ? (
                <img src={logo} alt={`${name} logo`} className="h-9 w-9 rounded-xl object-contain bg-white border border-stone-100" />
              ) : (
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: color }}>
                  <ChiliLogo size={17} />
                </span>
              )}
              <span className="font-display font-semibold text-[20px] tracking-tight">{name}</span>
            </span>
            <span className="hidden md:flex items-center gap-6 text-[14px] font-medium text-stone-500">
              <span>{isService ? "Services" : "Menu"}</span><span>About</span><span>Reviews</span>
            </span>
            <span className="text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl" style={{ background: color }}>
              {navCta}
            </span>
          </div>
          {/* site hero */}
          <div className="grid md:grid-cols-2 items-center">
            <div className="px-6 md:px-10 py-10 md:py-16">
              <h1 className="font-display font-semibold tracking-[-0.02em] text-[38px] md:text-[54px] leading-[1.03] mb-4">
                {tagline.split(".")[0]}.
                <br />
                <em className="italic font-medium" style={{ color }}>
                  {tagline.split(".")[1]?.trim() || "Done right."}
                </em>
              </h1>
              <p className="text-stone-500 text-[16px] leading-relaxed mb-7">
                {heroSub}
              </p>
              <div className="flex gap-3">
                <span className="text-white font-semibold px-7 py-3.5 rounded-2xl text-[16px]" style={{ background: color }}>
                  {primaryCta}
                </span>
                <span className="font-semibold px-7 py-3.5 rounded-2xl text-[16px] bg-stone-100 text-stone-700">
                  {isService ? "View services" : "View menu"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-6 text-[14px] text-stone-500">
                <span className="flex gap-0.5" style={{ color }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="font-semibold text-stone-700">4.8</span> · 200+ Google reviews
              </div>
            </div>
            <div className="relative h-64 md:h-full min-h-[320px]">
              <Image src={heroImage} alt={heroAlt} fill className="object-cover" />
            </div>
          </div>
          {/* site menu / services */}
          <div className="px-6 md:px-10 py-10 bg-stone-50/70">
            <h2 className="font-display font-semibold text-[26px] tracking-tight mb-6">{listTitle}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((item) => (
                <div key={item.name} className="bg-white rounded-2xl p-5 border border-stone-100 flex justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[16px] mb-1">{item.name}</p>
                    <p className="text-[14px] text-stone-500">{item.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-semibold text-[18px] mb-2">{item.price}</p>
                    <span className="text-white text-[13px] font-semibold px-3.5 py-1.5 rounded-lg" style={{ background: color }}>
                      {itemCta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-8 text-[14px] text-stone-500">
              <span className="flex items-center gap-1.5"><MapPin size={15} /> 123 Main St, Jersey City</span>
              <span className="flex items-center gap-1.5"><Phone size={15} /> (201) 555-0147</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THEIR DASHBOARD ============ */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-stone-400 mb-6 text-center">
          Their dashboard
        </p>
        <div className="rounded-[28px] border border-stone-900/10 shadow-2xl shadow-stone-900/15 bg-white p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <span className="flex items-center gap-2.5">
              {logo ? (
                <img src={logo} alt={`${name} logo`} className="h-9 w-9 rounded-xl object-contain bg-white border border-stone-100" />
              ) : (
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: color }}>
                  <ChiliLogo size={19} />
                </span>
              )}
              <span>
                <span className="block font-bold text-[17px] leading-tight">{name}</span>
                <span className="block text-[13px] text-stone-400">Owner dashboard</span>
              </span>
            </span>
            <span className="relative">
              <Bell size={20} className="text-stone-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* review inbox */}
            <div className="md:col-span-2 rounded-2xl bg-stone-50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[16px]">Review inbox</h3>
                <span className="text-[12px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: color }}>
                  2 waiting
                </span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-stone-100 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[14px] font-semibold">Aarav M.</span>
                  <span className="flex gap-px" style={{ color }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                    ))}
                  </span>
                </div>
                <p className="text-[14px] text-stone-500 mb-2.5">{isService ? "Best massage I\u2019ve had in years. I\u2019m telling everyone!" : "The food was unreal. We\u2019ll be back next week!"}</p>
                <p className="text-[13px] font-semibold mb-1 flex items-center gap-1.5" style={{ color }}>
                  <Sparkles size={13} /> AI draft ready
                </p>
                <div className="flex gap-2">
                  <span className="flex-1 text-center text-white text-[13px] font-semibold rounded-lg py-2" style={{ background: color }}>
                    <Check size={14} className="inline mr-1" /> Approve
                  </span>
                  <span className="text-[13px] font-semibold rounded-lg py-2 px-4 bg-stone-100 text-stone-600">Edit</span>
                </div>
              </div>
              <p className="text-[13px] text-stone-400">One tap per review. Under a minute a day.</p>
            </div>

            {/* score + posts */}
            <div className="space-y-4">
              <div className="rounded-2xl p-5 text-white" style={{ background: "var(--color-espresso)" }}>
                <p className="text-[13px] text-stone-400 mb-1 flex items-center gap-1.5">
                  <Gauge size={14} /> Visibility score
                </p>
                <p className="font-display font-semibold text-[44px] leading-none">
                  87<span className="text-[20px] text-stone-500">/100</span>
                </p>
                <p className="text-[13px] text-emerald-400 font-semibold mt-1">▲ 4 this week</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-5">
                <p className="text-[13px] text-stone-400 mb-2 flex items-center gap-1.5">
                  <CalendarCheck size={14} /> Google posts
                </p>
                <p className="text-[14px] font-semibold mb-1">Weekend special — scheduled</p>
                <p className="text-[13px] text-stone-500">Goes live Friday 11am, automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THEIR APP ============ */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-stone-400 mb-6 text-center">
          Their app
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <div className="w-[270px] rounded-[44px] border-[10px] border-stone-800 bg-white shadow-2xl overflow-hidden shrink-0">
            <div className="px-4 pt-4 pb-3" style={{ background: "var(--color-cream)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5">
                  {logo ? (
                    <img src={logo} alt={`${name} logo`} className="h-6 w-6 rounded-lg object-contain bg-white border border-stone-100" />
                  ) : (
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white" style={{ background: color }}>
                      <ChiliLogo size={13} />
                    </span>
                  )}
                  <span className="text-[13px] font-bold">{name.length > 18 ? name.slice(0, 18) + "…" : name}</span>
                </span>
                <Bell size={15} className="text-stone-400" />
              </div>
              <div className="flex gap-1 bg-stone-200/70 rounded-full p-1">
                {(isService ? ["Inbox", "Bookings", "Services"] : ["Inbox", "Orders", "Menu"]).map((t, i) => (
                  <span key={t} className={`flex-1 text-center text-[11px] font-semibold rounded-full py-1.5 ${i === 0 ? "bg-white shadow-sm" : "text-stone-500"}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 space-y-3 min-h-[300px]">
              <div className="rounded-2xl border border-stone-100 p-3.5 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-semibold">{isService ? "New booking" : "New order #1042"}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: color }}>NEW</span>
                </div>
                <p className="text-[12px] text-stone-500 mb-2.5">2× {items[0].name} · {items[0].price}</p>
                <span className="block text-center text-white text-[12px] font-semibold rounded-xl py-2 bg-stone-900">Accept</span>
              </div>
              <div className="rounded-2xl border border-stone-100 p-3.5 shadow-sm">
                <p className="text-[13px] font-semibold mb-1">Review reply drafted</p>
                <p className="text-[12px] text-stone-500 mb-2.5">Tap to approve — 10 seconds.</p>
                <span className="block text-center text-white text-[12px] font-semibold rounded-xl py-2" style={{ background: color }}>Review</span>
              </div>
            </div>
          </div>
          <div className="max-w-sm text-center md:text-left">
            <h2 className="font-display font-semibold tracking-[-0.02em] text-[30px] md:text-[38px] leading-[1.05] mb-4">
              This could be <em className="italic font-medium" style={{ color }}>{name}</em> by Friday.
            </h2>
            <p className="text-stone-500 text-[16px] leading-relaxed mb-7">
              Website, {isService ? "booking" : "ordering"}, review inbox, and the owner app — built and
              branded for you. {isService ? "You just do the work." : "You just run the kitchen."}
            </p>
            <Link href="/login" className="inline-flex items-center justify-center min-h-[52px] px-8 text-[16px] font-semibold rounded-2xl text-white shadow-xl" style={{ background: color }}>
              Make it mine <ArrowRight size={17} className="ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-stone-900/10">
        <div className="max-w-6xl mx-auto px-5 py-8 flex items-center justify-center gap-2.5">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: "var(--color-chili)" }}>
            <ChiliLogo size={15} />
          </span>
          <span className="text-[14px] text-stone-400">Preview built by <span className="font-semibold text-stone-600">LocalBoost</span></span>
        </div>
      </footer>
    </div>
  );
}
