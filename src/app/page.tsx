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
import LeadershipSection from "@/components/LeadershipSection";

import Container from "@/components/Container";

export default async function Home() {
  const { news } = await getPaginatedNews({ page: 1, limit: 15 });

  return (
    <div className="relative">
      <WelcomeBanner />

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/20" />
      {/* FULL WIDTH */}
      <FadeInSection delay={0.3}>
        <AppCarousel />
      </FadeInSection>

      {/* CONSTRAINED */}
      <Container>
        <FadeInSection delay={0.2}>
          <HeroSection />
        </FadeInSection>
      </Container>

      {/* FULL WIDTH (stats usually look better wide) */}
      <CommandStats />

      {/* CONSTRAINED */}
      <Container>
        <FadeInSection delay={0.4}>
          <VisionStatement
            imageSrc={AOC}
            name="AVM JA EFANGA"
            rank="AVM"
            appointment="Air Officer Commanding"
            statementType="Vision"
            statement="To lead in aviation training..."
          />
        </FadeInSection>
      </Container>

      {/* CONSTRAINED */}
      <Container>
        <FadeInSection delay={0.6}>
          <UnitsGrid />
        </FadeInSection>
      </Container>

      {/* 🔥 LEADERSHIP → KEEP FULL WIDTH (important for horizontal scroll) */}
      <LeadershipSection />

      {/* CONSTRAINED */}
      <Container>
        <FadeInSection delay={0.5}>
          <SidebarNews news={news} layout="horizontal" slug="" />
        </FadeInSection>
      </Container>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
