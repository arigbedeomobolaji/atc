/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface UnitCardProps {
  unit: string;
  description: string;
  abbreviation: string;
  imageSrc?: any;
}

export default function UnitCard({
  unit,
  description,
  abbreviation,
  imageSrc,
}: UnitCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group bg-white/80 backdrop-blur-md border border-black/5 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
    >
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden bg-zinc-100">
        {/* Placeholder Image */}
        {imageSrc ? (
          <div className="relative w-full h-40 rounded-lg overflow-hidden">
            {/* Background Image */}
            <Image
              src={imageSrc}
              alt={abbreviation}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover blur-md"
            />

            {/* Foreground Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={imageSrc}
                alt={abbreviation}
                width={120}
                height={120}
                priority
                style={{ width: "auto", height: "auto" }}
                className="rounded-full object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-40 bg-yellow-50 rounded-xl flex items-center justify-center font-heading text-2xl text-primary">
            {abbreviation.toUpperCase()}
          </div>
        )}

        {/* Top Label */}
        <div className="absolute top-3 left-3">
          <div
            className="px-3 py-1 rounded-full text-[12px] tracking-widest 
    bg-linear-to-r from-primary/70 to-blue-900/95
    text-white font-bold shadow-sm"
          >
            {abbreviation}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="relative p-5 flex flex-col flex-1">
        {/* Glass Background Layer */}
        <div
          className="absolute inset-0 rounded-b-xl 
    bg-gradient-to-br from-white/80 via-sky-100/40 to-blue-200/30 
    backdrop-blur-md"
        />

        <div className="relative z-10 flex flex-col flex-1">
          <h3 className="text-[17px] font-semibold text-gray-900 leading-snug">
            {unit}
          </h3>

          <p className="text-gray-600 text-sm mt-2 line-clamp-3 leading-relaxed">
            {description.substring(0, 50)}...
          </p>

          {/* Footer */}
          <div className="mt-auto pt-5 flex items-center justify-between">
            <span className="text-xs text-gray-500 tracking-wide">
              Explore Unit
            </span>

            <div
              className="w-8 h-8 flex items-center justify-center rounded-full 
        bg-white/60 backdrop-blur-md border border-gray-200 
        text-gray-600 
        group-hover:bg-sky-100 
        group-hover:border-sky-300 
        group-hover:text-sky-700 
        transition"
            >
              →
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Accent Glow */}
      <div
        className="h-[2px] w-0 group-hover:w-full 
  bg-gradient-to-r from-sky-400 to-blue-500 
  transition-all duration-300"
      />{" "}
    </motion.div>
  );
}
