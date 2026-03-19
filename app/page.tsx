import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import VideoSection from "@/components/VideoSection";
import Comparison from "@/components/Comparison";
import Testimonial from "@/components/Testimonial";
import AuditForm from "@/components/AuditForm";
import Footer from "@/components/Footer";
import ExitIntent from "@/components/ExitIntent";

export default function Home() {
  return (
    <main>
      {/* 1. Hero — impact + single CTA above fold */}
      <Hero />

      {/* 2. Trust Bar — instant credibility, numbers-first */}
      <TrustBar />

      {/* 3. Results / Case Studies — "show don't tell" before explanation */}
      <VideoSection />

      {/* 4. Comparison — why Root Social vs others */}
      <Comparison />

      {/* 5. Social Proof — testimonials before the ask */}
      <Testimonial />

      {/* 6. Form — primary conversion point */}
      <AuditForm />

      {/* 7. Footer */}
      <Footer />

      {/* Exit Intent — desktop only, once per session */}
      <ExitIntent />
    </main>
  );
}
