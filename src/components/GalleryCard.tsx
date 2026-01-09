"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import BlurryBgImage from "./BlurryBgImage";
import CustomModal from "./CustomModal";

function shortenWords(text: string, limit = 15) {
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}

interface GalleryCardProps {
  imageSrc: StaticImageData | string;
  caption: string;
  description: string;
}

export function GalleryCard({
  imageSrc,
  caption,
  description,
}: GalleryCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg 
  hover:-translate-y-1 transition-all duration-300 
  w-full h-[340px] sm:h-[360px] lg:h-[380px] lg:h-[400px] 
  bg-white shadow-md flex flex-col"
      >
        <BlurryBgImage imageSrc={imageSrc} caption={caption} />

        <div className="mt-2 px-2 space-y-1 grow">
          <h5 className="text-sm font-semibold line-clamp-2">{caption}</h5>
          <p className="text-xs text-gray-600 line-clamp-3">
            {shortenWords(description)}
          </p>
        </div>
        <button className="px-5 py-1 bg-dark text-white rounded-xs ">
          Enlarge
        </button>
      </div>

      {/* MODAL */}
      <CustomModal isOpen={open} onClose={() => setOpen(false)}>
        <div></div>
        <h2 className="text-lg font-bold mb-2">{caption}</h2>

        <div className="flex justify-center mb-3">
          <Image
            src={imageSrc}
            alt={caption}
            width={500}
            height={400}
            className="rounded-md object-contain w-full max-h-[400px]"
          />
        </div>

        <p className="text-gray-700 text-sm">{description}</p>
      </CustomModal>
    </>
  );
}
