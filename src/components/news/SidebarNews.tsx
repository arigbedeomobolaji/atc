"use client";

import { convertDate } from "@/utils/covertDate";
import { NewsItemType } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Newspaper, ArrowRight, Calendar } from "lucide-react";

interface SidebarNewsProps {
  slug: string;
  news: NewsItemType[];
  layout?: "responsive" | "horizontal";
}

export function SidebarNews({ slug, news }: SidebarNewsProps) {
  const filtered = useMemo(
    () => news.filter((item) => item.slug !== slug).slice(0, 6),
    [news, slug]
  );

  return (
    <section className="relative py-24 bg-[hsl(220,64%,10%)] overflow-hidden">
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top center glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-[hsl(45,68%,47%)]/6 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
                <Newspaper size={18} className="text-[hsl(220,64%,16%)]" />
              </div>
              <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">
                Latest Updates
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-black text-white uppercase tracking-wide">
              News &amp; Events
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-16 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
              <div className="w-8 h-0.5 rounded-full bg-white/20" />
              <div className="w-4 h-0.5 rounded-full bg-white/10" />
            </div>
          </div>

          <Link
            href="/news"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all duration-200 self-start sm:self-auto"
          >
            All Articles
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link
                href={`/news/${item.slug}`}
                className="group block h-full bg-white/[0.04] rounded-2xl overflow-hidden border border-white/10 hover:border-[hsl(45,68%,47%)]/40 hover:bg-white/[0.07] transition-all duration-300"
              >
                {/* Cover image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={item.coverImage || "/images/placeholder-rect.jpeg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,8%)]/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 mb-3 text-[hsl(45,68%,47%)] text-[11px] font-semibold uppercase tracking-wider">
                    <Calendar size={11} />
                    {convertDate(item.createdAt)}
                  </div>

                  <h4 className="text-white font-bold text-base leading-snug line-clamp-2 mb-2 group-hover:text-[hsl(45,68%,47%)] transition-colors duration-200">
                    {item.title}
                  </h4>

                  <p className="text-white/45 text-sm leading-relaxed line-clamp-2 mb-4">
                    {item.excerpt?.slice(0, 100)}
                  </p>

                  <div className="flex items-center gap-1.5 text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-wide">
                    Read More
                    <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
