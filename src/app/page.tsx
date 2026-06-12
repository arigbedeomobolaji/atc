import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AppCarousel } from "@/components/AppCarousel";
import { VisionStatement } from "@/components/VisionStatement";
import { Footer } from "@/components/Footer";
import UnitsGrid from "@/components/UnitsGrid";
import { SidebarNews } from "@/components/news/SidebarNews";
import { getPaginatedNews } from "@/lib/services/news.services";
import CommandStats from "@/components/CommandStats";
import AOC from "../assets/leadership.jpg";
import LeadershipSection from "@/components/LeadershipSection";

export default async function Home() {
  const { news } = await getPaginatedNews({ page: 1, limit: 15 });

  return (
    <div className="relative">
      <Navbar />
      <AppCarousel />
      <HeroSection />
      <CommandStats />
      <VisionStatement
        imageSrc={AOC}
        name="AVM JA EFANGA"
        rank="AVM"
        awards="psc(+), mni, fdc"
        appointment="Air Officer Commanding, Air Training Command"
        statementType="Vision"
        statement="To lead in aviation training..."
      />
      <UnitsGrid />
      <LeadershipSection />
      <SidebarNews news={news} layout="horizontal" slug="" />
      <Footer />
    </div>
  );
}
