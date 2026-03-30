/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

export function Gallery({ images }: any) {
  return (
    <Swiper spaceBetween={20} slidesPerView={1}>
      {images.map((img: any) => (
        <SwiperSlide key={img._id}>
          <Image
            src={img.url}
            alt={img.url}
            className="w-full h-[400px] object-cover rounded-xl"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
