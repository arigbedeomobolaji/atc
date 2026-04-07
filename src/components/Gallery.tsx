/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

export function Gallery({ images }: any) {
  return (
    <Swiper spaceBetween={20} slidesPerView={1}>
      {images
        .filter((img: any) => img.imageUrl) // ✅ prevent empty src
        .map((img: any) => (
          <SwiperSlide key={img._id}>
            <Image
              src={img.imageUrl}
              alt={img.caption || "gallery image"}
              width={800}
              height={400}
              className="w-full h-[400px] object-cover rounded-xl"
            />
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
