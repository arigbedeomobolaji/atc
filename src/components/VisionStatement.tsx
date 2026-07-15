"use client";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { Goal, Medal } from "lucide-react";
import { abbrevRank } from "@/lib/rankAbbr";

interface VisionStatementProps {
  imageSrc: string | StaticImageData;
  name: string;
  rank: string;
  awards?: string;
  appointment: string;
  statementType: "Vision" | "Mission";
  statement: string;
}

export function VisionStatement({
  imageSrc,
  name,
  rank,
  awards,
  appointment,
  statementType,
  statement,
}: VisionStatementProps) {
  return (
    <section
      id="leadership"
      className="relative py-24 bg-[hsl(220,64%,12%)] overflow-hidden"
    >
      {/* Diagonal stripe */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[hsl(45,68%,47%)]/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[hsl(350,66%,33%)]/6 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-14"
        >
          <div className="w-10 h-10 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
            <Goal size={18} className="text-[hsl(220,64%,16%)]" />
          </div>
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-black text-white uppercase tracking-wide">
              {statementType} Statement
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-16 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
              <div className="w-8 h-0.5 rounded-full bg-white/20" />
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="relative"
          >
            {/* Image — top */}
            <div className="relative w-full max-w-sm mx-auto rounded-t-2xl overflow-hidden shadow-2xl border-x-2 border-t-2 border-[hsl(45,68%,47%)]/50">
              <Image
                src={imageSrc}
                alt={name}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Caption panel — below the image */}
            <div className="w-full max-w-sm mx-auto bg-[hsl(220,64%,7%)] border border-t-0 border-[hsl(45,68%,47%)]/30 rounded-b-2xl px-5 py-4">
              {/* Rank */}
              <div className="flex items-center gap-1.5 mb-2">
                <Medal size={11} className="text-[hsl(45,68%,47%)] shrink-0" />
                <span className="text-[hsl(45,68%,47%)] text-[10px] font-bold uppercase tracking-[0.25em]">
                  {rank}
                </span>
              </div>
              {/* Bold name + awards */}
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-white font-black text-sm uppercase leading-none">
                  {name}
                </p>
                {awards && (
                  <span className="text-white/45 text-[9px] font-medium tracking-wide leading-none">
                    {awards}
                  </span>
                )}
              </div>
              {/* Appointment */}
              <p className="text-white/65 text-[11px] uppercase tracking-wide leading-snug mt-1">
                {appointment}
              </p>
              {/* Service */}
              <p className="text-[hsl(45,68%,47%)] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                Nigerian Air Force
              </p>
            </div>

            {/* Corner brackets */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-[hsl(45,68%,47%)] rounded-tl-xl" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-[hsl(45,68%,47%)] rounded-br-xl" />
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-white space-y-6"
          >
            <div>
              <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">
                {appointment}
              </span>
              <h2 className="font-heading text-5xl md:text-6xl font-black uppercase leading-tight mt-2">
                {statementType}
              </h2>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-16 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
                <div className="w-8 h-0.5 rounded-full bg-white/20" />
              </div>
            </div>

            <blockquote className="relative pl-5 border-l-2 border-[hsl(45,68%,47%)]">
              <p className="text-white/70 text-base md:text-lg leading-relaxed italic">
                {statement}
              </p>
            </blockquote>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(45,68%,47%)]/10 border border-[hsl(45,68%,47%)]/20">
                <div className="w-2 h-2 rounded-full bg-[hsl(45,68%,47%)]" />
                <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-wider">
                  {name} &mdash; {abbrevRank(rank)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
