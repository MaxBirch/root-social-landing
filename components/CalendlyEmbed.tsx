"use client";

import { useEffect } from "react";
import { trackPixelEvent } from "./MetaPixel";

interface CalendlyEmbedProps {
  firstName: string;
  email: string;
}

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/rootsocial/audit";

export default function CalendlyEmbed({ firstName, email }: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    // Listen for Calendly booking events
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.event === "calendly.event_scheduled") {
        trackPixelEvent("Schedule", {
          content_name: "Audit Call Booked",
          content_category: "Lead",
        });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.head.removeChild(script);
    };
  }, []);

  const calendlyUrl = `${CALENDLY_URL}?name=${encodeURIComponent(firstName)}&email=${encodeURIComponent(email)}`;

  return (
    <div className="py-4">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-root-green/20 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#2D8B3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-white font-black text-2xl md:text-3xl mb-2">
          You&apos;re a great fit, {firstName}!
        </h3>
        <p className="text-white/60 text-base">
          Pick a time that works for your free 30-minute audit call.
        </p>
      </div>

      {/* Calendly inline embed */}
      <div
        className="calendly-inline-widget w-full rounded-2xl overflow-hidden"
        data-url={calendlyUrl}
        style={{ minWidth: "320px", height: "700px" }}
      />

      {/* Below calendly copy */}
      <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-white/70 text-sm text-center leading-relaxed">
          We&apos;ll review your ad account <strong className="text-white">before</strong> we speak and show you exactly where your budget is leaking and what we&apos;d change in the first 30 days.
        </p>
      </div>
    </div>
  );
}
