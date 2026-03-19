"use client";

import { useState, useRef } from "react";
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
  { value: "1k-3k", label: "£1,000 to £3,000/month" },
  { value: "3k-10k", label: "£3,000 to £10,000/month" },
  { value: "10k-plus", label: "£10,000+/month" },
  { value: "not-running", label: "Not currently running ads" },
];

const CHALLENGE_OPTIONS = [
  { value: "not-enough-creative", label: "Not enough creative being produced" },
  { value: "roas", label: "ROAS isn't where it needs to be" },
  { value: "scaling", label: "Scaling spend without killing performance" },
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
  const sectionRef = useRef<HTMLDivElement>(null);

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
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setSubmitting(true);

    const isQualified = !DISQUALIFYING_SPENDS.includes(formData.adSpend);

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
      className="bg-root-dark py-14 md:py-20 px-4 scroll-mt-0"
    >
      <div className="max-w-xl mx-auto">
        {!submitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <span className="inline-block bg-root-green/20 text-root-green font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
                Free Audit — No Obligation
              </span>
              <h2 className="text-white font-black text-3xl md:text-4xl leading-tight">
                Find out where your ad budget is leaking
              </h2>
              <p className="text-white/50 text-base mt-3">
                Takes 2 minutes. We review your account before we speak.
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`flex-1 h-1 rounded-full transition-colors duration-300 ${s <= step ? "bg-root-green" : "bg-white/10"}`} />
                </div>
              ))}
            </div>
            <p className="text-white/40 text-sm mb-6 text-center">Step {step} of 3</p>

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold text-sm mb-2">
                    What&apos;s your first name?
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Alex"
                    className={`w-full bg-white/5 border ${errors.firstName ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-root-green transition-colors`}
                  />
                  {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-white font-semibold text-sm mb-2">
                    What&apos;s your email address?
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@yourbrand.com"
                    className={`w-full bg-white/5 border ${errors.email ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-root-green transition-colors`}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-root-green text-white font-bold text-base py-4 rounded-xl hover:bg-green-700 transition-colors mt-2 min-h-[56px]"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-white font-semibold text-sm mb-2">
                    What&apos;s your brand&apos;s website URL?
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourbrand.com"
                    className={`w-full bg-white/5 border ${errors.website ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-root-green transition-colors`}
                  />
                  {errors.website && <p className="text-red-400 text-sm mt-1">{errors.website}</p>}
                </div>

                <div>
                  <label className="block text-white font-semibold text-sm mb-3">
                    What&apos;s your current monthly ad spend?
                  </label>
                  <div className="space-y-2">
                    {AD_SPEND_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.adSpend === opt.value
                            ? "border-root-green bg-root-green/10"
                            : "border-white/10 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                          formData.adSpend === opt.value ? "border-root-green bg-root-green" : "border-white/30"
                        }`}>
                          {formData.adSpend === opt.value && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-white text-sm">{opt.label}</span>
                        <input
                          type="radio"
                          name="adSpend"
                          value={opt.value}
                          checked={formData.adSpend === opt.value}
                          onChange={(e) => setFormData({ ...formData, adSpend: e.target.value })}
                          className="sr-only"
                        />
                      </label>
                    ))}
                  </div>
                  {errors.adSpend && <p className="text-red-400 text-sm mt-1">{errors.adSpend}</p>}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-root-green text-white font-bold text-base py-4 rounded-xl hover:bg-green-700 transition-colors min-h-[56px]"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-white font-semibold text-sm mb-3">
                    What&apos;s the biggest challenge with your paid social right now?
                  </label>
                  <div className="space-y-2">
                    {CHALLENGE_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.challenge === opt.value
                            ? "border-root-green bg-root-green/10"
                            : "border-white/10 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                          formData.challenge === opt.value ? "border-root-green bg-root-green" : "border-white/30"
                        }`}>
                          {formData.challenge === opt.value && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-white text-sm">{opt.label}</span>
                        <input
                          type="radio"
                          name="challenge"
                          value={opt.value}
                          checked={formData.challenge === opt.value}
                          onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                          className="sr-only"
                        />
                      </label>
                    ))}
                  </div>
                  {errors.challenge && <p className="text-red-400 text-sm mt-1">{errors.challenge}</p>}
                </div>

                {/* Other free text */}
                {formData.challenge === "other" && (
                  <div>
                    <textarea
                      value={formData.challengeOther}
                      onChange={(e) => setFormData({ ...formData, challengeOther: e.target.value })}
                      placeholder="Tell us about your challenge..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-root-green transition-colors resize-none"
                    />
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-root-green text-white font-bold text-base py-4 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-h-[56px]"
                >
                  {submitting ? "Submitting..." : "Get My Free Audit →"}
                </button>

                <p className="text-white/30 text-xs text-center">
                  By submitting, you agree to be contacted by Root Social about your audit.
                </p>
              </div>
            )}
          </>
        ) : qualified ? (
          /* Qualified — show Calendly */
          <CalendlyEmbed
            firstName={formData.firstName}
            email={formData.email}
          />
        ) : (
          /* Disqualified — polite message */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-root-green/20 flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#2D8B3C" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="#2D8B3C" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-white font-black text-2xl md:text-3xl mb-4">
              Thanks for your interest, {formData.firstName}!
            </h3>
            <p className="text-white/60 text-base leading-relaxed max-w-sm mx-auto">
              At this stage, our services are best suited for brands spending £1,000+ per month on ads.
            </p>
            <p className="text-white/60 text-base leading-relaxed max-w-sm mx-auto mt-3">
              Follow us on Instagram for tips on getting started and growing to that level:
            </p>
            <p className="text-root-green font-bold text-lg mt-4">
              @rootsocialmedia
            </p>
            <p className="text-white/40 text-sm mt-6">
              We hope to work with you when you&apos;re ready to scale. 🚀
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
