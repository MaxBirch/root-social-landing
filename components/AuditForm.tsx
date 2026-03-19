"use client";

import { useState, useRef, useEffect } from "react";
import CalendlyEmbed from "./CalendlyEmbed";
import { trackPixelEvent } from "./MetaPixel";

interface FormData {
  firstName: string;
  email: string;
  website: string;
  adSpend: string;
  challenge: string;
  challengeOther: string;
}

const AD_SPEND_OPTIONS = [
  { value: "less-than-1k", label: "Less than £1,000/month" },
  { value: "1k-3k", label: "£1,000 – £3,000/month" },
  { value: "3k-10k", label: "£3,000 – £10,000/month" },
  { value: "10k-plus", label: "£10,000+/month" },
  { value: "not-running", label: "Not currently running ads" },
];

const CHALLENGE_OPTIONS = [
  { value: "roas", label: "ROAS isn't where it needs to be" },
  { value: "scaling", label: "Scaling spend without killing performance" },
  { value: "not-enough-creative", label: "Not enough creative being produced" },
  { value: "poor-comms", label: "Poor communication from current agency" },
  { value: "getting-started", label: "Just getting started with paid social" },
  { value: "other", label: "Other" },
];

const DISQUALIFYING_SPENDS = ["less-than-1k", "not-running"];

