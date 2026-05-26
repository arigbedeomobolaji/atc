"use client";

import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn, ImageOff } from "lucide-react";

import AOC_Portrait from "../assets/NAF_ASSETS/AOC_portrait.jpeg";
import ChangingColor from "../assets/NAF_ASSETS/Handing_command_colour.jpeg";
import HandingOver from "../assets/NAF_ASSETS/Handing_over.jpeg";
import HQ_ATC from "../assets/NAF_ASSETS/ATC_HQ.jpeg";

const TABS = [
  "Headquarters & Leadership",
  "Units & Departments",
  "Training & Education",
  "Ceremonies & Parades",
  "Infrastructure & Facilities",
  "Aircraft & Equipment",
  "Community & Social Events",
  "History & Archives",
  "Students & Cadets Life",
];

type ImageData = {
  imageSrc: StaticImageData | string;
  caption: string;
  description: string;
};

export const HeadquartersAndLeaderships: ImageData[] = [
  {
    imageSrc: AOC_Portrait,
    caption: "Portrait of the Air Training Command AOC",
    description:
      "Official portrait of the Air Officer Commanding, Air Training Command, Kaduna, representing leadership, service, and the strategic oversight of all NAF training institutions under the Command.",
  },
  {
    imageSrc: ChangingColor,
    caption: "AOC Command Colour Handover Ceremony",
    description:
      "Moment captured during the ceremonial handover of the Air Training Command Colour as the outgoing AOC transfers authority and honours to the incoming AOC AVM H.J. Gambo.",
  },
  {
    imageSrc: HandingOver,
    caption: "Formal Handover of Command Documents",
    description:
      "Official handover session where the outgoing AOC transfers Command documents to the new AOC, AVM H.J. Gambo, marking the seamless transition of leadership within Air Training Command.",
  },
  {
    imageSrc: HQ_ATC,
    caption: "Air Training Command Headquarters, Kaduna",
    description:
      "Front view of the Air Training Command Headquarters in Kaduna, the hub for coordinating Nigerian Air Force training, doctrine development, and capacity-building programmes.",
  },
];

const GALLERY_DATA: Record<string, ImageData[]> = {
  "Headquarters & Leadership": HeadquartersAndLeaderships,
  "Units & Departments": [],
  "Training & Education": [],
  "Ceremonies & Parades": [],
  "Infrastructure & Facilities": [],
  "Aircraft & Equipment": [],
  "Community & Social Events": [],
  "History & Archives": [],
  "Students & Cadets Life": [],
};

function GalleryPhotoCard({ item, index }: { item: ImageData; index: number }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.07 }}
          whileHover="hover"
          className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 hover:border-[hsl(45,68%,47%)]/40 transition-colors duration-300"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={item.imageSrc}
              alt={item.caption}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,8%)]/80 via-transparent to-transparent" />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[hsl(220,64%,8%)]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-xl">
                <ZoomIn size={20} className="text-[hsl(220,64%,16%)]" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h5 className="text-white font-bold text-sm line-clamp-2 leading-snug">
                {item.caption}
              </h5>
            </div>
          </div>
        </motion.div>
      </Dialog.Trigger>

      {/* Lightbox modal */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[999] data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-[hsl(220,64%,12%)] rounded-2xl max-w-3xl w-full border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="h-1 bg-gradient-to-r from-[hsl(220,64%,16%)] via-[hsl(350,66%,33%)] to-[hsl(45,68%,47%)]" />

            <div className="relative">
              <div className="relative aspect-video w-full">
                <Image
                  src={item.imageSrc}
                  alt={item.caption}
                  fill
                  className="object-cover"
                />
              </div>

              <Dialog.Close className="absolute top-3 right-3 p-2 rounded-xl bg-[hsl(220,64%,8%)]/80 text-white/60 hover:text-white hover:bg-[hsl(220,64%,16%)] transition-colors">
                <X size={18} />
              </Dialog.Close>
            </div>

            <div className="p-6">
              <h4 className="font-heading font-black text-white uppercase tracking-wide text-base mb-2">
                {item.caption}
              </h4>
              <p className="text-white/55 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function GalleryTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const images = GALLERY_DATA[activeTab] ?? [];

  return (
    <div className="w-full">
      {/* Tab strip */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
              activeTab === tab
                ? "bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] shadow-lg"
                : "bg-white/[0.06] border border-white/10 text-white/60 hover:bg-white/[0.1] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Image grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-5">
                <ImageOff size={24} className="text-white/25" />
              </div>
              <p className="text-white/30 text-sm font-semibold uppercase tracking-wider">
                No images yet for this category
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <GalleryPhotoCard key={i} item={img} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
