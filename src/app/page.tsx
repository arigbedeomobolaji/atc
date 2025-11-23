import { WelcomeBanner } from "@/components/WelcomeBanner";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AppCarousel } from "@/components/AppCarousel";
import { VisionStatement } from "@/components/VisionStatement";
import { FadeInSection } from "@/components/FadeInSection";
import { Footer } from "@/components/Footer";
import UnitsGrid from "@/components/UnitsGrid";

export default function Home() {
  return (
    <div className="relative">
      <WelcomeBanner />

      {/* Fixed Header (Banner + Navbar) */}
      <div className="sticky top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>

      {/* Push content down to avoid overlap */}
      <div className="">
        <FadeInSection delay={0.2}>
          <HeroSection />
        </FadeInSection>

        <div className="mb-5" />

        <FadeInSection delay={0.3}>
          <AppCarousel />
        </FadeInSection>

        <FadeInSection delay={0.4}>
          <VisionStatement />
        </FadeInSection>

        <FadeInSection delay={0.5}>
          <UnitsGrid />
        </FadeInSection>
        <Footer />
      </div>
    </div>
  );
}
