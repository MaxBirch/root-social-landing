"use client";

import { useState, useEffect, useCallback } from "react";
import { trackPixelEvent } from "./MetaPixel";

export default function ExitIntent() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Desktop only (pointer: fine = mouse)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const shown = sessionStorage.getItem("exit-intent-shown");
    if (shown) return;

    let triggered = false;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 20 && !triggered) {
        triggered = true;
        sessionStorage.setItem("exit-intent-shown", "true");
        setTimeout(() => setVisible(true), 120);
      }
    };

    // Wait 5s before activating so it doesn't fire on page load navigation
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");

    // Generate event ID for deduplication
    const eventId = crypto.randomUUID();

    try {
      const response = await fetch("/api/exit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
      });
      
      const result = await response.json();
      
      // Fire pixel event with event ID for deduplication with CAPI
      trackPixelEvent("Lead", {
        content_name: "Exit Intent Email",
        content_category: "Exit Intent",
        eventID: result.eventId || eventId,
      });
      
    } catch (err) {
      console.error("Exit lead submit error:", err);
      // Still fire pixel event even if API fails
      trackPixelEvent("Lead", {
        content_name: "Exit Intent Email",
        content_category: "Exit Intent",
        eventID: eventId,
      });
    }

    setSubmitted(true);
  };

  const handleClose = useCallback(() => setVisible(false), []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      style={{ animation: "fadeIn 0.2s ease-out forwards" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative max-w-md w-full mx-4 rounded-2xl p-8 shadow-2xl"
        style={{
          background: "#161616",
          border: "1px solid rgba(45,139,60,0.25)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(45,139,60,0.1)",
          animation: "stepFadeIn 0.3s ease-out forwards",
        }}
      >
        {/* Green top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #2D8B3C, transparent)",
            borderRadius: "9999px",
          }}
        />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 transition-colors"
          style={{ color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          aria-label="Close"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {!submitted ? (
          <>
            <div className="mb-6">
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
                style={{
                  background: "rgba(45,139,60,0.15)",
                  color: "#4EB85E",
                  border: "1px solid rgba(45,139,60,0.25)",
                }}
              >
                Wait - before you go
              </span>
              <h3 className="text-white font-black text-2xl leading-tight mb-3">
                Before you go - we&apos;ll show you exactly where your budget is leaking
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Drop your email and get a free personalised breakdown - no call, no pitch, no strings.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="form-input w-full rounded-xl px-4 py-3.5 text-white placeholder-white/25"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2D8B3C";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,139,60,0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                className="btn-green w-full rounded-xl font-bold text-base py-3.5 min-h-[52px]"
              >
                Show Me Where I&apos;m Losing Money →
              </button>
            </form>

            <p className="text-center mt-3" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem" }}>
              No spam. One email. Actionable insights only.
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(45,139,60,0.15)", border: "1px solid rgba(45,139,60,0.25)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#2D8B3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-white font-black text-xl mb-2">You&apos;re on the list!</h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              We&apos;ll review your account and send your breakdown shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
