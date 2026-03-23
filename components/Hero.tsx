"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToForm = () => {
    const el = document.getElementById("audit-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.style.opacity = "1";
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center px-4 pt-12 pb-10 md:pt-20 md:pb-16 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #080808 0%, #0F0F0F 40%, #0A160B 100%)",
      }}
    >
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute"
          style={{
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(45,139,60,0.10) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "10%",
            left: "5%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(45,139,60,0.05) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
        {/* Logo only - no text */}
        <div className="flex items-center justify-center mb-10 animate-fade-in">
          <img src="/logo.png" alt="Root Social" width={64} height={64} className="rounded-xl" />
        </div>

        {/* Scarcity badge */}
        <div className="flex justify-center mb-7 animate-fade-in stagger-1" style={{ opacity: 0 }}>
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
            style={{
              background: "rgba(45,139,60,0.15)",
              border: "1px solid rgba(45,139,60,0.35)",
              color: "#4EB85E",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Free Audit - Only 3 Spots Left This Month
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-white font-black leading-[1.04] tracking-tight mb-3 animate-fade-in stagger-2"
          style={{
            fontSize: "clamp(2.6rem, 7vw, 5.2rem)",
            opacity: 0,
          }}
        >
          We Don&apos;t Run Ads.
        </h1>

        {/* Subheadline */}
        <h2
          className="font-black leading-[1.1] tracking-tight mb-7 animate-fade-in stagger-3"
          style={{
            fontSize: "clamp(1.8rem, 4.5vw, 3.4rem)",
            color: "#2D8B3C",
            opacity: 0,
          }}
        >
          We Build Revenue Engines.
        </h2>

        {/* Body copy */}
        <p
          className="mb-10 max-w-xl mx-auto animate-fade-in stagger-4"
          style={{
            fontSize: "clamp(1.05rem, 2.2vw, 1.2rem)",
            color: "rgba(255,255,255,0.65)",
            fontWeight: 500,
            lineHeight: 1.6,
            opacity: 0,
          }}
        >
          Most agencies optimise campaigns. We build revenue engines to fuel your growth. We&apos;ll show you exactly how we&apos;d scale your business for free. No commitment.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-3 animate-fade-in stagger-5" style={{ opacity: 0 }}>
          <button
            onClick={scrollToForm}
            className="btn-green inline-flex items-center gap-3 rounded-full min-h-[64px] px-12 py-4"
            style={{ fontSize: "1.1rem", fontWeight: 800 }}
          >
            Claim Your Free Audit
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>
            No commitment · No sales call
          </p>
        </div>
      </div>
    </section>
  );
}
