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
      {/* Section 1: Hero */}
      <Hero />

      {/* Section 3: Trust Bar (moved up — above the fold on scroll) */}
      <TrustBar />

      {/* Section 2: Video */}
      <VideoSection />

      {/* Section 4: Comparison */}
      <Comparison />

      {/* Section 7: Testimonial */}
      <Testimonial />

      {/* Section 5 + 6: Form + Calendly */}
      <AuditForm />

      {/* Footer */}
      <Footer />

      {/* Section 8: Exit Intent (client-only, desktop) */}
      <ExitIntent />
    </main>
  );
}
