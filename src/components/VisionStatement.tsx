"use client";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import {
  fadeInLeft,
  fadeInRight,
  fadeInUp,
  staggerContainer,
} from "./widget/Motion";
import { Goal, Medal, User } from "lucide-react";

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
    <>
      <section
        id="leadership"
        className="py-16 px-6 bg-gradient-to-br from-[#1a365d] to-[#0f2744] relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white/30 rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex items-center gap-4 mb-10"
          >
            <div className="p-3 rounded-lg bg-[#c9a227]">
              <Goal className="w-6 h-6 text-[#1a365d]" />
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">
                {statementType.toUpperCase()} STATEMENT
              </h4>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-16 h-1 bg-[#c9a227] rounded-full" />
                <div className="w-8 h-0.5 bg-white/30 rounded-full" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            {/* Image */}
            <motion.div variants={fadeInLeft} className="relative">
              <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-4 border-[#c9a227]">
                <Image
                  src={imageSrc}
                  alt={name}
                  fill
                  className="w-full h-full object-cover"
                />
                {/* Rank Badge */}
                <div className="absolute -top-1 left-0 right-0 bg-gradient-to-t from-[#1a365d] to-transparent py-2 px-6">
                  <div className="flex items-center gap-2">
                    <Medal className="w-5 h-5 text-[#c9a227]" />
                    <span className="text-white font-semibold">{rank}</span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-[#c9a227] rounded-tl-xl" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-[#c9a227] rounded-br-xl" />
            </motion.div>

            {/* Details */}
            <motion.div variants={fadeInRight} className="text-white space-y-6">
              <div className="mb-6">
                <h2 className="tracking-[0.3em] text-[#c9a227] uppercase">
                  {appointment}
                </h2>

                <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mt-2">
                  {statementType}
                </h2>

                {/* Divider */}
                <div className="flex md:justify-start items-center gap-2 mt-4">
                  <div className="w-12 h-[2px] bg-[#c9a227]" />
                  <div className="w-6 h-[1px] bg-white/30" />
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-white/80 italic leading-relaxed max-w-xl mx-auto md:mx-0 border-l-4 border-[#c9a227] pl-4">
                {statement}
              </blockquote>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
