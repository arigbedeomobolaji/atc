"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Plane } from "lucide-react";
import HQ_ATC from "../assets/NAF_ASSETS/ATC_HQ.jpeg";

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

  // 🎥 Parallax layers
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[75vh] min-h-[500px] w-full overflow-hidden"
    >
      {/* 🌄 Background Image with Parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <Image
          src={HQ_ATC}
          alt="HQ ATC"
          priority
          fill
          className="object-cover object-top"
        />
      </motion.div>

      {/* 🎯 Tactical Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-900/80 to-black/90" />

      {/* Grid */}
      <div className="absolute inset-0 grid-overlay-primary-soft" />

      {/* Glow Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      {/* 🪖 CONTENT */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-16 text-white"
      >
        <div className="max-w-4xl">
          {/* 🔰 Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 text-blue-300 uppercase tracking-[0.3em] text-xs mb-6"
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
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-tight"
          >
            {title}
          </motion.h1>

          {/* 🟦 Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6 }}
            className="w-24 h-1 bg-blue-400 mt-6 mb-6 origin-left"
          />

          {/* 🧠 Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/80 text-base md:text-lg max-w-2xl"
          >
            {description}
          </motion.p>

          {/* 🎯 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex gap-4 mt-8 flex-wrap"
          >
            <button className="px-6 py-3 bg-blue-500 text-white font-semibold uppercase tracking-wide rounded-md hover:bg-blue-400 transition">
              {callToAction}
            </button>

            <button className="px-6 py-3 border border-white/40 text-white uppercase tracking-wide rounded-md hover:bg-white/10 transition">
              Learn More
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* 🔻 Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-blue-400 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
// "use client";

// import { motion, useScroll, useTransform } from "framer-motion";
// import Image from "next/image";
// import { useRef } from "react";
// import HQ_ATC from "../assets/NAF_ASSETS/ATC_HQ.jpeg";
// // import HeroVideo from "../assets/videos/hero_small.mp4";

// interface PageProps {
//   title: string;
//   description: string;
//   callToAction: string;
// }

// export function PageHero({ title, description, callToAction }: PageProps) {
//   const ref = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end start"],
//   });

//   // Parallax transform (moves text slower than scroll)
//   const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
//   const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

//   return (
//     <section ref={ref} className="relative h-[85vh] w-full overflow-hidden">
//       {/* Background Image */}
//       <Image
//         src={HQ_ATC}
//         alt="HQ ATC"
//         priority
//         className="absolute inset-0 w-full h-full object-cover object-top"
//       />

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-linear-to-b from-dark/50 via-dark/80 to-dark/95"></div>

//       {/* Text Layer */}
//       <motion.div
//         style={{ y, opacity }}
//         initial={{ opacity: 0.9, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1.2, ease: "easeOut" }}
//         className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-5"
//       >
//         <div className="bg-white/5 backdrop-blur-xs rounded-md p-4">
//           <h4 className="text-md sm:text-xl lg:text-2xl font-bold tracking-wide mb-4 drop-shadow-lg">
//             {title}
//           </h4>
//         </div>

//         <p className="text-sm sm:text-lg lg:text-xl max-w-2xl text-gray-200 mb-6 font-bold">
//           {description}
//         </p>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="px-6 py-3 bg-blue-950/95 hover:bg-blue-700 transition-all duration-300 rounded-lg shadow-md font-semibold"
//         >
//           {callToAction}
//         </motion.button>
//       </motion.div>

//       {/* Subtle parallax fade gradient at bottom */}
//       <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-black/70 to-transparent"></div>
//     </section>
//   );
// }
