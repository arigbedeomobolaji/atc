/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Timeline } from "@/components/Timeline";
import { CommanderModal } from "@/components/CommanderModal";
import { Gallery } from "@/components/Gallery";
import { StickyNav } from "@/components/StickyNav";
import { useSection } from "@/hooks/useSection";

export default function UnitPageClient({ unit, gallery }: any) {
  const [selectedCommander, setSelectedCommander] = useState(null);

  const sections = useSection([
    "about",
    "responsibilities",
    "capabilities",
    "systems",
    "history",
    "commanders",
    "gallery",
  ]);

  return (
    <>
      {/* 🔥 Sticky Nav */}
      <StickyNav sections={sections} />

      {/* ABOUT */}
      <section id="about" className="py-20 max-w-6xl mx-auto px-6">
        <div className="bg-white p-6 rounded-xl shadow">
          {unit.fullDescription}
        </div>
      </section>

      {/* RESPONSIBILITIES */}
      <section id="responsibilities" className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {unit.responsibilities?.map((r: string, i: number) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow">
              {r}
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3">
          {unit.capabilities?.map((c: string, i: number) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* SYSTEMS */}
      <section id="systems" className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
          {unit.systems?.map((s: string, i: number) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 TIMELINE (Animated) */}
      <section id="history" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Timeline items={unit.history} />
        </div>
      </section>

      {/* 🔥 COMMANDERS */}
      <section id="commanders" className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {unit.commanders?.map((c: any, i: number) => (
            <div
              key={i}
              onClick={() => setSelectedCommander(c)}
              className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <p className="font-semibold text-blue-700">
                {c.rank} {c.name}
              </p>
              <p className="text-sm text-gray-500">{c.serviceNumber}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 MODAL */}
      {selectedCommander && (
        <CommanderModal
          commander={selectedCommander}
          onClose={() => setSelectedCommander(null)}
        />
      )}

      {/* 🔥 REAL GALLERY */}
      <section id="gallery" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Gallery images={gallery} />
        </div>
      </section>
    </>
  );
}
