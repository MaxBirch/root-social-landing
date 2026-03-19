"use client";

import { useEffect, useRef } from "react";

const rows = [
  {
    rootSocial: "Capped clients per media buyer — full focus on you",
    others: "Overworked media buyers",
  },
  {
    rootSocial: "Unlimited creatives, no cap, no extras",
    others: "Set number of creatives",
  },
  {
    rootSocial: "Rolling monthly contracts — stay because it works",
    others: "Locked into contracts",
  },
  {
    rootSocial: "Focused on growing profit",
    others: "Focused on vanity metrics",
  },
  {
    rootSocial: "£20M+ in ad spend managed",
    others: "No proven track record",
  },
];

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelector(".comparison-inner")?.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-4" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-4xl mx-auto comparison-inner reveal">
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2
            className="font-black leading-tight tracking-tight"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              color: "#1A1A1A",
            }}
          >
            Root Social vs The Rest
          </h2>
          <p className="mt-3" style={{ color: "rgba(26,26,26,0.5)", fontSize: "1.05rem" }}>
            See exactly what sets us apart
          </p>
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-2.5">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              {/* Root Social cell */}
              <div
                className="flex items-start gap-2.5 p-3.5 rounded-xl"
                style={{
                  background: "white",
                  border: "1px solid rgba(45,139,60,0.15)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <span
                  className="shrink-0 mt-0.5 font-black text-base leading-none"
                  style={{ color: "#2D8B3C" }}
                >
                  ✓
                </span>
                <p className="text-sm leading-snug" style={{ color: "#1A1A1A", fontWeight: 500 }}>
                  {row.rootSocial}
                </p>
              </div>
              {/* Others cell */}
              <div
                className="flex items-start gap-2.5 p-3.5 rounded-xl"
                style={{
                  background: "rgba(26,26,26,0.06)",
                  border: "1px solid rgba(26,26,26,0.08)",
                }}
              >
                <span
                  className="shrink-0 mt-0.5 font-black text-base leading-none"
                  style={{ color: "rgba(26,26,26,0.25)" }}
                >
                  ✕
                </span>
                <p className="text-sm leading-snug" style={{ color: "rgba(26,26,26,0.5)" }}>
                  {row.others}
                </p>
              </div>
            </div>
          ))}

          {/* Column headers for mobile */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <p className="text-center font-bold text-sm" style={{ color: "#2D8B3C" }}>Root Social ✅</p>
            <p className="text-center font-bold text-sm" style={{ color: "rgba(26,26,26,0.45)" }}>Others ✕</p>
          </div>
        </div>

        {/* Desktop: table */}
        <div
          className="hidden md:block rounded-2xl overflow-hidden"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.8) inset",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {/* Header row */}
          <div className="grid grid-cols-2">
            <div
              className="px-8 py-6"
              style={{ background: "white", borderBottom: "2px solid rgba(45,139,60,0.2)" }}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ background: "#2D8B3C" }} />
                <p className="font-black text-xl" style={{ color: "#1A1A1A" }}>Root Social</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: "#2D8B3C" }}>What you get with us</p>
            </div>
            <div
              className="px-8 py-6"
              style={{
                background: "#1A1A1A",
                borderBottom: "2px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                <p className="font-black text-xl text-white">Other Agencies</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
                What you typically get
              </p>
            </div>
          </div>

          {/* Data rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-2 comparison-row group"
            >
              <div
                className="comparison-cell-left px-8 py-5 flex items-center gap-4"
                style={{
                  background: i % 2 === 0 ? "white" : "#FAFAFA",
                  borderBottom: i < rows.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  transition: "background 0.2s ease",
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(45,139,60,0.12)" }}
                >
                  <span className="font-black text-sm" style={{ color: "#2D8B3C" }}>✓</span>
                </div>
                <p className="font-medium leading-snug" style={{ color: "#1A1A1A" }}>
                  {row.rootSocial}
                </p>
              </div>
              <div
                className="px-8 py-5 flex items-center gap-4"
                style={{
                  background: i % 2 === 0 ? "#171717" : "#141414",
                  borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  borderLeft: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <span className="font-black text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>✕</span>
                </div>
                <p className="leading-snug" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {row.others}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
