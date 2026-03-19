"use client";

import { useEffect, useRef } from "react";

const rows = [
  {
    rootSocial: "Dedicated media buyer with a capped client roster — your account gets real focus",
    others: "Overworked buyers juggling 20+ accounts at once",
  },
  {
    rootSocial: "Unlimited ad creatives included — no caps, no surprise invoices",
    others: "Creative quota hit? Pay more or go without",
  },
  {
    rootSocial: "Rolling monthly contracts — we earn your business every single month",
    others: "Locked in for 6–12 months regardless of results",
  },
  {
    rootSocial: "Live AI dashboard — see your results in real time, 24/7",
    others: "Monthly PDF reports with cherry-picked metrics",
  },
  {
    rootSocial: "£20M+ in tracked revenue generated across client accounts",
    others: "No verifiable track record — take their word for it",
  },
  {
    rootSocial: "Same-day response, proactive optimisations — you never chase us",
    others: "Slow to respond when performance dips",
  },
];

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Immediately reveal if already in viewport
    const inner = el.querySelector(".comparison-inner");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inner?.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "100px" }
    );
    observer.observe(el);
    // Fallback: reveal after short delay in case observer misses
    const fallback = setTimeout(() => inner?.classList.add("revealed"), 1200);
    return () => { observer.disconnect(); clearTimeout(fallback); };
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-4" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-4xl mx-auto comparison-inner reveal">
        {/* Section heading */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{
              background: "rgba(45,139,60,0.12)",
              color: "#236B2F",
              border: "1px solid rgba(45,139,60,0.25)",
            }}
          >
            Why Root Social
          </span>
          <h2
            className="font-black leading-tight tracking-tight"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              color: "#1A1A1A",
            }}
          >
            Why brands switch to Root Social
          </h2>
          <p className="mt-3" style={{ color: "rgba(26,26,26,0.5)", fontSize: "1rem" }}>
            Every policy we have was built around one question: <em>&ldquo;Would I want this if I were the client?&rdquo;</em>
          </p>
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-2.5">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <div
                className="flex items-start gap-2.5 p-3.5 rounded-xl"
                style={{
                  background: "white",
                  border: "1px solid rgba(45,139,60,0.15)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <span className="shrink-0 mt-0.5 font-black text-base leading-none" style={{ color: "#2D8B3C" }}>✓</span>
                <p className="text-sm leading-snug" style={{ color: "#1A1A1A", fontWeight: 500 }}>{row.rootSocial}</p>
              </div>
              <div
                className="flex items-start gap-2.5 p-3.5 rounded-xl"
                style={{
                  background: "rgba(26,26,26,0.05)",
                  border: "1px solid rgba(26,26,26,0.07)",
                }}
              >
                <span className="shrink-0 mt-0.5 font-black text-base leading-none" style={{ color: "rgba(26,26,26,0.4)" }}>✕</span>
                <p className="text-sm leading-snug" style={{ color: "rgba(26,26,26,0.6)" }}>{row.others}</p>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <p className="text-center font-bold text-sm" style={{ color: "#2D8B3C" }}>Root Social ✅</p>
            <p className="text-center font-bold text-sm" style={{ color: "rgba(26,26,26,0.4)" }}>Others ✕</p>
          </div>
        </div>

        {/* Desktop: table */}
        <div
          className="hidden md:block rounded-2xl overflow-hidden"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.8) inset",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {/* Header */}
          <div className="grid grid-cols-2">
            <div className="px-8 py-6" style={{ background: "white", borderBottom: "2px solid rgba(45,139,60,0.2)" }}>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ background: "#2D8B3C" }} />
                <p className="font-black text-xl" style={{ color: "#1A1A1A" }}>Root Social</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: "#2D8B3C" }}>What you get with us</p>
            </div>
            <div className="px-8 py-6" style={{ background: "#1A1A1A", borderBottom: "2px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.4)" }} />
                <p className="font-black text-xl text-white">Other Agencies</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>What you typically get</p>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-2 comparison-row group">
              <div
                className="comparison-cell-left px-8 py-5 flex items-center gap-4"
                style={{
                  background: i % 2 === 0 ? "white" : "#FAFAFA",
                  borderBottom: i < rows.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                  transition: "background 0.2s ease",
                }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(45,139,60,0.1)" }}>
                  <span className="font-black text-sm" style={{ color: "#2D8B3C" }}>✓</span>
                </div>
                <p className="font-medium leading-snug" style={{ color: "#1A1A1A" }}>{row.rootSocial}</p>
              </div>
              <div
                className="px-8 py-5 flex items-center gap-4"
                style={{
                  background: i % 2 === 0 ? "#171717" : "#141414",
                  borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  borderLeft: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <span className="font-black text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>✕</span>
                </div>
                <p className="leading-snug" style={{ color: "rgba(255,255,255,0.6)" }}>{row.others}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA nudge */}
        <div className="text-center mt-10">
          <p style={{ color: "rgba(26,26,26,0.5)", fontSize: "0.9rem", marginBottom: "16px" }}>
            Experience the difference first-hand — your audit is 100% free
          </p>
          <button
            onClick={() => {
              const el = document.getElementById("audit-form");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="btn-green inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold"
          >
            Claim My Free Audit →
          </button>
        </div>
      </div>
    </section>
  );
}
