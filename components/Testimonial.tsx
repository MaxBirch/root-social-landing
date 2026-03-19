"use client";

import { useEffect, useRef } from "react";

export default function Testimonial() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelector(".testimonial-card")?.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-10">
          <h2
            className="font-black leading-tight"
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.5rem)",
              color: "#1A1A1A",
            }}
          >
            What Our Clients Say
          </h2>
        </div>

        {/* Luke Durbin testimonial card */}
        <div
          className="testimonial-card reveal gradient-border-card p-7 md:p-9"
          style={{ background: "#111111" }}
        >
          {/* Big decorative quote mark */}
          <div
            className="font-black mb-4 leading-none select-none"
            style={{
              fontSize: "5rem",
              lineHeight: 0.8,
              color: "#2D8B3C",
              opacity: 0.4,
            }}
          >
            &ldquo;
          </div>

          {/* Quote */}
          <p
            className="leading-relaxed mb-8"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "rgba(255,255,255,0.82)",
              fontStyle: "italic",
            }}
          >
            Root Social completely transformed our paid social performance. Within the first 8 weeks, we saw a{" "}
            <strong className="not-italic" style={{ color: "#4EB85E", fontWeight: 800 }}>
              4x return on ad spend
            </strong>{" "}
            — something we hadn&apos;t come close to achieving with our previous agency. The level of attention, creativity, and strategic thinking they bring is in a different league. I won&apos;t be going anywhere.
          </p>

          {/* Divider */}
          <div
            className="mb-6"
            style={{
              height: "1px",
              background: "linear-gradient(90deg, rgba(45,139,60,0.4), rgba(255,255,255,0.05))",
            }}
          />

          {/* Author row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Name + role */}
            <div className="flex items-center gap-3">
              {/* Avatar circle */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg shrink-0"
                style={{
                  background: "linear-gradient(135deg, #2D8B3C, #1a6b28)",
                  color: "white",
                }}
              >
                L
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white" style={{ fontSize: "1.05rem" }}>
                    Luke Durbin
                  </h3>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#2D8B3C" }}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-semibold" style={{ color: "#2D8B3C" }}>
                  CEO of Hades Agency
                </p>
              </div>
            </div>

            {/* Stars + badge */}
            <div className="flex flex-col items-start sm:items-end gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="19" height="19" viewBox="0 0 24 24" fill="#F59E0B">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(45,139,60,0.18)",
                  color: "#4EB85E",
                  border: "1px solid rgba(45,139,60,0.25)",
                }}
              >
                Verified Client
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
