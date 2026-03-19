"use client";

import { useEffect, useRef } from "react";

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelector(".video-inner")?.classList.add("revealed");
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
      className="py-14 md:py-20 px-4"
      style={{
        background: "linear-gradient(180deg, #111111 0%, #0D0D0D 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto video-inner reveal">
        {/* Section label */}
        <p
          className="text-center font-bold uppercase tracking-widest text-xs mb-6"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Meet the team
        </p>

        {/* Video container */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            background: "#0A0A0A",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Green top accent */}
          <div
            style={{
              height: "2px",
              background: "linear-gradient(90deg, transparent, #2D8B3C, transparent)",
            }}
          />

          {/* 16:9 video placeholder */}
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
                  boxShadow: "0 0 30px rgba(45,139,60,0.15)",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M5 3l14 9-14 9V3z" fill="#2D8B3C" />
                </svg>
              </div>
              <p className="font-semibold" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
                Video coming soon
              </p>
              <p className="mt-1" style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>
                Max introduces Root Social and the audit process
              </p>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p
          className="text-center mt-4 font-medium"
          style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}
        >
          Max Birch, Founder · 75 seconds
        </p>
      </div>
    </section>
  );
}
