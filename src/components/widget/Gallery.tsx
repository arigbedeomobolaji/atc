/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, useInView } from "framer-motion";
import { staggerContainer } from "./Motion";
import Image from "next/image";

export default function Gallery({ galleries }: { galleries: any[] }) {
  const [selectedGallery, setSelectedGallery] = useState<any>(null);
  const firstItems = galleries.slice(0, 8);
  const remainingItems = galleries.slice(8);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!galleries) return null;
  return (
    <>
      {/* GRID (first 3 rows only) */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {firstItems.map((g, index) => (
          <div
            key={index}
            className="relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md"
            onClick={() => setSelectedGallery(g)}
          >
            <Image
              src={g.cover}
              alt={g.caption}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
              <p className="text-white text-sm">{g.caption}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* HORIZONTAL SCROLL (remaining items) */}
      {remainingItems.length > 0 && (
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {remainingItems.map((g, index) => (
            <div
              key={index}
              className="min-w-[200px] aspect-square relative rounded-lg overflow-hidden cursor-pointer group shadow-md flex-shrink-0"
              onClick={() => setSelectedGallery(g)}
            >
              <Image
                src={g.cover}
                alt={g.caption}
                fill
                sizes="200px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                <p className="text-white text-sm">{g.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Dialog
        open={!!selectedGallery}
        onOpenChange={() => setSelectedGallery(null)}
      >
        <DialogContent className="min-w-[90vw] h-[80vh] max-w-none p-6">
          {/* HEADER */}
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedGallery?.caption || "Gallery"}
            </DialogTitle>
          </DialogHeader>

          {selectedGallery && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* MAIN CAROUSEL */}
              <Carousel className="w-full flex-1 overflow-hidden">
                <CarouselContent className="flex">
                  {selectedGallery.images.map((img: any) => (
                    <CarouselItem key={img.publicId} className="basis-full">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={img.url}
                          alt="gallery image"
                          width={500}
                          height={800}
                          className="w-full h-[70vh] object-contain rounded-lg"
                          priority
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>

              {/* THUMBNAILS */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {selectedGallery.images.map((img: any, index: number) => (
                  <div
                    key={img.publicId}
                    className="relative w-24 h-24 flex-shrink-0 cursor-pointer border rounded-md overflow-hidden"
                  >
                    <Image
                      src={img.url}
                      alt={img.caption + index}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover rounded-lg"
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
