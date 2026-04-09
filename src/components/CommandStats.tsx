/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Plane, Target, Medal, Users, Pyramid } from "lucide-react";
import SectionHeader from "./widget/SectionHeader";

// ================= ANIMATIONS =================
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

// ================= COUNT-UP HOOK =================
function useCountUp(end: number, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [end, duration]);

  return count;
}

// ================= STAT CARD COMPONENT =================
function StatCard({
  label,
  value,
  suffix,
  Icon,
}: {
  label: string;
  value: number;
  suffix?: string;
  Icon: any;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useCountUp(isInView ? value : 0);

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative bg-white rounded-xl border border-slate-200/60 shadow-md p-6 text-center group overflow-hidden"
    >
      {/* Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a365d] to-[#c9a227]" />

      {/* Icon */}
      <div className="mb-4 flex justify-center">
        <div className="p-3 rounded-lg bg-gradient-to-br from-[#1a365d] to-[#2d5a9d] shadow-lg group-hover:scale-110 transition">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Number */}
      <h4 className="text-3xl md:text-4xl font-bold text-[#1a365d]">
        {count}
        {suffix}
      </h4>

      {/* Label */}
      <p className="text-slate-500 text-sm uppercase tracking-wide mt-2">
        {label}
      </p>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition pointer-events-none ring-2 ring-[#c9a227]/30" />
    </motion.div>
  );
}

// ================= MAIN COMPONENT =================
export default function CommandStats() {
  const stats = [
    { label: "Training Units", value: 12, suffix: "+", icon: Plane },
    { label: "Flying Schools", value: 5, suffix: "", icon: Target },
    { label: "Years Experience", value: 30, suffix: "+", icon: Medal },
    { label: "Personnel Trained", value: 1000, suffix: "+", icon: Users },
  ];

  return (
    <section className="py-20 px-6 bg-slate-100">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="Command Strength Overview" icon={Pyramid} />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              Icon={stat.icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
