"use client";

import { useEffect, useRef } from "react";

const reviews = [
  {
    initial: "L",
    name: "Luke Durbin",
    role: "CEO, Hades Agency",
    quote: "Within the first 8 weeks, we saw a 4x return on ad spend - something we hadn't come close to with our previous agency. The level of attention and strategic thinking they bring is in a different league.",
    badge: "Verified Client",
  },
  {
    initial: "N",
    name: "Naomi Catterton",
    role: "Co-Founder, Makoto Insurance",
    quote: "They are proactive, responsive, and genuinely diligent. If you need help scaling your paid social, I can't recommend Root Social highly enough. They actually do what they say they will.",
    badge: "Current Client",
  },
  {
    initial: "A",
    name: "Amna Khan",
    role: "Founder, Phantom Jewels",
    quote: "Easy going and to the point - none of the middlemen nonsense you get at other agencies. Refreshing to work with. They've worked hard to get close to the results we want and keep improving.",
    badge: "Google Verified",
  },
];

export default function MoreReviews() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".review-card").forEach((card, i) => {
            setTimeout(() => {
              (card as HTMLElement).style.opacity = "1";
              (card as HTMLElement).style.transform = "translateY(0)";
            }, i * 100);
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
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{
              background: "rgba(45,139,60,0.1)",
              color: "#236B2F",
              border: "1px solid rgba(45,139,60,0.2)",
            }}
          >
            More Client Stories
          </span>
          <h2
            className="font-black leading-tight"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.3rem)", color: "#1A1A1A" }}
          >
            Don&apos;t just take our word for it
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="review-card rounded-2xl p-6 flex flex-col gap-4"
              style={{
                background: "white",
                border: "1px solid rgba(45,139,60,0.12)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                opacity: 0,
                transform: "translateY(16px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, si) => (
                  <svg key={si} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p
                className="leading-relaxed flex-1"
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(26,26,26,0.75)",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{r.quote}&rdquo;
              </p>

              {/* Author */}
              <div
                className="flex items-center gap-3 pt-3"
                style={{ borderTop: "1px solid rgba(26,26,26,0.06)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                  style={{ background: "linear-gradient(135deg, #2D8B3C, #1a6b28)", color: "white" }}
                >
                  {r.initial}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-black text-sm" style={{ color: "#1A1A1A" }}>{r.name}</p>
                    <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0" style={{ background: "#2D8B3C" }}>
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-semibold truncate" style={{ color: "#2D8B3C" }}>{r.role}</p>
                </div>
                <span
                  className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                  style={{
                    background: "rgba(45,139,60,0.1)",
                    color: "#236B2F",
                    border: "1px solid rgba(45,139,60,0.2)",
                  }}
                >
                  {r.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
