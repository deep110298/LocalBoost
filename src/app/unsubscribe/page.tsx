import Link from "next/link";
import ChiliLogo from "@/components/chili-logo";

export const metadata = {
  title: "Unsubscribed — LocalBoost",
  description: "You've been unsubscribed from LocalBoost emails.",
};

export default function UnsubscribePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="mb-8" aria-label="LocalBoost home">
        <ChiliLogo className="h-10 w-auto" />
      </Link>
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 mb-3">
        You&apos;ve been unsubscribed
      </h1>
      <p className="text-stone-500 max-w-md mb-8">
        You won&apos;t hear from us again. If this was a mistake, just reply to
        any of our emails and we&apos;ll add you back.
      </p>
      <Link
        href="/"
        className="bg-[#d92d20] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#b42318] transition-colors"
      >
        Back to LocalBoost
      </Link>
    </main>
  );
}
