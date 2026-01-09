/* eslint-disable @typescript-eslint/no-explicit-any */
// app/news/page.tsx - public news listing (server component)
import Link from "next/link";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { Navbar } from "@/components/Navbar";
import { NewsMosaic } from "@/components/news/NewsMosaic";
import LatestNews from "@/components/news/LatestNews";
import { getOldestNews, getPaginatedNews } from "@/lib/services/news.services";
import { Footer } from "@/components/Footer";
import { SidebarNews } from "@/components/news/SidebarNews";

export function Border() {
  return <div className="flex-1 gap-1 border-t border-t-dark items-center" />;
}
export default async function NewsPage() {
  const latest = await getPaginatedNews({ page: 1, limit: 10 });
  const archive = await getOldestNews(15);

  const firstNews = latest.news[0];

  return (
    <div className="max-w-350 mx-auto p-6">
      {/* Fixed Header (Banner + Navbar) */}
      <WelcomeBanner />
      <div className="sticky top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>
      {/* Latest news */}
      {firstNews && (
        <div className="text-sm font-bold my-3">
          <Link
            href={`/news/${firstNews.slug}`}
            className="flex gap-3 items-center flex-col lg:flex-row"
          >
            <button className="bg-dark text-white px-2 shadow-md rounded-xs">
              LATEST NEWS
            </button>
            <p>{firstNews.title}</p>
          </Link>
        </div>
      )}

      {/* Top four news */}
      <NewsMosaic news={latest.news.slice(0, 4)} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* LEFT - LATEST */}
        <div className="col-span-1 lg:col-span-3">
          <div className="flex items-center gap-5">
            <Border />
            Latest Post <Border />
          </div>
          {/* Latest News field */}
          <LatestNews />
        </div>
        {/* RIGHT — ARCHIVE */}

        <SidebarNews news={archive} slug="" />
      </div>
      <Footer />
    </div>
  );
}
