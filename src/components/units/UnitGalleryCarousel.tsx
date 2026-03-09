"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image, { StaticImageData } from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  images: string[] | StaticImageData[];
}

export function UnitGalleryCarousel({ images }: Props) {
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full h-[350px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 4000 }}
        loop
        navigation
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={img}
                alt="Unit Gallery"
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
