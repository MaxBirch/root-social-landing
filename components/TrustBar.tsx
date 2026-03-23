"use client";

import { useEffect, useRef } from "react";

const stats = [
  {
    value: "£20M+",
    label: "Ad Revenue Generated",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    value: "50+",
    label: "Brands Scaled",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    value: "5.0★",
    label: "Google Rating",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    value: "30 Day",
    label: "Average Time to Results",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
];

export default function TrustBar() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".trust-stat").forEach((pill, i) => {
            setTimeout(() => {
              (pill as HTMLElement).style.opacity = "1";
              (pill as HTMLElement).style.transform = "translateY(0)";
            }, i * 80);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-8 px-4"
      style={{
        background: "#0A0A0A",
        borderTop: "1px solid rgba(45,139,60,0.15)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="trust-stat flex flex-col items-center gap-1.5 px-4 py-4 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                opacity: 0,
                transform: "translateY(8px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <div style={{ color: "#2D8B3C" }}>{stat.icon}</div>
              <div className="font-black text-white" style={{ fontSize: "1.4rem", lineHeight: 1.1 }}>
                {stat.value}
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: 600, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
