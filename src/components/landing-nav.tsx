"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#faf8f5]/85 backdrop-blur-xl border-b border-stone-900/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-v2.webp"
            alt="LocalBoost"
            width={160}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-stone-500">
          <a href="#features" className="hover:text-stone-900 transition-colors">
            Features
          </a>
          <a href="#how" className="hover:text-stone-900 transition-colors">
            How it works
          </a>
          <a href="#pricing" className="hover:text-stone-900 transition-colors">
            Pricing
          </a>
        </nav>
        <Link href="/login" className="btn-primary !min-h-[44px] !text-[15px] !px-5">
          Start free <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </header>
  );
}
