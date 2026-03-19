"use client";

import { useEffect, useRef } from "react";

const stats = [
  { icon: "💰", text: "£20M+ Spent On Ads" },
  { icon: "📈", text: "4x ROI in 8 Weeks" },
  { icon: "🤝", text: "No Contracts, Ever" },
];

export default function TrustBar() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".trust-pill").forEach((pill, i) => {
            setTimeout(() => {
              (pill as HTMLElement).style.opacity = "1";
              (pill as HTMLElement).style.transform = "translateY(0)";
            }, i * 100);
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
      className="py-10 md:py-12 px-4"
      style={{
        background: "linear-gradient(180deg, #0F0F0F 0%, #141414 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          {stats.map((stat) => (
            <div
              key={stat.text}
              className="trust-pill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#0A0A0A",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                fontWeight: 700,
                fontSize: "0.875rem",
                padding: "10px 20px",
                borderRadius: "9999px",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset",
                opacity: 0,
                transform: "translateY(8px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                cursor: "default",
              }}
            >
              <span style={{ fontSize: "1rem" }}>{stat.icon}</span>
              <span style={{ color: "rgba(255,255,255,0.9)" }}>{stat.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
