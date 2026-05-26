"use client";

import { motion } from "framer-motion";
import { Flag, BookOpen } from "lucide-react";

const PARAGRAPHS = [
  "The Air Training Command (ATC) is one of the 6 field commands of the Nigerian Air Force (NAF). It is an offshoot of the erstwhile Training Command (TC), which was among the foremost commands of the NAF. The TC was responsible for both air and ground training functions in the NAF, however, it was unbundled in 2017 into the Air and Ground Training Commands; headquartered in Kaduna and Enugu, respectively. The splitting of the TC into the Air and Ground Training Commands was borne out of the need for the NAF to expand its Order of Battle, and at the same time, to streamline the span of control of the field commands.",
  "As a key force sustainment component of the NAF, the ATC is mandated to execute NAF's local training policies aimed at optimizing all locally available resources for the eventual fulfilment of manpower requirements of the Service. To accomplish this mandate, the ATC is organized into several units with platforms strategically spread across the Country to carry out different assigned roles and responsibilities for the ATC.",
];

export default function ATCHistory() {
  return (
    <section id="history" className="relative py-24 bg-[hsl(220,64%,10%)] overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-[hsl(45,68%,47%)]/6 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-10 h-10 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
            <Flag size={18} className="text-[hsl(220,64%,16%)]" />
          </div>
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-black text-white uppercase tracking-wide">
              History &amp; Background
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-16 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
              <div className="w-8 h-0.5 rounded-full bg-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Timeline-style paragraphs */}
        <div className="grid lg:grid-cols-2 gap-8">
          {PARAGRAPHS.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="relative p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[hsl(45,68%,47%)]/30 transition-colors duration-300 group"
            >
              {/* Number badge */}
              <div className="absolute -top-3.5 left-6 w-7 h-7 rounded-full bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-xs font-black flex items-center justify-center shadow-lg">
                {i + 1}
              </div>

              <div className="flex items-start gap-4 pt-2">
                <BookOpen
                  size={18}
                  className="text-[hsl(45,68%,47%)]/60 mt-0.5 shrink-0 group-hover:text-[hsl(45,68%,47%)] transition-colors duration-200"
                />
                <p className="text-white/65 text-sm leading-relaxed">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
