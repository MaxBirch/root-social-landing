import Hero from "@/components/Hero";
import LogoCarousel from "@/components/LogoCarousel";
import TrustBar from "@/components/TrustBar";
import Testimonial from "@/components/Testimonial";
import VideoSection from "@/components/VideoSection";
import Comparison from "@/components/Comparison";
import MoreReviews from "@/components/MoreReviews";
import AuditForm from "@/components/AuditForm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import ExitIntent from "@/components/ExitIntent";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <main>
      {/* 1. Hero - logo only, headline, subheadline, body copy, CTA */}
      <Hero />

      {/* 2. Trusted By - animated infinite logo carousel */}
      <LogoCarousel />

      {/* 3. Trust Bar - key stats (replaces 35x ROAS with 30 Day avg) */}
      <TrustBar />

      {/* 4. Testimonials - "What Our Clients Say" carousel with dots */}
      <Testimonial />

      {/* 5. Results / Case Studies - growth-focused metrics */}
      <VideoSection />

      {/* 6. Why Us? Comparison */}
      <Comparison />

      {/* 7. More Reviews - grid of quote cards */}
      <MoreReviews />

      {/* 8. Form - qualifying multi-step audit form */}
      <AuditForm />

      {/* 9. FAQ - accordion, dark background */}
      <FAQ />

      {/* 10. Footer */}
      <Footer />

      {/* Exit Intent - desktop only, once per session */}
      <ExitIntent />

      {/* Sticky mobile CTA - appears after scrolling past hero */}
      <StickyMobileCTA />
    </main>
  );
}
