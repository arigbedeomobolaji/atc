import { WelcomeBanner } from "@/components/WelcomeBanner";
import { Navbar } from "@/components/Navbar";
import { FadeInSection } from "@/components/FadeInSection";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import ATCAchievements from "@/components/ATCAchievement";
import ATCHistory from "@/components/ATCHistory";

export default function Home() {
  return (
    <div className="relative">
      <WelcomeBanner />

      {/* Fixed Header (Banner + Navbar) */}
      <div className="sticky top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>

      <div className="bg-dark">
        <div className="max-w-6xl mx-auto bg-white">
          <div className="">
            <FadeInSection delay={0.2}>
              <PageHero
                title="All About Air Training Command"
                description="History, Organization, achievement"
                callToAction="Explore about us"
              />
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <ATCHistory />
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <ATCAchievements />
            </FadeInSection>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
