"use client";

import { useEffect, useRef } from "react";

const caseStudies = [
  {
    client: "Baby Brand",
    industry: "E-commerce",
    timeframe: "7 days",
    stat: "35.87x ROAS",
    statDetail: "$163K revenue from $4.5K spend",
    colour: "#2D8B3C",
  },
  {
    client: "Construction Tools Brand",
    industry: "B2C / DTC",
    timeframe: "30 days",
    stat: "8x ROAS",
    statDetail: "$1.7M revenue generated",
    colour: "#2D8B3C",
  },
  {
    client: "Trading Education Co.",
    industry: "Education / Finance",
    timeframe: "2 years",
    stat: "103K leads",
    statDetail: "Avg CPL of £9.85 vs £25 target",
    colour: "#2D8B3C",
  },
];

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".case-card").forEach((card, i) => {
            setTimeout(() => {
              (card as HTMLElement).style.opacity = "1";
              (card as HTMLElement).style.transform = "translateY(0)";
            }, i * 120);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-14 md:py-20 px-4"
      style={{
        background: "linear-gradient(180deg, #0A0A0A 0%, #0F0F0F 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{
              background: "rgba(45,139,60,0.12)",
              color: "#4EB85E",
              border: "1px solid rgba(45,139,60,0.25)",
            }}
          >
            Real Results
          </span>
          <h2
            className="font-black text-white leading-tight tracking-tight"
            style={{ fontSize: "clamp(1.7rem, 4vw, 2.8rem)" }}
          >
            What we&apos;ve done for brands like yours
          </h2>
          <p className="mt-3" style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>
            Not projections. Not case study templates. Real numbers from real clients.
          </p>
        </div>

        {/* Case study cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {caseStudies.map((cs, i) => (
            <div
              key={i}
              className="case-card rounded-2xl p-6 flex flex-col gap-4"
              style={{
                background: "#161616",
                border: "1px solid rgba(45,139,60,0.18)",
                opacity: 0,
                transform: "translateY(16px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              {/* Industry badge */}
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(45,139,60,0.12)",
                    color: "#4EB85E",
                    border: "1px solid rgba(45,139,60,0.2)",
                  }}
                >
                  {cs.industry}
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
                  {cs.timeframe}
                </span>
              </div>

              {/* Big stat */}
              <div>
                <div
                  className="font-black leading-none mb-1"
                  style={{ fontSize: "2.2rem", color: cs.colour }}
                >
                  {cs.stat}
                </div>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem" }}>
                  {cs.statDetail}
                </p>
              </div>

              {/* Client */}
              <div
                className="mt-auto pt-3 flex items-center gap-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs"
                  style={{ background: "rgba(45,139,60,0.2)", color: "#4EB85E" }}
                >
                  {cs.client.charAt(0)}
                </div>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", fontWeight: 600 }}>
                  {cs.client}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Video placeholder — ready when Max records */}
        <div
          className="mt-8 relative w-full overflow-hidden"
          style={{
            background: "#111",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #2D8B3C, transparent)" }} />
          <div
            className="aspect-video flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0C0C0C 0%, #111111 100%)" }}
          >
            <div className="text-center px-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "rgba(45,139,60,0.15)",
                  border: "1px solid rgba(45,139,60,0.3)",
                  boxShadow: "0 0 30px rgba(45,139,60,0.12)",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M5 3l14 9-14 9V3z" fill="#2D8B3C" />
                </svg>
              </div>
              <p className="font-bold" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem" }}>
                Max introduces Root Social — coming soon
              </p>
              <p className="mt-1" style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.78rem" }}>
                What you&apos;ll get in your free audit · 90 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
