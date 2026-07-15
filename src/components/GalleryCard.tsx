"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { ZoomIn, X } from "lucide-react";

interface GalleryCardProps {
  imageSrc: StaticImageData | string;
  caption: string;
  description: string;
  index?: number;
}

export function GalleryCard({ imageSrc, caption, description, index = 0 }: GalleryCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
          whileHover="hover"
          className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 hover:border-[hsl(45,68%,47%)]/40 transition-colors duration-300"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={imageSrc}
              alt={caption}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,8%)]/80 via-transparent to-transparent" />

            {/* Hover zoom icon */}
            <div className="absolute inset-0 bg-[hsl(220,64%,8%)]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-11 h-11 rounded-full bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-xl">
                <ZoomIn size={18} className="text-[hsl(220,64%,16%)]" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h5 className="text-white font-bold text-sm line-clamp-2 leading-snug">
                {caption}
              </h5>
            </div>
          </div>
        </motion.div>
      </Dialog.Trigger>

      {/* Lightbox */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[999]" />
        <Dialog.Content className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-[hsl(220,64%,12%)] rounded-2xl max-w-3xl w-full border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="h-1 bg-gradient-to-r from-[hsl(220,64%,16%)] via-[hsl(350,66%,33%)] to-[hsl(45,68%,47%)]" />

            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={caption}
                  fill
                  className="object-cover"
                />
              </div>
              <Dialog.Close className="absolute top-3 right-3 p-2 rounded-xl bg-[hsl(220,64%,8%)]/80 text-white/60 hover:text-white hover:bg-[hsl(220,64%,16%)] transition-colors">
                <X size={18} />
              </Dialog.Close>
            </div>

            <div className="p-6">
              <Dialog.Title className="font-heading font-black text-white uppercase tracking-wide text-base mb-2">
                {caption}
              </Dialog.Title>
              <p className="text-white/55 text-sm leading-relaxed">{description}</p>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
