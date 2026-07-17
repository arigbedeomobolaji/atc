import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AppCarousel } from "@/components/AppCarousel";
import { VisionStatement } from "@/components/VisionStatement";
import { Footer } from "@/components/Footer";
import UnitsGrid from "@/components/UnitsGrid";
import { SidebarNews } from "@/components/news/SidebarNews";
import { getPaginatedNews } from "@/lib/services/news.services";
import CommandStats from "@/components/CommandStats";
import LeadershipSection from "@/components/LeadershipSection";
import { connectToDatabase } from "@/lib/db";
import AOC_FALLBACK from "../assets/leadership.jpg";

async function getAOC() {
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection("aoc").findOne({});
    if (!doc) return null;
    return {
      name: doc.name as string,
      rank: doc.rank as string,
      awards: (doc.awards || "") as string,
      appointment: doc.appointment as string,
      statementType: (doc.statementType || "Vision") as "Vision" | "Mission",
      statement: doc.statement as string,
      image: (doc.image || null) as string | null,
    };
  } catch {
    return null;
  }
}

export default async function Home() {
  const [{ news }, aoc] = await Promise.all([
    getPaginatedNews({ page: 1, limit: 15 }),
    getAOC(),
  ]);

  return (
    <div className="relative">
      <Navbar />
      <AppCarousel />
      <HeroSection />
      <CommandStats />
      <VisionStatement
        imageSrc={aoc?.image || AOC_FALLBACK}
        name={aoc?.name as string}
        rank={aoc?.rank as string}
        awards={aoc?.awards as string}
        appointment={aoc?.appointment as string}
        statementType={aoc?.statementType || "Vision"}
        statement={
          aoc?.statement ||
          "To lead in aviation training excellence across the Nigerian Air Force."
        }
      />
      <UnitsGrid />
      <LeadershipSection />
      <SidebarNews news={news} layout="horizontal" slug="" />
      <Footer />
    </div>
  );
}
