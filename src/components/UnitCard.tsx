"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Shield } from "lucide-react";

interface UnitCardProps {
  unit: string;
  description: string;
  abbreviation: string;
  location?: string;
  imageSrc?: string;
}

export default function UnitCard({
  unit,
  description,
  abbreviation,
  location,
  imageSrc,
}: UnitCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover="hover"
      className="group relative flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500 bg-white h-full cursor-pointer"
    >
      {/* ── Header band ─── */}
      <div className="relative h-[160px] bg-[hsl(220,64%,16%)] overflow-hidden shrink-0">
        {/* Diagonal stripe pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Corner crimson accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[hsl(350,66%,33%)]/20 rounded-bl-full" />

        {/* Logo or abbreviation emblem */}
        <div className="absolute inset-0 flex items-center justify-center">
          {imageSrc ? (
            <div className="relative w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-xl">
              <Image
                src={imageSrc}
                alt={abbreviation}
                fill
                className="object-contain p-2"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[hsl(45,68%,47%)]/15 border border-[hsl(45,68%,47%)]/40 flex items-center justify-center shadow-xl">
              <span className="font-heading text-2xl font-black text-[hsl(45,68%,47%)] tracking-wider">
                {abbreviation.slice(0, 3)}
              </span>
            </div>
          )}
        </div>

        {/* Abbreviation pill */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-[10px] font-black uppercase tracking-[0.15em] shadow">
            <Shield size={9} />
            {abbreviation}
          </span>
        </div>

        {/* Arrow — appears on hover */}
        <motion.div
          variants={{ hover: { opacity: 1, scale: 1 } }}
          initial={{ opacity: 0, scale: 0.8 }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow"
        >
          <ArrowUpRight size={14} className="text-[hsl(220,64%,16%)]" />
        </motion.div>

        {/* Bottom gradient fade into body */}
        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* ── Body ─── */}
      <div className="flex flex-col flex-1 p-5 pt-3">
        <h3 className="font-heading text-[15px] font-bold text-[hsl(220,64%,16%)] uppercase tracking-wide leading-snug line-clamp-2">
          {unit}
        </h3>

        {location && (
          <div className="flex items-center gap-1.5 mt-1.5 mb-2">
            <MapPin size={11} className="text-[hsl(45,68%,47%)] shrink-0" />
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              {location}
            </span>
          </div>
        )}

        <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>

        {/* CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] text-[hsl(220,64%,16%)] font-semibold uppercase tracking-widest">
            Explore Unit
          </span>
          <div className="w-8 h-8 rounded-full border-2 border-[hsl(220,64%,16%)]/20 flex items-center justify-center group-hover:bg-[hsl(220,64%,16%)] group-hover:border-[hsl(220,64%,16%)] transition-colors duration-300">
            <ArrowUpRight
              size={14}
              className="text-[hsl(220,64%,16%)] group-hover:text-white transition-colors duration-300"
            />
          </div>
        </div>
      </div>

      {/* ── Animated bottom accent ─── */}
      <motion.div
        variants={{ hover: { scaleX: 1 } }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.35 }}
        className="h-[3px] w-full bg-gradient-to-r from-[hsl(220,64%,16%)] via-[hsl(350,66%,33%)] to-[hsl(45,68%,47%)] origin-left"
      />
    </motion.article>
  );
}
