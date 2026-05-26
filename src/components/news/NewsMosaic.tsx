"use client";

import { convertDate } from "@/utils/covertDate";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Star } from "lucide-react";

export type NewsItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  createdAt: string;
};

const FALLBACK = "/images/placeholder-rect.jpeg";

export function NewsMosaic({ news }: { news: NewsItem[] }) {
  if (!news?.length) return null;
  const [featured, ...rest] = news;

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      {/* Featured large card */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65 }}
        className="lg:col-span-3"
      >
        <Link
          href={`/news/${featured.slug}`}
          className="group relative flex h-[500px] rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src={featured.coverImage || FALLBACK}
            alt={featured.title}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,6%)]/95 via-[hsl(220,64%,16%)]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,64%,6%)]/40 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-2 mb-3">
              <Star
                size={10}
                className="text-[hsl(45,68%,47%)] fill-[hsl(45,68%,47%)]"
              />
              <span className="text-[hsl(45,68%,47%)] text-[11px] font-black uppercase tracking-[0.3em]">
                Featured
              </span>
            </div>

            <h2 className="font-heading text-2xl md:text-3xl font-black text-white uppercase leading-tight tracking-wide line-clamp-3 mb-3">
              {featured.title}
            </h2>

            <div className="w-12 h-0.5 bg-[hsl(45,68%,47%)] rounded-full mb-3" />

            {featured.excerpt && (
              <p className="text-white/55 text-sm leading-relaxed line-clamp-2 mb-5">
                {featured.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-white/40 text-[11px]">
                <Calendar size={11} />
                {convertDate(featured.createdAt)}
              </div>
              <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-xs font-black uppercase tracking-wide group-hover:bg-[hsl(45,68%,55%)] transition-colors duration-200">
                Read Article
                <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Side stack */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {rest.slice(0, 3).map((item, i) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: (i + 1) * 0.1 }}
            className="flex-1"
          >
            <Link
              href={`/news/${item.slug}`}
              className="group flex h-full gap-0 bg-white/[0.04] rounded-xl border border-white/10 hover:border-[hsl(45,68%,47%)]/40 hover:bg-white/[0.07] transition-all duration-300 overflow-hidden"
            >
              <div className="relative w-32 shrink-0 overflow-hidden">
                <Image
                  src={item.coverImage || FALLBACK}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-600"
                />
              </div>
              <div className="flex flex-col justify-center px-4 py-3 min-w-0">
                <div className="flex items-center gap-1 mb-1.5 text-[hsl(45,68%,47%)] text-[10px] font-semibold uppercase tracking-wider">
                  <Calendar size={9} />
                  {convertDate(item.createdAt)}
                </div>
                <h4 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-[hsl(45,68%,47%)] transition-colors duration-200">
                  {item.title}
                </h4>
                {item.excerpt && (
                  <p className="text-white/40 text-xs mt-1 line-clamp-1">
                    {item.excerpt.slice(0, 60)}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
