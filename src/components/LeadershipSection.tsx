/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import LeadershipCard from "./LeadershipCard";
import SectionHeader from "./widget/SectionHeader";
import { Pyramid } from "lucide-react";

export default function LeadershipSection() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/command-leadership")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a: any, b: any) => a.order - b.order);
        setLeaders(sorted);
      });
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = 300;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 relative">
      {/* HEADER */}
      <div className="">
        <SectionHeader title="HQ ATC LEADERSHIP" icon={Pyramid} />

        {/* 🔥 ARROWS */}
        <div className="flex justify-between items-center gap-2 absolute z-40 right-6 left-0 top-1/2 -translate-y-1/2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow hover:scale-105 transition"
          >
            ←
          </button>

          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow hover:scale-105 transition"
          >
            →
          </button>
        </div>
      </div>

      {/* SCROLLER */}
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 px-6 w-max">
          {leaders.map((leader) => (
            <LeadershipCard key={leader._id} leader={leader} />
          ))}
        </div>
      </div>
    </section>
  );
}
