"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import HQ_ATC from "../assets/NAF_ASSETS/ATC_HQ.jpeg";
// import HeroVideo from "../assets/videos/hero_small.mp4";

interface PageProps {
  title: string;
  description: string;
  callToAction: string;
}

export function PageHero({ title, description, callToAction }: PageProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax transform (moves text slower than scroll)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={HQ_ATC}
        alt="HQ ATC"
        priority
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-dark/50 via-dark/80 to-dark/95"></div>

      {/* Text Layer */}
      <motion.div
        style={{ y, opacity }}
        initial={{ opacity: 0.9, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-5"
      >
        <div className="bg-white/5 backdrop-blur-xs rounded-md p-4">
          <h1 className="text-md sm:text-xl md:text-2xl font-bold tracking-wide mb-4 drop-shadow-lg">
            {title}
          </h1>
        </div>

        <p className="text-sm sm:text-lg md:text-xl max-w-2xl text-gray-200 mb-6 font-bold">
          {description}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-blue-950/95 hover:bg-blue-700 transition-all duration-300 rounded-lg shadow-md font-semibold"
        >
          {callToAction}
        </motion.button>
      </motion.div>

      {/* Subtle parallax fade gradient at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-black/70 to-transparent"></div>
    </section>
  );
}
