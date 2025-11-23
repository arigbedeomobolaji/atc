"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
// import HeroVideo from "../assets/videos/hero_small.mp4";

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax transform (moves text slower than scroll)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero_small.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/80"></div>

      {/* Text Layer */}
      <motion.div
        style={{ y, opacity }}
        initial={{ opacity: 0.9, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-5"
      >
        <div className="bg-white/5 rounded-lg p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide mb-4 drop-shadow-lg">
            AIR TRAINING COMMAND, KADUNA
          </h1>
        </div>

        <p className="text-sm sm:text-lg md:text-xl max-w-2xl text-gray-200 mb-6">
          Where precision meets excellence. Training tomorrow’s air warriors
          today.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-blue-950/95 hover:bg-blue-700 transition-all duration-300 rounded-lg shadow-md font-semibold"
        >
          Learn More
        </motion.button>
      </motion.div>

      {/* Subtle parallax fade gradient at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-black/70 to-transparent"></div>
    </section>
  );
}
