"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    initial: "L",
    name: "Luke Durbin",
    role: "CEO, Hades Agency",
    quote:
      "Root Social completely transformed our paid social. Within the first 8 weeks, we saw a 4x return on ad spend — something we hadn't come close to with our previous agency. The level of attention, creativity, and strategic thinking they bring is in a different league. I won't be going anywhere.",
    highlight: "4x return on ad spend",
    badge: "Verified Client",
  },
  {
    initial: "N",
    name: "Naomi Catterton",
    role: "Co-Founder, Makoto Insurance",
    quote:
      "Currently a client and loving it. They are proactive, responsive, and genuinely diligent. If you need help scaling your paid social, I can't recommend Root Social highly enough. They actually do what they say they will.",
    highlight: "proactive, responsive, and genuinely diligent",
    badge: "Current Client",
  },
  {
    initial: "A",
    name: "Amna Khan",
    role: "Founder, Phantom Jewels",
    quote:
      "Root Social is efficient and hardworking. They've worked hard to get close to the results we want and keep improving. Easy going and to the point — none of the middlemen nonsense you get at other agencies. Refreshing to work with.",
    highlight: "none of the middlemen nonsense",
    badge: "Google Verified",
  },
];

export default function Testimonial() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const wrap = el.querySelector(".testimonial-wrap");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          wrap?.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "100px" }
    );
    observer.observe(el);
    // Fallback: reveal after short delay in case observer misses
    const fallback = setTimeout(() => wrap?.classList.add("revealed"), 1200);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, []);

  const t = testimonials[active];

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="max-w-2xl mx-auto testimonial-wrap reveal">
        {/* Heading */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{
              background: "rgba(45,139,60,0.1)",
              color: "#236B2F",
              border: "1px solid rgba(45,139,60,0.2)",
            }}
          >
            Client Stories
          </span>
          <h2
            className="font-black leading-tight"
            style={{ fontSize: "clamp(1.7rem, 4vw, 2.5rem)", color: "#1A1A1A" }}
          >
            Don&apos;t take our word for it
          </h2>
          <p style={{ color: "rgba(26,26,26,0.5)", fontSize: "0.95rem", marginTop: "8px" }}>
            Real clients. Real results. No fabricated case studies.
          </p>
        </div>

        {/* Testimonial card */}
        <div
          key={active}
          className="gradient-border-card p-7 md:p-9"
          style={{
            background: "#111111",
            animation: "stepFadeIn 0.35s ease-out forwards",
          }}
        >
          {/* Stars */}
          <div className="flex gap-0.5 mb-5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>

          {/* Big quote */}
          <div
            className="font-black mb-3 leading-none select-none"
            style={{ fontSize: "4rem", lineHeight: 0.8, color: "#2D8B3C", opacity: 0.35 }}
          >
            &ldquo;
          </div>

          {/* Quote */}
          <p
            className="leading-relaxed mb-8"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.12rem)",
              color: "rgba(255,255,255,0.82)",
              fontStyle: "italic",
            }}
          >
            {t.quote.split(t.highlight).map((part, i) =>
              i === 0 ? (
                part
              ) : (
                <>
                  <strong className="not-italic" style={{ color: "#4EB85E", fontWeight: 800 }}>
                    {t.highlight}
                  </strong>
                  {part}
                </>
              )
            )}
          </p>

          {/* Divider */}
          <div
            className="mb-6"
            style={{ height: "1px", background: "linear-gradient(90deg, rgba(45,139,60,0.4), rgba(255,255,255,0.04))" }}
          />

          {/* Author */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg shrink-0"
                style={{ background: "linear-gradient(135deg, #2D8B3C, #1a6b28)", color: "white" }}
              >
                {t.initial}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white" style={{ fontSize: "1.02rem" }}>{t.name}</h3>
                  <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#2D8B3C" }}>
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-semibold" style={{ color: "#2D8B3C" }}>{t.role}</p>
              </div>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full self-start sm:self-auto"
              style={{
                background: "rgba(45,139,60,0.15)",
                color: "#4EB85E",
                border: "1px solid rgba(45,139,60,0.25)",
              }}
            >
              {t.badge}
            </span>
          </div>
        </div>

        {/* Testimonial switcher dots */}
        <div className="flex justify-center gap-2.5 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="transition-all duration-300"
              style={{
                width: active === i ? "28px" : "8px",
                height: "8px",
                borderRadius: "9999px",
                background: active === i ? "#2D8B3C" : "rgba(26,26,26,0.2)",
                border: "none",
                cursor: "pointer",
              }}
              aria-label={`View testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Client logos row */}
        <div className="mt-10 text-center">
          <p
            style={{
              color: "rgba(26,26,26,0.35)",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "12px",
            }}
          >
            Trusted by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {["Hades Agency", "Phantom Jewels", "Chelsea FC & CIFA", "Wycombe Wanderers", "Body Boom", "Pumpables"].map(
              (brand) => (
                <span
                  key={brand}
                  style={{
                    color: "rgba(26,26,26,0.35)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  {brand}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
