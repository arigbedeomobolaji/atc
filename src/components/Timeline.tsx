/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";

export function Timeline({ items }: { items: any[] }) {
  return (
    <div className="relative border-l-2 border-blue-300 pl-8 space-y-12">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.15,
            ease: "easeOut",
          }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* 🔵 DOT */}
          <div className="absolute -left-[34px] top-2 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow" />

          {/* 🔥 CARD */}
          <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <p className="text-blue-600 font-semibold text-sm mb-1">
              {item.date}
            </p>
            <p className="text-gray-700 leading-relaxed">{item.event}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
