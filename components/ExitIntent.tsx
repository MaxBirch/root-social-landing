"use client";

import { useState, useEffect, useCallback } from "react";

export default function ExitIntent() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only on desktop (pointer available)
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip touch devices

    // Only show once per session
    const shown = sessionStorage.getItem("exit-intent-shown");
    if (shown) return;

    let triggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 20 && !triggered) {
        triggered = true;
        sessionStorage.setItem("exit-intent-shown", "true");
        setTimeout(() => setVisible(true), 100);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");

    try {
      await fetch("/api/exit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
      });
    } catch (err) {
      console.error("Exit lead submit error:", err);
    }

    setSubmitted(true);
  };

  const handleClose = useCallback(() => setVisible(false), []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-root-dark rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative border border-white/10">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {!submitted ? (
          <>
            <div className="mb-6">
              <p className="text-root-green font-semibold text-sm mb-2">Before you go...</p>
              <h3 className="text-white font-black text-2xl md:text-3xl leading-tight mb-3">
                Want us to review your ad account for free?
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Drop your email and we&apos;ll send you a personalised 5-minute video audit — no call needed.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbrand.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-root-green transition-colors"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-root-green text-white font-bold text-base py-3.5 rounded-xl hover:bg-green-700 transition-colors min-h-[52px]"
              >
                Send My Audit →
              </button>
            </form>

            <p className="text-white/30 text-xs text-center mt-3">
              No spam, ever. Just actionable insights for your ads.
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-root-green/20 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#2D8B3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-white font-black text-xl mb-2">You&apos;re on the list!</h3>
            <p className="text-white/60 text-sm">
              We&apos;ll review your account and send your personalised video audit shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
