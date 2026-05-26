"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Plane, Target, Medal, Users, Pyramid } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let frame = 0;
    const totalFrames = Math.round((duration / 1000) * 60);
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * ease));
      if (frame >= totalFrames) {
        setCount(target);
        clearInterval(timer);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCard({
  label,
  value,
  suffix,
  Icon,
  delay,
}: {
  label: string;
  value: number;
  suffix?: string;
  Icon: React.ElementType;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(inView ? value : 0);

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      custom={delay}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative flex flex-col items-center text-center p-8 rounded-2xl overflow-hidden group"
    >
      {/* Glassmorphism card */}
      <div className="absolute inset-0 rounded-2xl bg-white/6 border border-white/10 group-hover:bg-white/10 transition-colors duration-300" />

      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1 ring-[hsl(45,68%,47%)]/40" />

      {/* Icon */}
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(45,68%,47%)]/15 border border-[hsl(45,68%,47%)]/30 flex items-center justify-center shadow-lg group-hover:bg-[hsl(45,68%,47%)]/25 transition-colors duration-300">
          <Icon className="w-6 h-6 text-[hsl(45,68%,47%)]" />
        </div>
      </div>

      {/* Number */}
      <div className="relative mb-2">
        <span className="font-heading text-5xl font-black text-white tracking-tight">
          {count}
        </span>
        <span className="font-heading text-3xl font-black text-[hsl(45,68%,47%)]">
          {suffix}
        </span>
      </div>

      {/* Label */}
      <p className="relative text-white/50 text-xs uppercase tracking-[0.2em] font-semibold">
        {label}
      </p>
    </motion.div>
  );
}

const STATS = [
  { label: "Training Units", value: 12, suffix: "+", icon: Plane },
  { label: "Flying Schools", value: 5, suffix: "", icon: Target },
  { label: "Years of Excellence", value: 30, suffix: "+", icon: Medal },
  { label: "Personnel Trained", value: 1000, suffix: "+", icon: Users },
];

export default function CommandStats() {
  return (
    <section className="relative py-24 bg-[hsl(220,64%,16%)] overflow-hidden">
      {/* Diagonal stripe */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 50%)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Center glow */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 bg-[hsl(45,68%,47%)]/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
              <Pyramid size={18} className="text-[hsl(220,64%,16%)]" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-black text-white uppercase tracking-wide">
            Command At A Glance
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="w-16 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
            <div className="w-8 h-0.5 rounded-full bg-white/20" />
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {STATS.map((s, i) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              suffix={s.suffix}
              Icon={s.icon}
              delay={i * 0.12}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
