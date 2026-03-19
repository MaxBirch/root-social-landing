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
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-24 overflow-hidden"
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
        <div
          className="absolute"
          style={{
            top: "30%",
            right: "0%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(45,139,60,0.04) 0%, transparent 65%)",
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
        {/* Logo */}
        <div className="flex items-center justify-center mb-10 animate-fade-in">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Root Social" width={40} height={40} className="rounded-lg" />
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
            Free Audit — Only 3 Spots Left This Month
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-white font-black leading-[1.04] tracking-tight mb-5 animate-fade-in stagger-2"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
            opacity: 0,
          }}
        >
          Your ads are leaking money.
          <br />
          <span style={{ color: "#2D8B3C" }}>We&apos;ll find the holes. Free.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="mb-3 animate-fade-in stagger-3"
          style={{
            fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)",
            color: "rgba(255,255,255,0.65)",
            fontWeight: 600,
            opacity: 0,
          }}
        >
          We dig into your full ad account and show you exactly what&apos;s draining your budget — no cost, no commitment, no pitch.
        </p>

        {/* Social proof micro-row */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-fade-in stagger-4"
          style={{ opacity: 0 }}
        >
          {/* Star rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", fontWeight: 600 }}>5.0 Google Rating</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>|</span>
          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", fontWeight: 600 }}>50+ Brands Scaled</span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>|</span>
          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", fontWeight: 600 }}>£20M+ Revenue Generated</span>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-3 animate-fade-in stagger-5" style={{ opacity: 0 }}>
          <button
            onClick={scrollToForm}
            className="btn-green inline-flex items-center gap-3 rounded-full min-h-[64px] px-12 py-4"
            style={{ fontSize: "1.1rem", fontWeight: 800 }}
          >
            Reveal My Ad Leaks — Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Urgency + micro-copy */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#ef4444" }}
              />
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", fontWeight: 600 }}>
                Only 3 free audit spots left this month
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem" }}>
              2 minutes · No commitment · No sales call
            </p>
          </div>
        </div>

        {/* Platform logos */}
        <div
          className="mt-14 animate-fade-in stagger-5"
          style={{ opacity: 0 }}
        >
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
            We manage campaigns across
          </p>
          <div className="flex items-center justify-center gap-6">
            {/* Meta */}
            <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 13.5v-3.25L8.5 14 7 12.5l3.5-2v-1L7 7.5 8.5 6l2.5 1.75V4.5h2v3.25L15.5 6 17 7.5l-3.5 2v1l3.5 2L15.5 14l-2.5-1.75V15.5h-2z"/>
              </svg>
              <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Meta Ads</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
            {/* Google */}
            <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/>
              </svg>
              <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Google Ads</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
            {/* TikTok */}
            <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
              </svg>
              <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>TikTok Ads</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ opacity: 0.2 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