export default function AuditForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    email: "",
    website: "",
    adSpend: "",
    challenge: "",
    challengeOther: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [qualified, setQualified] = useState(false);
  const [viewContentTracked, setViewContentTracked] = useState(false);
  const [initiateCheckoutTracked, setInitiateCheckoutTracked] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track ViewContent when form section scrolls into view
  useEffect(() => {
    if (viewContentTracked) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewContentTracked) {
          trackPixelEvent("ViewContent", {
            content_name: "Audit Form",
            content_category: "Lead Generation",
          });
          setViewContentTracked(true);
        }
      },
      { threshold: 0.3 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, [viewContentTracked]);

  // Track InitiateCheckout when user starts filling Step 1
  const trackInitiateCheckout = () => {
    if (!initiateCheckoutTracked) {
      trackPixelEvent("InitiateCheckout", {
        content_name: "Audit Form Step 1",
        content_category: "Lead Generation",
      });
      setInitiateCheckoutTracked(true);
    }
  };

  const scrollToTop = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validateStep1 = () => {
    const errs: Partial<FormData> = {};
    if (!formData.firstName.trim()) errs.firstName = "Please enter your first name";
    if (!formData.email.trim()) errs.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Please enter a valid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Partial<FormData> = {};
    if (!formData.website.trim()) errs.website = "Please enter your website URL";
    if (!formData.adSpend) errs.adSpend = "Please select your monthly ad spend";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Partial<FormData> = {};
    if (!formData.challenge) errs.challenge = "Please select your main challenge";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    let valid = false;
    if (step === 1) valid = validateStep1();
    else if (step === 2) valid = validateStep2();
    if (valid) {
      setStep(step + 1);
      scrollToTop();
      
      // Track form progression
      trackPixelEvent("CustomEvent", {
        content_name: `Audit Form Step ${step + 1}`,
        content_category: "Form Progression",
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setSubmitting(true);

    const isQualified = !DISQUALIFYING_SPENDS.includes(formData.adSpend);

    // Generate event ID for deduplication between pixel and CAPI
    const eventId = crypto.randomUUID();
    
    try {
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          challenge: formData.challenge === "other" ? formData.challengeOther : formData.challenge,
          qualified: isQualified,
          source: "meta-ads",
          timestamp: new Date().toISOString(),
          eventId, // Pass event ID for deduplication
        }),
      });

      if (!response.ok) {
        console.error("Failed to submit lead");
      }
    } catch (err) {
      console.error("Submit error:", err);
    }

    // Track pixel event with event ID for deduplication
    if (isQualified) {
      trackPixelEvent("Lead", {
        content_name: "Audit Form Submission",
        content_category: "Lead Generation",
        eventID: eventId, // For deduplication with CAPI
      });
    }

    setQualified(isQualified);
    setSubmitted(true);
    setSubmitting(false);
    scrollToTop();
  };

  return (
    <section
      id="audit-form"
      ref={sectionRef}
      className="py-16 md:py-24 px-4 scroll-mt-0"
      style={{
        background: "linear-gradient(180deg, #0A0A0A 0%, #0D0D0D 100%)",
      }}
    >
      <div className="max-w-lg mx-auto">
        {!submitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-10">
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5"
                style={{
                  background: "rgba(45,139,60,0.15)",
                  color: "#4EB85E",
                  border: "1px solid rgba(45,139,60,0.3)",
                }}
              >
                Free Audit — No Obligation
              </span>
              <h2
                className="font-black leading-tight text-white mb-3"
                style={{ fontSize: "clamp(1.7rem, 4vw, 2.5rem)" }}
              >
                Find out where your ad budget is leaking
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}>
                Takes 2 minutes. We review your account <strong className="text-white/80">before</strong> we speak.
              </p>

              {/* Scarcity nudge */}
              <div
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span style={{ color: "rgba(239,68,68,0.8)", fontSize: "0.78rem", fontWeight: 700 }}>
                  Only 3 audit spots remaining this month
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex gap-1.5 mb-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className="flex-1 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      background: s <= step
                        ? "linear-gradient(90deg, #2D8B3C, #4EB85E)"
                        : "rgba(255,255,255,0.08)",
                    }}
                  />
                ))}
              </div>
              <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                Step {step} of 3 — {step === 1 ? "Your details" : step === 2 ? "Your business" : "Your challenge"}
              </p>
            </div>

            {/* Step container */}
            <div
              key={step}
              className="step-enter mt-8"
              style={{
                background: "#161616",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "clamp(1.5rem, 4vw, 2.25rem)",
              }}
            >
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block font-semibold text-sm mb-2.5" style={{ color: "rgba(255,255,255,0.8)" }}>
                      What&apos;s your first name?
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleNext()}
                      onFocus={(e) => {
                        trackInitiateCheckout();
                        e.currentTarget.style.borderColor = "#2D8B3C";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,139,60,0.15)";
                      }}
                      placeholder="e.g. Alex"
                      autoComplete="given-name"
                      className="form-input w-full rounded-xl px-4 py-4 text-white placeholder-white/20"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: `1.5px solid ${errors.firstName ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
                        fontSize: "16px",
                        outline: "none",
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.firstName ? "#EF4444" : "rgba(255,255,255,0.1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1.5">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-sm mb-2.5" style={{ color: "rgba(255,255,255,0.8)" }}>
                      Work email address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleNext()}
                      placeholder="you@yourbrand.com"
                      autoComplete="email"
                      className="form-input w-full rounded-xl px-4 py-4 text-white placeholder-white/20"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: `1.5px solid ${errors.email ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
                        fontSize: "16px",
                        outline: "none",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#2D8B3C";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,139,60,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.email ? "#EF4444" : "rgba(255,255,255,0.1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                  </div>

                  <button
                    onClick={handleNext}
                    className="btn-green w-full rounded-xl py-4 text-base mt-1 min-h-[56px]"
                  >
                    Continue →
                  </button>

                  <p className="text-center" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem" }}>
                    No spam. No cold calls. Just your free audit.
                  </p>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold text-sm mb-2.5" style={{ color: "rgba(255,255,255,0.8)" }}>
                      Your brand&apos;s website URL
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourbrand.com"
                      autoComplete="url"
                      className="form-input w-full rounded-xl px-4 py-4 text-white placeholder-white/20"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: `1.5px solid ${errors.website ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
                        fontSize: "16px",
                        outline: "none",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#2D8B3C";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,139,60,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.website ? "#EF4444" : "rgba(255,255,255,0.1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    {errors.website && <p className="text-red-400 text-xs mt-1.5">{errors.website}</p>}
                  </div>

                  <div>
                    <label className="block font-semibold text-sm mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>
                      Current monthly ad spend
                    </label>
                    <div className="space-y-2">
                      {AD_SPEND_OPTIONS.map((opt) => {
                        const isSelected = formData.adSpend === opt.value;
                        return (
                          <label
                            key={opt.value}
                            className="flex items-center gap-3.5 p-4 rounded-xl cursor-pointer"
                            style={{
                              border: `1.5px solid ${isSelected ? "#2D8B3C" : "rgba(255,255,255,0.08)"}`,
                              background: isSelected ? "rgba(45,139,60,0.1)" : "rgba(255,255,255,0.03)",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <div
                              className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                              style={{
                                borderColor: isSelected ? "#2D8B3C" : "rgba(255,255,255,0.25)",
                                background: isSelected ? "#2D8B3C" : "transparent",
                              }}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-sm font-medium" style={{ color: isSelected ? "white" : "rgba(255,255,255,0.7)" }}>
                              {opt.label}
                            </span>
                            <input
                              type="radio"
                              name="adSpend"
                              value={opt.value}
                              checked={isSelected}
                              onChange={(e) => setFormData({ ...formData, adSpend: e.target.value })}
                              className="sr-only"
                            />
                          </label>
                        );
                      })}
                    </div>
                    {errors.adSpend && <p className="text-red-400 text-xs mt-1.5">{errors.adSpend}</p>}
                  </div>

                  <button onClick={handleNext} className="btn-green w-full rounded-xl py-4 text-base min-h-[56px]">
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold text-sm mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>
                      What&apos;s your biggest paid social challenge right now?
                    </label>
                    <div className="space-y-2">
                      {CHALLENGE_OPTIONS.map((opt) => {
                        const isSelected = formData.challenge === opt.value;
                        return (
                          <label
                            key={opt.value}
                            className="flex items-center gap-3.5 p-4 rounded-xl cursor-pointer"
                            style={{
                              border: `1.5px solid ${isSelected ? "#2D8B3C" : "rgba(255,255,255,0.08)"}`,
                              background: isSelected ? "rgba(45,139,60,0.1)" : "rgba(255,255,255,0.03)",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <div
                              className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                              style={{
                                borderColor: isSelected ? "#2D8B3C" : "rgba(255,255,255,0.25)",
                                background: isSelected ? "#2D8B3C" : "transparent",
                              }}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-sm font-medium" style={{ color: isSelected ? "white" : "rgba(255,255,255,0.7)" }}>
                              {opt.label}
                            </span>
                            <input
                              type="radio"
                              name="challenge"
                              value={opt.value}
                              checked={isSelected}
                              onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                              className="sr-only"
                            />
                          </label>
                        );
                      })}
                    </div>
                    {errors.challenge && <p className="text-red-400 text-xs mt-1.5">{errors.challenge}</p>}
                  </div>

                  {formData.challenge === "other" && (
                    <div>
                      <textarea
                        value={formData.challengeOther}
                        onChange={(e) => setFormData({ ...formData, challengeOther: e.target.value })}
                        placeholder="Tell us about your challenge..."
                        rows={3}
                        className="w-full rounded-xl px-4 py-4 text-white placeholder-white/20 resize-none"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1.5px solid rgba(255,255,255,0.1)",
                          fontSize: "16px",
                          outline: "none",
                          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
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
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-green w-full rounded-xl text-base min-h-[60px] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ fontSize: "1.05rem", padding: "16px 24px" }}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round"/>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Get My Free Audit →"
                    )}
                  </button>

                  {/* Trust row */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2D8B3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem" }}>100% free</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2D8B3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                      </svg>
                      <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem" }}>No commitment</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2D8B3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem" }}>2 min to complete</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : qualified ? (
          <CalendlyEmbed firstName={formData.firstName} email={formData.email} />
        ) : (
          <div className="text-center py-10">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(45,139,60,0.15)", border: "1px solid rgba(45,139,60,0.25)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#2D8B3C" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="#2D8B3C" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-white font-black text-2xl md:text-3xl mb-4">
              Thanks, {formData.firstName}!
            </h3>
            <p className="leading-relaxed max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
              Our audits are best suited for brands currently spending £1,000+/month on ads. We want to make sure we can deliver real value.
            </p>
            <p className="leading-relaxed max-w-sm mx-auto mt-3" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
              Follow us for free paid social tips while you scale:
            </p>
            <p className="font-bold text-lg mt-4" style={{ color: "#2D8B3C" }}>@root_social</p>
            <p className="mt-6" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
              We&apos;d love to work with you when you&apos;re ready to scale. 🚀
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
