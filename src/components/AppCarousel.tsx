"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { HeadquartersAndLeaderships } from "./GalleryTabs";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./AppCarousel.css";
import { useRouter } from "next/navigation";

type CarouselNews = {
  _id: string;
  title: string;
  slug: string;
  coverImage?: string;
};

const FALLBACK_IMAGE = "/images/placeholder-rect.jpeg";

export function AppCarousel() {
  const [newsSlides, setNewsSlides] = useState<CarouselNews[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadCarouselNews() {
      try {
        const res = await fetch("/api/news/carousel");
        const json = await res.json();
        setNewsSlides(json.news || []);
      } catch (err) {
        console.error("Carousel fetch failed", err);
      }
    }

    loadCarouselNews();
  }, []);

  return (
    <div className="relative w-full max-w-[2000px] mx-auto h-[500px] xl:h-[750px] rounded-lg overflow-hidden shadow-lg">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        navigation
        pagination={{ clickable: true }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="w-full h-full"
      >
        {/* 🔥 DB NEWS SLIDES */}
        {newsSlides.map((item) => (
          <SwiperSlide key={item._id}>
            <Link href={`/news/${item.slug}`}>
              <div className="relative w-full h-full overflow-hidden group cursor-pointer">
                <motion.div
                  // className="absolute inset-0"
                  initial={{ scale: 1.05, y: 40 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                >
                  {/* Background Blur */}
                  <Image
                    src={item.coverImage || FALLBACK_IMAGE}
                    alt={item.title}
                    fill
                    className="object-cover blur-md"
                  />
                  {/* Foreground Image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={item.coverImage || FALLBACK_IMAGE}
                      alt={item.title}
                      fill
                      className="rounded-lg object-contain "
                    />
                  </div>
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center max-w-3xl bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 shadow-lg"
                >
                  <p className="font-heading font-semibold text-gray-100 text-md lg:text-xl">
                    {item.title}
                  </p>
                  <button
                    onClick={() => router.push(`/news/${item.slug}`)}
                    className="font-link text-sm px-5 py-1 bg-dark text-white rounded-md"
                  >
                    Read More
                  </button>
                </motion.div>
              </div>
            </Link>
          </SwiperSlide>
        ))}

        {/* 🧪 STATIC SLIDES (temporary) */}
        {HeadquartersAndLeaderships.map(
          ({ imageSrc, caption }, index) =>
            index > 0 && (
              <SwiperSlide key={`static-${index}`}>
                <div className="relative w-full h-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.05, y: 40 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 1.8 }}
                  >
                    <Image
                      src={imageSrc}
                      alt={caption}
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center max-w-3xl bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 shadow-lg"
                  >
                    <p className="font-heading font-semibold text-gray-100 text-sm sm:text-lg lg:text-2xl">
                      {caption}
                    </p>
                  </motion.div>
                </div>
              </SwiperSlide>
            )
        )}
      </Swiper>

      <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}
