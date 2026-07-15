"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./AppCarousel.css";

type CarouselNews = {
  _id: string;
  title: string;
  slug: string;
  coverImage?: string;
  excerpt?: string;
};

const FALLBACK = "/images/placeholder-rect.jpeg";

export function AppCarousel() {
  const [slides, setSlides] = useState<CarouselNews[]>([]);

  useEffect(() => {
    fetch("/api/news/carousel")
      .then((r) => r.json())
      .then((j) => setSlides(j.news || []))
      .catch(() => {});
  }, []);

  return (
    <div className="relative w-full h-[82vh] min-h-[520px] overflow-hidden bg-[hsl(220,64%,8%)]">
      {slides.length > 0 && (
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        navigation
        pagination={{ clickable: true }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="w-full h-full"
      >
        {slides.map((item) => (
          <SwiperSlide key={item._id}>
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={item.coverImage || FALLBACK}
                alt={item.title}
                fill
                className="object-cover scale-[1.04]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,8%)]/95 via-[hsl(220,64%,16%)]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,64%,8%)]/60 via-transparent to-transparent" />
              <SlideContent
                title={item.title}
                excerpt={item.excerpt}
                href={`/news/${item.slug}`}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      )}

      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
    </div>
  );
}

function SlideContent({
  title,
  excerpt,
  href,
}: {
  title: string;
  excerpt?: string;
  href: string;
}) {
  return (
    <div className="absolute inset-0 flex items-end z-10">
      <div className="max-w-7xl mx-auto w-full px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Radio size={11} className="text-[hsl(350,66%,55%)] animate-pulse" />
            <span className="text-[hsl(45,68%,47%)] text-[11px] font-black uppercase tracking-[0.3em]">
              Latest News
            </span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-tight tracking-wide">
            {title}
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            className="my-5 w-20 h-[3px] bg-[hsl(45,68%,47%)] origin-left rounded-full"
          />

          {excerpt && (
            <p className="text-white/55 text-sm leading-relaxed line-clamp-2 mb-5 max-w-lg">
              {excerpt}
            </p>
          )}

          <Link
            href={href}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-sm font-black uppercase tracking-wide hover:bg-[hsl(45,68%,55%)] transition-colors duration-200 shadow-xl"
          >
            Read Full Article
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
