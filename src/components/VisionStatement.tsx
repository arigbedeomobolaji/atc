"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import AOC from "../assets/leadership.jpg";

export function VisionStatement() {
  return (
    <div className="py-10 px-5 bg-radial-[at_25%_75%] from-white to-zinc-200 to-85%">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* AOC */}
        <div className="w-1/3">
          <Image src={AOC} alt="AVM XC Jaraf" priority />
        </div>

        {/* Vision Statement Container */}
        <div className="text-center w-2/3">
          <div className="flex flex-col items-center">
            <p className="text-4xl lg:text-5xl text-blue-950/95 font-heading font-extrabold leading-none whitespace-pre-line">
              {`AIR\nOFFICER\nCOMMANDING'S`}
            </p>

            <p className="text-4xl lg:text-9xl text-white font-heading leading-none -mt-2 lg:-mt-5">
              VISION
            </p>
          </div>

          <blockquote className="mt-6 text-gray-700 text-xs sm:text-sm lg:text-base font-sans max-w-md mx-auto leading-relaxed italic border-l-4 border-blue-300 pl-4">
            &quot;To lead in aviation training and operational excellence,
            fostering a generation of airmen and officers equipped with advanced
            skills, strategic thinking, and unwavering discipline, committed to
            safeguarding the nation and advancing airpower capabilities.&quot;
          </blockquote>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 py-1 bg-blue-950/95 hover:bg-blue-700/70 text-white text-sm mt-4 transition-all duration-300 rounded-lg shadow-md font-link"
          >
            Read More
          </motion.button>
        </div>
      </div>
    </div>
  );
}
