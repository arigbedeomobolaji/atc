/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import UnitCard from "./UnitCard";
import { useEffect, useState } from "react";
import SectionHeader from "./widget/SectionHeader";
import { Building } from "lucide-react";

export default function UnitsGrid() {
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/units")
      .then((res) => res.json())
      .then(setUnits);
  }, []);

  return (
    <section
      id="units"
      className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#fffdf5] via-[#fdf6e3] to-[#f7efd1]"
    >
      {/* Soft Gold Glow Layers */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#c9a227]/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c9a227]/10 blur-3xl rounded-full" />
      </div>

      {/* Subtle Glass Overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            UNITS UNDER ATC
          </h2>

          <div className="mt-2 flex items-center gap-2">
            <div className="w-16 h-1 bg-[#c9a227] rounded-full" />
            <div className="w-8 h-0.5 bg-gray-400 rounded-full" />
            <div className="w-4 h-0.5 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {units?.map((item) => (
            <Link key={item.slug} href={`/units/${item.slug}`}>
              <UnitCard
                unit={item.unit}
                description={item.description}
                abbreviation={item.abbreviation.toUpperCase()}
                imageSrc={item.logo}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
