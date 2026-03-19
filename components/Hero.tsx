"use client";

import Image from "next/image";

export default function Hero() {
  const scrollToForm = () => {
    const el = document.getElementById("audit-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative bg-root-dark min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-24 overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #2D8B3C 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, #2D8B3C 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-2">
            {/* Root Social Tree Logo SVG */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Root Social">
              <circle cx="20" cy="20" r="20" fill="#2D8B3C" />
              {/* Tree trunk */}
              <rect x="18" y="24" width="4" height="8" rx="1" fill="white" />
              {/* Tree body */}
              <path d="M20 6 L30 22 H10 Z" fill="white" />
              <path d="M20 12 L28 26 H12 Z" fill="#2D8B3C" />
            </svg>
            <span className="text-white text-xl font-black tracking-tight">ROOT SOCIAL</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-white font-black text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-4">
          We don&apos;t run ads.
          <br />
          We build revenue engines.
        </h1>

        {/* Subheadline */}
        <p className="text-root-green font-bold text-xl md:text-2xl lg:text-3xl mb-8 mt-4">
          Paid social that actually scales.
        </p>

        {/* Brief descriptor */}
        <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          We review your ad account, identify exactly where your budget is leaking, and show you what we&apos;d change in the first 30 days. Completely free.
        </p>

        {/* CTA */}
        <button
          onClick={scrollToForm}
          className="inline-flex items-center gap-2 bg-root-green text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl min-h-[56px]"
        >
          Get Your Free Audit →
        </button>

        {/* Social proof micro-copy */}
        <p className="text-white/40 text-sm mt-4">
          No commitment. No contracts. Just results.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
