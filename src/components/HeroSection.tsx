"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Plane } from "lucide-react";
import Link from "next/link";
import HQ_ATC from "../assets/NAF_ASSETS/ATC_HQ.jpeg";

export function HeroSection() {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative h-[80vh] min-h-[500px] overflow-hidden"
    >
      <div></div>
      {/* 🎥 VIDEO BACKGROUND */}
      <motion.video
        style={{ y }}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-small.mp4" type="video/mp4" />
        {/* 🛟 Fallback */}
        Your browser does not support the video tag.
      </motion.video>

      {/* 🛟 IMAGE FALLBACK (for slow networks / video fail) */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop')",
          transform: `translateY(${10 * 0.3}px)`,
        }}
      />

      <div></div>
      {/* 🎯 Tactical Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-black/90" />

      {/* 🧠 Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* 🪖 CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-center px-6 lg:px-16">
        <div className="max-w-5xl">
          {/* 🔰 Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 text-secondary uppercase tracking-[0.3em] text-xs mb-6"
          >
            <Plane className="w-5 h-5" />
            Nigerian Air Force
            <Plane className="w-5 h-5 scale-x-[-1]" />
          </motion.div>

          {/*  Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-tight"
          >
            Air Training <br />
            Command Kaduna
          </motion.h1>

          {/* 🟡 Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6 }}
            className="w-24 h-1 bg-secondary mt-6 mb-6 origin-left"
          />

          {/* 🧠 Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/80 text-base md:text-lg max-w-2xl"
          >
            Delivering advanced aviation training, operational excellence, and
            disciplined leadership for the Nigerian Air Force.
          </motion.p>

          {/* 🎯 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex gap-4 mt-8 flex-wrap"
          >
            <Link
              href="#units"
              className="px-6 py-3 bg-secondary text-black font-semibold uppercase tracking-wide rounded-md hover:opacity-90 transition"
            >
              Explore Units
            </Link>

            <Link
              href="/about/organization"
              className="px-6 py-3 border border-white/40 text-white uppercase tracking-wide rounded-md hover:bg-white/10 transition"
            >
              View Command Structure
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 🔻 Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-secondary rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
