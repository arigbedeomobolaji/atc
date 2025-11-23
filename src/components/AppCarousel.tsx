"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";
import { motion } from "framer-motion";
import { HeadquartersAndLeaderships } from "./GalleryTabs";
// import Image1 from "../assets/atc_images/naf_images_1.jpg";
// import Image2 from "../assets/atc_images/naf_images_2.png";
// import Image3 from "../assets/atc_images/naf_images_7.jpg";
// import Image4 from "../assets/atc_images/naf_images_4.jpg";
// import Image5 from "../assets/atc_images/naf_images_5.jpg";
// import Image6 from "../assets/atc_images/naf_images_6.jpg";
// import Image7 from "../assets/atc_images/naf_images_7.jpg";
// import Image8 from "../assets/atc_images/naf_images_8.jpg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./AppCarousel.css";

// const slideContents = [
//   {
//     image: Image1,
//     alt: "Alt 1",
//     content:
//       "Aerial view of the Nigerian Air Force Base, Kaduna – the hub of advanced air training and operations.",
//   },
//   {
//     image: Image2,
//     alt: "Alt 2",
//     content:
//       "Kaduna Air Force Base: Where Nigeria’s future pilots take flight.",
//   },
//   {
//     image: Image3,
//     alt: "Alt 3",
//     content:
//       "Sunrise over the Kaduna Air Force Base, highlighting precision and readiness.",
//   },
//   {
//     image: Image4,
//     alt: "Alt 4",
//     content:
//       "Aircraft lined up on the runway at NAF Base Kaduna, ready for training missions.",
//   },
//   {
//     image: Image5,
//     alt: "Alt 5",
//     content:
//       "The strategic heart of Nigerian Air Force training – Kaduna Base in full operational capacity.",
//   },
//   {
//     image: Image6,
//     alt: "Alt 6",
//     content:
//       "A panoramic shot of Kaduna Air Force Base showcasing modern facilities and aviation infrastructure.",
//   },
//   {
//     image: Image7,
//     alt: "Alt 7",
//     content:
//       "Training in motion: Fighter jets at Kaduna Air Force Base preparing for takeoff.",
//   },
//   {
//     image: Image8,
//     alt: "Alt 8",
//     content:
//       "A Dassault-Dornier Alpha Jet stationed at Kaduna Base – Nigeria’s pride in air defense.",
//   },
// ];

export function AppCarousel() {
  return (
    <div className="relative w-full h-[300px] sm:h-[450px] xl:h-[650px] rounded-lg overflow-hidden shadow-lg">
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
        {HeadquartersAndLeaderships.map(
          ({ imageSrc, caption }, index) =>
            index > 0 && (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full overflow-hidden group">
                  {/* Parallax Background */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.05, y: 40 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{
                      duration: 1.8,
                      ease: "easeOut",
                    }}
                  >
                    <Image
                      src={imageSrc}
                      alt={caption}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </motion.div>

                  {/* Gradient Overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Text Caption with animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center max-w-3xl bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 shadow-lg"
                  >
                    <p className="font-heading font-semibold text-gray-100 text-sm sm:text-lg md:text-2xl">
                      {caption}
                    </p>
                  </motion.div>
                </div>
              </SwiperSlide>
            )
        )}
      </Swiper>

      {/* Optional parallax bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-black/60 to-transparent pointer-events-none"></div>
    </div>
  );
}
