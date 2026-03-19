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

  // Fade-in animation on mount
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.style.opacity = "1";
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-24 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0A0A0A 0%, #111111 40%, #0D1A0F 100%)",
      }}
    >
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute"
          style={{
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(45,139,60,0.12) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "0",
            left: "10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(45,139,60,0.06) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "20%",
            right: "5%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(45,139,60,0.05) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
        {/* Logo */}
        <div className="flex items-center justify-center mb-12 animate-fade-in">
          <div className="flex items-center gap-3">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Root Social">
              <circle cx="22" cy="22" r="22" fill="#2D8B3C" />
              <rect x="20" y="27" width="4" height="9" rx="1.5" fill="white" />
              <path d="M22 7 L33 24 H11 Z" fill="white" />
              <path d="M22 14 L30 28 H14 Z" fill="#2D8B3C" />
            </svg>
            <span className="text-white text-xl font-black tracking-widest uppercase" style={{ letterSpacing: "0.12em" }}>Root Social</span>
          </div>
        </div>

        {/* Eyebrow tag */}
        <div className="flex justify-center mb-6 animate-fade-in stagger-1" style={{ opacity: 0 }}>
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
            style={{
              background: "rgba(45,139,60,0.15)",
              border: "1px solid rgba(45,139,60,0.35)",
              color: "#4EB85E",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Free Audit — Limited Spots
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-white font-black leading-[1.04] tracking-tight mb-5 animate-fade-in stagger-2"
          style={{
            fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
            opacity: 0,
          }}
        >
          We don&apos;t run ads.
          <br />
          <span style={{ color: "#2D8B3C" }}>We build revenue engines.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="font-bold mb-6 animate-fade-in stagger-3"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: "rgba(255,255,255,0.55)",
            opacity: 0,
          }}
        >
          Paid social that actually scales.
        </p>

        {/* Body copy */}
        <p
          className="max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in stagger-4"
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
            color: "rgba(255,255,255,0.45)",
            opacity: 0,
          }}
        >
          We review your ad account, identify exactly where your budget is leaking, and show you what we&apos;d change in the first 30 days.{" "}
          <strong className="text-white/70">Completely free.</strong>
        </p>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-4 animate-fade-in stagger-5" style={{ opacity: 0 }}>
          <button
            onClick={scrollToForm}
            className="btn-green inline-flex items-center gap-3 rounded-full min-h-[60px] px-10 py-4 text-lg"
            style={{ fontSize: "1.1rem" }}
          >
            Get Your Free Audit
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.82rem" }}>
            No commitment. No contracts. Just clarity.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ opacity: 0.25 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
