import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import TrustBar from "@/components/TrustBar";
import Comparison from "@/components/Comparison";
import AuditForm from "@/components/AuditForm";
import Testimonial from "@/components/Testimonial";
import Footer from "@/components/Footer";
import ExitIntent from "@/components/ExitIntent";

export default function Home() {
  return (
    <main>
      {/* 1. Hero — Impact + CTA above fold */}
      <Hero />

      {/* 2. Trust Bar — immediate social proof after hero */}
      <TrustBar />

      {/* 3. Video — humanise the brand */}
      <VideoSection />

      {/* 4. Comparison — why Root Social */}
      <Comparison />

      {/* 5. Testimonial — social proof BEFORE form */}
      <Testimonial />

      {/* 6. Form — primary conversion */}
      <AuditForm />

      {/* Footer */}
      <Footer />

      {/* Exit Intent — desktop only, client-only */}
      <ExitIntent />
    </main>
  );
}
