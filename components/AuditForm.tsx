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
  accessGranted: boolean;
  additionalNotes: string;
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
  { value: "poor-comms", label: "Poor communication from current agency" },
  { value: "getting-started", label: "Just getting started with paid social" },
  { value: "other", label: "Other" },
];

const DISQUALIFYING_SPENDS = ["less-than-1k", "not-running"];

const TOTAL_STEPS = 5;

export default function AuditForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    email: "",
    website: "",
    adSpend: "",
    challenge: "",
    challengeOther: "",
    accessGranted: false,
    additionalNotes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [viewContentTracked]);

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
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!formData.firstName.trim()) errs.firstName = "Please enter your first name";
    if (!formData.email.trim()) errs.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Please enter a valid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!formData.website.trim()) errs.website = "Please enter your website URL";
    if (!formData.adSpend) errs.adSpend = "Please select your monthly ad spend";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!formData.challenge) errs.challenge = "Please select your main challenge";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!formData.accessGranted) errs.accessGranted = "Please confirm you've granted view-only access to proceed";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    let valid = false;
    if (step === 1) valid = validateStep1();
    else if (step === 2) valid = validateStep2();
    else if (step === 3) valid = validateStep3();
    else if (step === 4) valid = validateStep4();
    if (valid) {
      setStep(step + 1);
      scrollToTop();
      trackPixelEvent("CustomEvent", {
        content_name: `Audit Form Step ${step + 1}`,
        content_category: "Form Progression",
      });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const isQualified = !DISQUALIFYING_SPENDS.includes(formData.adSpend);
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
          eventId,
        }),
      });

      if (!response.ok) {
        console.error("Failed to submit lead");
      }
    } catch (err) {
      console.error("Submit error:", err);
    }

    if (isQualified) {
      trackPixelEvent("Lead", {
        content_name: "Audit Form Submission",
        content_category: "Lead Generation",
        eventID: eventId,
      });
    }

    setQualified(isQualified);
    setSubmitted(true);
    setSubmitting(false);
    scrollToTop();
  };

  const stepLabel = () => {
    switch (step) {
      case 1: return "About you";
      case 2: return "Your ad account";
      case 3: return "Your biggest challenge";
      case 4: return "Grant account access";
      case 5: return "Anything else?";
      default: return "";
    }
  };

  return (
    <section
      id="audit-form"
      ref={sectionRef}
      className="py-10 md:py-16 px-4 scroll-mt-0"
      style={{
        background: "linear-gradient(180deg, #0A0A0A 0%, #0D0D0D 100%)",
      }}
    >
      <div className="max-w-lg mx-auto">
        {!submitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5"
                style={{
                  background: "rgba(45,139,60,0.15)",
                  color: "#4EB85E",
                  border: "1px solid rgba(45,139,60,0.3)",
                }}
              >
                FREE Audit - No Obligation
              </span>
              <h2
                className="font-black leading-tight text-white mb-3"
                style={{ fontSize: "clamp(1.7rem, 4vw, 2.5rem)" }}
              >
                Claim your FREE ad account audit
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}>
                Takes 2 minutes to fill in. We&apos;ll review your account <strong className="text-white/80">before</strong> your FREE 30-minute audit call.
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
                  3 of 5 audit spots claimed this month
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex gap-1.5 mb-2">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
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
                Step {step} of {TOTAL_STEPS}  -  {stepLabel()}
              </p>
            </div>

            {/* Step container */}
            <div
              key={step}
              className="step-enter mt-6"
              style={{
                background: "#161616",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "clamp(1.5rem, 4vw, 2.25rem)",
              }}
            >
              {/* ─── Step 1: Name + Email ─── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block font-semibold text-sm mb-2.5" style={{ color: "rgba(255,255,255,0.8)" }}>
                      First name
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

                  <button onClick={handleNext} className="btn-green w-full rounded-xl py-4 text-base mt-1 min-h-[56px]">
                    Continue →
                  </button>

                  <p className="text-center" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem" }}>
                    No spam. No cold calls. Just your FREE audit.
                  </p>
                </div>
              )}

              {/* ─── Step 2: Website + Ad Spend ─── */}
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

              {/* ─── Step 3: Challenge ─── */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold text-sm mb-3" style={{ color: "rgba(255,255,255,0.8)" }}>
                      What&apos;s your #1 paid social challenge right now?
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

                  <button onClick={handleNext} className="btn-green w-full rounded-xl text-base min-h-[56px]" style={{ padding: "16px 24px" }}>
                    Continue →
                  </button>
                </div>
              )}

              {/* ─── Step 4: Ad Account Access ─── */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-black text-white text-lg mb-1">Grant us view-only access to your ad account</h3>
                    <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
                      To carry out your FREE audit, we need view-only access to your Meta ad account. Here&apos;s how:
                    </p>

                    <ol className="space-y-3 mb-5">
                      {[
                        <>Go to <strong className="text-white">Meta Business Suite</strong> → Settings → People</>,
                        <>Click <strong className="text-white">"Add People"</strong></>,
                        <>Enter: <strong className="text-white" style={{ color: "#4EB85E" }}>rootsocialgeneral@gmail.com</strong></>,
                        <>Select <strong className="text-white">"Ad Account"</strong> and assign <strong className="text-white">"View Performance"</strong> access only</>,
                        <>Click <strong className="text-white">"Send Invitation"</strong></>,
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                            style={{ background: "rgba(45,139,60,0.2)", color: "#4EB85E" }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-sm leading-snug pt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>

                    {/* Note */}
                    <div
                      className="flex items-start gap-2.5 p-3.5 rounded-xl mb-5"
                      style={{
                        background: "rgba(45,139,60,0.08)",
                        border: "1px solid rgba(45,139,60,0.2)",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4EB85E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                        We only need <strong className="text-white">view-only access</strong>. We will never make changes to your account without your permission.
                      </p>
                    </div>

                    {/* Confirmation checkbox */}
                    <label
                      className="flex items-start gap-3 cursor-pointer p-4 rounded-xl"
                      style={{
                        border: `1.5px solid ${errors.accessGranted ? "#EF4444" : formData.accessGranted ? "#2D8B3C" : "rgba(255,255,255,0.08)"}`,
                        background: formData.accessGranted ? "rgba(45,139,60,0.08)" : "rgba(255,255,255,0.02)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        className="shrink-0 w-5 h-5 rounded flex items-center justify-center mt-0.5"
                        style={{
                          background: formData.accessGranted ? "#2D8B3C" : "transparent",
                          border: `2px solid ${formData.accessGranted ? "#2D8B3C" : "rgba(255,255,255,0.3)"}`,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {formData.accessGranted && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm leading-snug" style={{ color: "rgba(255,255,255,0.8)" }}>
                        I&apos;ve granted view-only access to <strong className="text-white">rootsocialgeneral@gmail.com</strong>
                      </span>
                      <input
                        type="checkbox"
                        checked={formData.accessGranted}
                        onChange={(e) => setFormData({ ...formData, accessGranted: e.target.checked })}
                        className="sr-only"
                      />
                    </label>
                    {errors.accessGranted && <p className="text-red-400 text-xs mt-1.5">{errors.accessGranted}</p>}
                  </div>

                  <button onClick={handleNext} className="btn-green w-full rounded-xl py-4 text-base min-h-[56px]">
                    Continue →
                  </button>
                </div>
              )}

              {/* ─── Step 5: Anything else? (Submit) ─── */}
              {step === 5 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-black text-white text-lg mb-1">Anything else we should know?</h3>
                    <label className="block text-sm mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                      Optional  -  tell us about your goals, challenges, or anything that would help us prepare your audit
                    </label>
                    <textarea
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      placeholder="e.g. We're launching a new product line next month, and want to scale quickly..."
                      rows={5}
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
                      "Submit & Book My Call →"
                    )}
                  </button>

                  {/* Trust row */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2D8B3C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem" }}>100% FREE</span>
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
              Follow us for FREE paid social tips while you scale:
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
