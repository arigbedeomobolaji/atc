import { WelcomeBanner } from "@/components/WelcomeBanner";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AppCarousel } from "@/components/AppCarousel";
import { VisionStatement } from "@/components/VisionStatement";
import { FadeInSection } from "@/components/FadeInSection";
import { Footer } from "@/components/Footer";
import UnitsGrid from "@/components/UnitsGrid";
import { SidebarNews } from "@/components/news/SidebarNews";
import { getPaginatedNews } from "@/lib/services/news.services";
import CommandStats from "@/components/CommandStats";
import AOC from "../assets/leadership.jpg";

export default async function Home() {
  const { news } = await getPaginatedNews({ page: 1, limit: 15 });
  return (
    <div className="relative">
      <WelcomeBanner />

      {/* Fixed Header (Banner + Navbar) */}
      <div className="sticky top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>

      {/* Push content down to avoid overlap */}
      <div className="">
        <FadeInSection delay={0.3}>
          <AppCarousel />
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <HeroSection />
        </FadeInSection>

        <CommandStats />

        <FadeInSection delay={0.4}>
          <VisionStatement
            imageSrc={AOC}
            name="AVM JA EFANGA"
            rank="AVM"
            appointment="Air Officer Commanding"
            statementType="Vision"
            statement="“To lead in aviation training and operational excellence,
                fostering a generation of airmen and officers equipped with
                advanced skills, strategic thinking, and unwavering discipline,
                committed to safeguarding the nation and advancing airpower
                capabilities."
          />
        </FadeInSection>

        <FadeInSection delay={0.6}>
          <UnitsGrid />
        </FadeInSection>

        <br />
        <FadeInSection delay={0.5}>
          <SidebarNews news={news} layout="horizontal" slug="" />
        </FadeInSection>
        <br />

        <Footer />
      </div>
    </div>
  );
}
