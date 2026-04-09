"use client";

import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import { fadeInUp } from "./widget/Motion";
import SectionHeader from "./widget/SectionHeader";

const historyParagraphs = [
  {
    content:
      "The Air Training Command (ATC) is one of the 6 field commands of the Nigerian Air Force (NAF). It is an offshoot of the erstwhile Training Command (TC), which was among the foremost commands of the NAF. The TC was responsible for both air and ground training functions in the NAF, however, it was unbundled in 2017 into the Air and Ground Training Commands; headquartered in Kaduna and Enugu, respectively. The splitting of the TC into the Air and Ground Training Commands was borne out of the need for the NAF to expand its Order of Battle, and at the same time, to streamline the span of control of the field commands.",
  },
  {
    content:
      "As a key force sustainment component of the NAF, the ATC is mandated to execute NAF’s local training policies aimed at optimizing all locally available resources for the eventual fulfilment of manpower requirements of the Service. To accomplish this mandate, the ATC is organized into several units with platforms strategically spread across the Country to carry out different assigned roles and responsibilities for the ATC.",
  },
];

export default function ATCHistory() {
  return (
    <section id="history" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 🔰 Section Header */}
        <SectionHeader title="History" icon={Flag} />

        {/* 📦 Card Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-8 md:p-10 relative overflow-hidden"
        >
          {/* 🎨 Decorative Corner */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent" />

          {/* 🧠 Subtle Grid Overlay (your new system) */}
          <div className="absolute inset-0 grid-overlay-primary-soft opacity-40" />

          <div className="relative z-10 space-y-8">
            {historyParagraphs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex items-start gap-4"
              >
                {/* 🟡 Bullet Accent */}
                <div className="mt-2 w-2.5 h-2.5 rounded-full bg-secondary flex-shrink-0" />

                {/* 📜 Text */}
                <p className="text-slate-700 leading-loose text-justify">
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
