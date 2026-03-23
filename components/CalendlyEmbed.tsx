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
    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.event === "calendly.event_scheduled") {
        const eventId = crypto.randomUUID();

        // Track pixel event
        trackPixelEvent("Schedule", {
          content_name: "Audit Call Booked",
          content_category: "Lead",
          eventID: eventId,
        });

        // Send CAPI event (most valuable conversion)
        try {
          await fetch("/api/meta-capi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventName: "Schedule",
              eventTime: Math.floor(new Date().getTime() / 1000),
              eventId,
              userData: {
                email,
                firstName,
              },
              customData: {
                content_name: "Audit Call Booked",
                content_category: "Lead",
                value: 500,
                currency: "GBP",
              },
            }),
          });
        } catch (capiError) {
          console.error("CAPI error for Schedule event:", capiError);
        }

        // Send confirmation email + lead notification via submit-lead API
        try {
          await fetch("/api/submit-lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName,
              email,
              qualified: true,
              calendlyBooked: true,
              source: "calendly-booking",
              timestamp: new Date().toISOString(),
              eventId,
            }),
          });
        } catch (submitError) {
          console.error("Submit lead (calendly) error:", submitError);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.head.removeChild(script);
    };
  }, [firstName, email]);

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
          Pick a time that works for your FREE 30-minute audit call.
        </p>
      </div>

      {/* 3-day minimum notice */}
      <div
        className="flex items-start gap-2.5 p-3.5 rounded-xl mb-4"
        style={{
          background: "rgba(45,139,60,0.08)",
          border: "1px solid rgba(45,139,60,0.2)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4EB85E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
          <strong className="text-white">Please select a date at least 3 working days from today.</strong> This gives us time to thoroughly review your ad account before we speak.
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
          We&apos;ll review your ad account <strong className="text-white">before</strong> we speak and come prepared with specific recommendations.
        </p>
      </div>
    </div>
  );
}
