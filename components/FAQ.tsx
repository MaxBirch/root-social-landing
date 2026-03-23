"use client";

import { useState, useRef, useEffect } from "react";

const faqs = [
  {
    q: "What happens during the FREE audit?",
    a: "We review your entire ad account strategy and funnel. You'll get a personalised breakdown of where budget is being wasted and exactly what we'd change in the first 30 days. No generic templates.",
  },
  {
    q: "How is Root Social different from other agencies?",
    a: "We cap the number of clients per media buyer so your account gets real focus. We operate on rolling monthly contracts and measure success by revenue growth, not vanity metrics.",
  },
  {
    q: "Do I need to be spending a minimum amount on ads?",
    a: "We work best with brands spending £1,000+ per month on paid social. If you're below that, we'll still point you in the right direction during the audit.",
  },
  {
    q: "Are there any contracts or lock-in periods?",
    a: "No. Every client is on a rolling monthly agreement. You stay because it works, not because you're locked in.",
  },
  {
    q: "What platforms do you manage?",
    a: "Meta (Facebook and Instagram), Google Ads, and TikTok Ads. Most of our clients see the biggest returns on Meta.",
  },
  {
    q: "How quickly will I see results?",
    a: "Most clients see measurable improvements within the first 30 days. Significant scaling typically happens in the 60 to 90 day range depending on your starting point and budget.",
  },
  {
    q: "What if the audit shows my ads are already performing well?",
    a: "Then we'll tell you that. We're not going to manufacture problems to win your business. If there's nothing to fix, you'll walk away with confirmation and maybe a few ideas to test.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = answerRef.current;
    if (!el) return;
    if (open) {
      el.style.maxHeight = el.scrollHeight + "px";
      el.style.opacity = "1";
    } else {
      el.style.maxHeight = "0";
      el.style.opacity = "0";
    }
  }, [open]);

  return (
    <div
      className="border-b"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className="font-bold leading-snug"
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
            color: open ? "#4EB85E" : "rgba(255,255,255,0.9)",
            transition: "color 0.2s ease",
          }}
        >
          {q}
        </span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: open ? "rgba(45,139,60,0.2)" : "rgba(255,255,255,0.06)",
            border: open ? "1px solid rgba(45,139,60,0.4)" : "1px solid rgba(255,255,255,0.1)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke={open ? "#4EB85E" : "rgba(255,255,255,0.7)"} strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      <div
        ref={answerRef}
        className="faq-answer"
        style={{ maxHeight: 0, opacity: 0 }}
      >
        <p
          className="pb-5 leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.95rem",
            paddingRight: "2rem",
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const inner = el.querySelector(".faq-inner");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inner?.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "80px" }
    );
    observer.observe(el);
    const fallback = setTimeout(() => inner?.classList.add("revealed"), 1500);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-10 md:py-16 px-4"
      style={{
        background: "linear-gradient(180deg, #0A0A0A 0%, #0D0D0D 100%)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-2xl mx-auto faq-inner reveal">
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{
              background: "rgba(45,139,60,0.12)",
              color: "#4EB85E",
              border: "1px solid rgba(45,139,60,0.25)",
            }}
          >
            FAQ
          </span>
          <h2
            className="font-black text-white leading-tight"
            style={{ fontSize: "clamp(1.7rem, 4vw, 2.5rem)" }}
          >
            Questions we get asked a lot
          </h2>
          <p className="mt-3" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
            Honest answers. No spin.
          </p>
        </div>

        <div
          className="rounded-2xl overflow-hidden px-6 md:px-8"
          style={{
            background: "#161616",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        <div className="text-center mt-10">
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "16px" }}>
            Still have questions? We&apos;re happy to help.
          </p>
          <a
            href="mailto:hello@root-social.com"
            className="inline-flex items-center gap-2 text-sm font-bold"
            style={{ color: "#4EB85E" }}
          >
            hello@root-social.com
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
