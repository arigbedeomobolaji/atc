"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Users } from "lucide-react";
import LeadershipCard from "./LeadershipCard";

interface Leader {
  _id: string;
  name: string;
  rank: string;
  appointment: string;
  appointmentAbbreviation: string;
  image?: string;
  bio?: string;
  awards?: string;
  order: number;
}

export default function LeadershipSection() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/command-leadership")
      .then((r) => r.json())
      .then((data: Leader[]) => {
        const sorted = [...data].sort((a, b) => a.order - b.order);
        setLeaders(sorted);
      });
  }, []);

  // Re-check arrow states whenever leaders render into the DOM
  useEffect(() => {
    if (leaders.length > 0) {
      requestAnimationFrame(updateArrows);
    }
  }, [leaders]);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  }

  return (
    <section className="relative py-24 bg-[hsl(220,64%,13%)] overflow-hidden">
      {/* Radial grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[hsl(45,68%,47%)]/8 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[hsl(350,66%,33%)]/6 blur-3xl pointer-events-none" />

      {/* ── Section header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
              <Users size={18} className="text-[hsl(220,64%,16%)]" />
            </div>
            <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">
              Command Leadership
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-black text-white uppercase tracking-wide">
            HQ ATC Leadership
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-16 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
            <div className="w-8 h-0.5 rounded-full bg-white/20" />
            <div className="w-4 h-0.5 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Scroll arrows */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => scroll("left")}
            disabled={!canLeft}
            aria-label="Scroll left"
            className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canRight}
            aria-label="Scroll right"
            className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>

      {/* ── Scroll track ─── */}
      {leaders.length === 0 ? (
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-[220px] shrink-0 aspect-[3/4] rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={scrollRef}
            onScroll={updateArrows}
            className="overflow-x-auto scrollbar-hide -mr-6 pr-6"
          >
            <div className="flex gap-5 pb-2 w-max">
              {leaders.map((leader, i) => (
                <motion.div
                  key={leader._id}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                >
                  <LeadershipCard leader={leader} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fade edges */}
      <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[hsl(220,64%,13%)] to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-[hsl(220,64%,13%)] to-transparent pointer-events-none" />
    </section>
  );
}
