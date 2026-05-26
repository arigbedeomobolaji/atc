"use client";

import Link from "next/link";
import UnitCard from "./UnitCard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, ChevronRight } from "lucide-react";

export default function UnitsGrid() {
  const [units, setUnits] = useState<
    {
      _id: string;
      slug: string;
      unit: string;
      abbreviation: string;
      description: string;
      location?: string;
      logo?: string;
    }[]
  >([]);

  useEffect(() => {
    fetch("/api/units")
      .then((r) => r.json())
      .then(setUnits);
  }, []);

  return (
    <section
      id="units"
      className="relative py-24 overflow-hidden bg-[hsl(220,64%,16%)]"
    >
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Gold glow top-right */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[hsl(45,68%,47%)]/10 blur-3xl pointer-events-none" />
      {/* Crimson glow bottom-left */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[hsl(350,66%,33%)]/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
                <Building2 size={18} className="text-[hsl(220,64%,16%)]" />
              </div>
              <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">
                Formations
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-black text-white uppercase tracking-wide">
              Units Under ATC
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-16 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
              <div className="w-8 h-0.5 rounded-full bg-white/20" />
              <div className="w-4 h-0.5 rounded-full bg-white/10" />
            </div>
          </div>

          <Link
            href="/about/organization"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all duration-200 self-start sm:self-auto"
          >
            View Structure
            <ChevronRight size={15} />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link href={`/units/${item.slug}`} className="block h-full">
                <UnitCard
                  unit={item.unit}
                  description={item.description}
                  abbreviation={item.abbreviation.toUpperCase()}
                  location={item.location}
                  imageSrc={item.logo}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
