"use client";

import { useEffect, useRef } from "react";

const caseStudies = [
  {
    client: "Baby Brand",
    industry: "E-commerce",
    timeframe: "7 days",
    primaryStat: "$163K",
    primaryLabel: "Revenue in 7 Days",
    secondaryStat: "$4.5K spend",
    detail: "From a standing start - zero brand history on Meta",
    colour: "#2D8B3C",
  },
  {
    client: "Construction Tools Brand",
    industry: "B2C / DTC",
    timeframe: "30 days",
    primaryStat: "$1.7M",
    primaryLabel: "Revenue Generated",
    secondaryStat: "8x ROAS",
    detail: "Scaled from a stagnant account with no structure",
    colour: "#2D8B3C",
  },
  {
    client: "Trading Education Co.",
    industry: "Education / Finance",
    timeframe: "2 years",
    primaryStat: "103K",
    primaryLabel: "Qualified Leads",
    secondaryStat: "60% below target CPL",
    detail: "Avg CPL of £9.85 vs £25 target - sustained over 2 years",
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
      className="py-10 md:py-14 px-4"
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
            Revenue we&apos;ve generated for brands like yours
          </h2>
          <p className="mt-3" style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem" }}>
            No projections. No templates. Real numbers from real accounts we manage.
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
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>
                  {cs.timeframe}
                </span>
              </div>

              {/* Primary stat - revenue/growth focused */}
              <div>
                <div
                  className="font-black leading-none mb-0.5"
                  style={{ fontSize: "2.6rem", color: cs.colour }}
                >
                  {cs.primaryStat}
                </div>
                <p className="font-bold" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>
                  {cs.primaryLabel}
                </p>
                <p className="mt-1" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>
                  {cs.secondaryStat}
                </p>
              </div>

              {/* Detail */}
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", lineHeight: 1.5, fontStyle: "italic" }}>
                &ldquo;{cs.detail}&rdquo;
              </p>

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

        {/* Anonymisation note */}
        <p className="text-center mt-3 mb-2" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem" }}>
          Client names anonymised for confidentiality
        </p>

        {/* Video placeholder */}
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
              <p className="font-bold" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem" }}>
                See exactly what&apos;s in your FREE audit
              </p>
              <p className="mt-1" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem" }}>
                A 90-second walkthrough from Max, founder of Root Social
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
