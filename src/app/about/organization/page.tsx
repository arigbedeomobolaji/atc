import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Organogram from "@/components/Organogram";
import { Radio, Network, Info } from "lucide-react";

export default function OrganizationPage() {
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

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-5">
            <Radio size={11} className="text-[hsl(350,66%,55%)] animate-pulse" />
            <span className="text-[hsl(45,68%,47%)] text-[11px] font-black uppercase tracking-[0.3em]">
              Command Structure
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-tight tracking-wide mb-4">
            Organization &amp;<br className="hidden md:block" /> Organogram
          </h1>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-20 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
            <div className="w-10 h-0.5 rounded-full bg-white/20" />
          </div>
          <p className="text-white/55 text-base max-w-xl leading-relaxed">
            The Air Training Command is structured around the Air Officer
            Commanding, with Principal Staff Officers, subordinate units, and
            schools distributed strategically across Nigeria.
          </p>
        </div>
      </section>

      {/* ── Organogram ── */}
      <section className="bg-[hsl(220,64%,10%)] py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
              <Network size={16} className="text-[hsl(220,64%,16%)]" />
            </div>
            <div>
              <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">
                Interactive Chart
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="w-10 h-0.5 rounded-full bg-[hsl(45,68%,47%)]" />
                <div className="w-5 h-px rounded-full bg-white/20" />
              </div>
            </div>
          </div>

          {/* Hint */}
          <div className="flex items-center gap-2 mb-5 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 w-fit">
            <Info size={13} className="text-[hsl(45,68%,47%)] shrink-0" />
            <p className="text-white/50 text-xs">
              Drag to pan · Scroll to zoom · Click nodes to expand
            </p>
          </div>

          {/* Flow chart */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Organogram />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
