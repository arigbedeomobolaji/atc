"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { convertDate } from "@/utils/covertDate";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

type NewsItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  createdAt: string;
};

const FALLBACK = "/images/placeholder-rect.jpeg";

export default function LatestNews() {
  const [rows, setRows] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 6;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news/list?page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((j) => {
        setRows(j.news || []);
        setTotalPages(j.totalPages || 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/5 animate-pulse"
            style={{ aspectRatio: "4/3" }}
          />
        ))}
      </div>
    );
  }

  if (!rows.length) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
        >
          {rows.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/news/${item.slug}`}
                className="group flex flex-col h-full bg-white/[0.04] rounded-2xl overflow-hidden border border-white/10 hover:border-[hsl(45,68%,47%)]/40 hover:bg-white/[0.07] transition-all duration-300"
              >
                {/* Cover */}
                <div className="relative aspect-[16/9] overflow-hidden shrink-0">
                  <Image
                    src={item.coverImage || FALLBACK}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,8%)]/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-1.5 mb-3 text-[hsl(45,68%,47%)] text-[11px] font-semibold uppercase tracking-wider">
                    <Calendar size={11} />
                    {convertDate(item.createdAt)}
                  </div>

                  <h4 className="text-white font-bold text-base leading-snug line-clamp-2 mb-2 group-hover:text-[hsl(45,68%,47%)] transition-colors duration-200">
                    {item.title}
                  </h4>

                  {item.excerpt && (
                    <p className="text-white/45 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                      {item.excerpt.slice(0, 100)}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 mt-auto text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-wide">
                    Read More
                    <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>

          {pages.map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                n === page
                  ? "bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)]"
                  : "border border-white/20 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
