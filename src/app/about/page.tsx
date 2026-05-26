import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ATCHistory from "@/components/ATCHistory";
import ATCAchievements from "@/components/ATCAchievement";
import Link from "next/link";
import { Radio, ArrowRight, Building2, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[hsl(220,64%,8%)]">
      <Navbar />

      {/* ── Page hero ── */}
      <section className="relative bg-[hsl(220,64%,8%)] pt-20 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-64 bg-[hsl(45,68%,47%)]/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[hsl(350,66%,33%)]/6 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-5">
            <Radio size={11} className="text-[hsl(350,66%,55%)] animate-pulse" />
            <span className="text-[hsl(45,68%,47%)] text-[11px] font-black uppercase tracking-[0.3em]">
              Nigerian Air Force
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-tight tracking-wide mb-4">
            About Air Training<br className="hidden md:block" /> Command
          </h1>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-20 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
            <div className="w-10 h-0.5 rounded-full bg-white/20" />
          </div>
          <p className="text-white/55 text-base max-w-2xl leading-relaxed mb-10">
            One of six field commands of the Nigerian Air Force, the Air Training
            Command is headquartered in Kaduna and mandated to execute advanced
            aviation training, doctrine development, and capacity-building
            programmes across the country.
          </p>

          {/* Quick-nav chips */}
          <div className="flex flex-wrap gap-3">
            <a
              href="#history"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white/70 text-sm font-semibold hover:bg-white/[0.1] hover:text-white transition-all duration-200"
            >
              History &amp; Background
              <ArrowRight size={13} />
            </a>
            <a
              href="#achievements"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white/70 text-sm font-semibold hover:bg-white/[0.1] hover:text-white transition-all duration-200"
            >
              Key Milestones
              <ArrowRight size={13} />
            </a>
            <Link
              href="/about/organization"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[hsl(45,68%,47%)]/15 border border-[hsl(45,68%,47%)]/30 text-[hsl(45,68%,47%)] text-sm font-semibold hover:bg-[hsl(45,68%,47%)]/25 transition-all duration-200"
            >
              <Building2 size={13} />
              View Organogram
            </Link>
          </div>
        </div>
      </section>

      {/* ── History ── */}
      <ATCHistory />

      {/* ── Achievements ── */}
      <ATCAchievements />

      {/* ── CTA band ── */}
      <section className="bg-[hsl(45,68%,47%)] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading font-black text-[hsl(220,64%,16%)] uppercase text-xl tracking-wide">
              Explore Our Organization
            </h3>
            <p className="text-[hsl(220,64%,30%)] text-sm mt-1">
              See the full command structure and units under ATC.
            </p>
          </div>
          <Link
            href="/about/organization"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(220,64%,16%)] text-white font-black text-sm uppercase tracking-wide hover:bg-[hsl(220,64%,22%)] transition-colors shadow-lg shrink-0"
          >
            <Award size={16} />
            View Organogram
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
