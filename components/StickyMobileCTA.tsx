"use client";

import { useEffect, useRef, useState } from "react";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<Element | null>(null);

  useEffect(() => {
    // Target the first <section> in <main> — that's the Hero
    heroRef.current = document.querySelector("main > section:first-child");
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show the bar once the hero is no longer intersecting (scrolled past)
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    const el = document.getElementById("audit-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        background: "rgba(10,10,10,0.95)",
        borderTop: "1px solid rgba(45,139,60,0.3)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      aria-hidden={!visible}
    >
      <div className="px-4 py-3">
        <button
          onClick={handleClick}
          className="btn-green w-full rounded-xl py-4 text-base font-bold"
          style={{ fontSize: "1rem", minHeight: "52px" }}
          tabIndex={visible ? 0 : -1}
        >
          Get Your Free Audit →
        </button>
      </div>
    </div>
  );
}
