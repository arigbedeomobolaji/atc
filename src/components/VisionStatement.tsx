"use client";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { Goal, Medal } from "lucide-react";
import { abbrevRank } from "@/lib/rankAbbr";

interface VisionStatementProps {
  imageSrc: string | StaticImageData;
  name: string;
  rank: string;
  appointment: string;
  statementType: "Vision" | "Mission";
  statement: string;
}

export function VisionStatement({
  imageSrc,
  name,
  rank,
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
            <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-[hsl(45,68%,47%)]/50">
              <Image
                src={imageSrc}
                alt={name}
                fill
                className="object-cover"
              />
              {/* Bottom overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,8%)]/80 via-transparent to-transparent" />

              {/* Rank badge */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Medal size={14} className="text-[hsl(45,68%,47%)]" />
                  <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.2em]">
                    {rank}
                  </span>
                </div>
                <p className="text-white font-bold text-sm">{name}</p>
                <p className="text-white/55 text-xs mt-0.5">{appointment}</p>
              </div>
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
