import { Navbar } from "@/components/Navbar";
import { NewsMosaic } from "@/components/news/NewsMosaic";
import LatestNews from "@/components/news/LatestNews";
import { getPaginatedNews } from "@/lib/services/news.services";
import { Footer } from "@/components/Footer";
import { Newspaper, Radio, LayoutGrid } from "lucide-react";

export default async function NewsPage() {
  const latest = await getPaginatedNews({ page: 1, limit: 10 });

  return (
    <div className="bg-[hsl(220,64%,8%)]">
      <Navbar />

      {/* ── Page hero ── */}
      <section className="relative bg-[hsl(220,64%,8%)] pt-20 pb-16 overflow-hidden">
        {/* Diagonal stripe */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Center glow */}
        <div className="absolute inset-x-0 top-0 h-64 bg-[hsl(45,68%,47%)]/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-5">
            <Radio size={11} className="text-[hsl(350,66%,55%)] animate-pulse" />
            <span className="text-[hsl(45,68%,47%)] text-[11px] font-black uppercase tracking-[0.3em]">
              Air Training Command
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-tight tracking-wide mb-4">
            News &amp; Updates
          </h1>

          <div className="flex items-center gap-2 mb-5">
            <div className="w-20 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
            <div className="w-10 h-0.5 rounded-full bg-white/20" />
          </div>

          <p className="text-white/55 text-base max-w-xl leading-relaxed">
            Stay informed with the latest news, announcements, and activities
            from the Nigerian Air Force Air Training Command, Kaduna.
          </p>
        </div>
      </section>

      {/* ── Featured mosaic ── */}
      <section className="bg-[hsl(220,64%,10%)] py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
              <Newspaper size={16} className="text-[hsl(220,64%,16%)]" />
            </div>
            <div>
              <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">
                Top Stories
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="w-10 h-0.5 rounded-full bg-[hsl(45,68%,47%)]" />
                <div className="w-5 h-px rounded-full bg-white/20" />
              </div>
            </div>
          </div>

          <NewsMosaic news={latest.news.slice(0, 4)} />
        </div>
      </section>

      {/* ── All articles ── */}
      <section className="bg-[hsl(220,64%,13%)] py-16 overflow-hidden">
        {/* Dot-grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
              <LayoutGrid size={16} className="text-[hsl(220,64%,16%)]" />
            </div>
            <div>
              <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">
                All Articles
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="w-10 h-0.5 rounded-full bg-[hsl(45,68%,47%)]" />
                <div className="w-5 h-px rounded-full bg-white/20" />
              </div>
            </div>
          </div>

          <LatestNews />
        </div>
      </section>

      <Footer />
    </div>
  );
}
