/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Timeline } from "@/components/Timeline";
import { CommanderModal } from "@/components/CommanderModal";
import { Gallery } from "@/components/Gallery";
import { StickyNav } from "@/components/StickyNav";
import { useSection } from "@/hooks/useSection";
import { ShieldCheck, Cpu, Wrench } from "lucide-react";
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg md:text-xl font-semibold text-blue-900/80 uppercase font-opensans">
        {title}
      </h2>
      <div className="w-32 h-1 bg-yellow-100 mt-2 rounded-full" />
    </div>
  );
}

export default function UnitPageClient({ unit, gallery }: any) {
  const [selectedCommander, setSelectedCommander] = useState(null);

  const about = useSection("about");
  const responsibilities = useSection("responsibilities");
  const capabilities = useSection("capabilities");
  const systems = useSection("systems");
  const history = useSection("history");
  const commanders = useSection("commanders");
  const gallerySection = useSection("gallery");

  const sections = [
    about,
    responsibilities,
    capabilities,
    systems,
    history,
    commanders,
    gallerySection,
  ];
  return (
    <div className="font-opensans">
      {/* 🔥 Sticky Nav
      <StickyNav sections={sections} /> */}

      {/* ABOUT */}
      <section id="about" className="py-7 max-w-6xl mx-auto px-6">
        <SectionHeader title="About the Unit" />
        <div className="bg-white p-6 rounded-xl shadow-sm shadow-blue-100 max-w-4xl mx-auto">
          <p className="text-gray-700 leading-loose text-[16px] tracking-wide font-opensans text-justify">
            {unit.fullDescription}
          </p>
        </div>
      </section>

      {/* RESPONSIBILITIES */}
      <section id="responsibilities" className="py-16 bg-[#f8fafc] px-6">
        <SectionHeader title="Core Responsibilities" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mt-10">
          {unit.responsibilities?.map((r: string, i: number) => (
            <div
              key={i}
              className="group flex gap-4 items-center bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition"
            >
              {/* ICON */}
              <div className="p-3 rounded-lg bg-blue-50">
                <ShieldCheck className="text-[#1E3A8A] w-5 h-5" />
              </div>

              {/* TEXT */}
              <p className="text-gray-700 leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="py-16 px-6">
        <SectionHeader title="Unit Capabilities" />

        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 mt-8">
          {unit.capabilities?.map((c: string, i: number) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-blue-50 text-[#1E3A8A] px-4 py-2 rounded-full border border-blue-100"
            >
              <Cpu className="w-4 h-4" />
              <span className="text-sm font-medium">{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SYSTEMS */}
      <section id="systems" className="py-16 bg-[#f8fafc] px-6">
        <SectionHeader title="Unit Systems / Equipment" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-8">
          {unit.systems?.map((s: string, i: number) => (
            <div
              key={i}
              className="group flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition"
            >
              {/* ICON */}
              <div className="p-2 bg-blue-50 rounded-lg">
                <Wrench className="text-[#1E3A8A] w-4 h-4" />
              </div>

              {/* TEXT */}
              <p className="text-gray-700 text-sm font-medium">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 TIMELINE (Animated) */}
      <section id="history" className="py-7 px-6">
        <SectionHeader title="Unit History Timeline" />
        <div className="max-w-5xl mx-auto">
          <Timeline items={unit.history} />
        </div>
      </section>

      {/* 🔥 COMMANDERS */}
      <section id="commanders" className="py-7 bg-gray-50 px-6">
        <SectionHeader title="Unit Past Commanders" />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {unit.commanders?.map((c: any, i: number) => (
            <div
              key={i}
              onClick={() => setSelectedCommander(c)}
              className="font-opensans w-70 bg-white p-5 rounded-sm shadow-sm shadow-blue-100 hover:shadow-md hover:border-blue-200 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-[#1E3A8A] rounded-full" />

                <div>
                  <p className="font-semibold text-[#1E3A8A] text-sm">
                    {c.rank} {c.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {c.startDate} — {c.endDate || "Present"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* current commander Portrait */}

      {/* 🔥 REAL GALLERY */}
      <section id="gallery" className="py-7 px-6">
        <div className="max-w-6xl mx-auto">
          <Gallery images={gallery} />
        </div>
      </section>
    </div>
  );
}
