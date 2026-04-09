/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "./Motion";
import { Calendar } from "lucide-react";
import { useRef } from "react";

// Timeline Component
export default function Timeline({ items }: { items: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="relative pl-8 md:pl-12"
    >
      {/* Timeline Line */}
      <div className="absolute left-3 md:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1a365d] via-[#c9a227] to-[#1a365d]" />

      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          className="relative mb-8 last:mb-0"
        >
          {/* Timeline Dot */}
          <motion.div
            whileHover={{ scale: 1.3 }}
            className="absolute -left-5 md:-left-6 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#c9a227] to-[#b8941f] border-4 border-white shadow-lg z-10"
          />

          {/* Content Card */}
          <div className="ml-6 bg-white rounded-lg border border-slate-200/60 shadow-sm p-5 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#c9a227]" />
              <span className="text-sm font-semibold text-[#1a365d]">
                {item.date}
              </span>
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">
              {item.title}
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed text-justify">
              {item.event}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
