"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn, ImageOff, Images, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const TABS = [
  { label: "Headquarters & Leadership", category: "LEADERSHIP" },
  { label: "Ceremonies & Parades", category: "CEREMONY" },
  { label: "Training & Education", category: "TRAINING" },
  { label: "Exercises & Operations", category: "EXERCISE" },
  { label: "Units & Departments", category: "UNITS" },
  { label: "Infrastructure & Facilities", category: "INFRASTRUCTURE" },
  { label: "Community & Social Events", category: "COMMUNITY" },
  { label: "Students & Cadets Life", category: "CADETS" },
  { label: "History & Archives", category: "HISTORY" },
];

type AlbumImage = { url: string; publicId: string; caption: string };
type Album = {
  _id: string;
  title: string;
  description: string;
  category: string;
  coverImage: string | null;
  images: AlbumImage[];
};

/* ─── Lightbox for photos inside an album ─── */
function AlbumLightbox({
  album,
  open,
  onClose,
}: {
  album: Album;
  open: boolean;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const images = album.images;

  useEffect(() => {
    if (open) setCurrent(0);
  }, [open, album._id]);

  if (!open || images.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999]" />
        <Dialog.Content className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <Dialog.Title className="sr-only">{album.title}</Dialog.Title>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-[hsl(220,64%,12%)] rounded-2xl max-w-4xl w-full border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="h-1 bg-gradient-to-r from-[hsl(220,64%,16%)] via-[hsl(350,66%,33%)] to-[hsl(45,68%,47%)]" />

            {/* Title bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div>
                <p className="text-white font-bold text-sm">{album.title}</p>
                <p className="text-white/40 text-xs mt-0.5">
                  {current + 1} / {images.length}
                </p>
              </div>
              <Dialog.Close
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </Dialog.Close>
            </div>

            {/* Main image */}
            <div className="relative aspect-video w-full bg-black">
              <Image
                src={images[current].url}
                alt={images[current].caption || album.title}
                fill
                className="object-contain"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Caption */}
            {images[current].caption && (
              <div className="px-5 py-3 border-t border-white/10">
                <p className="text-white/60 text-sm">{images[current].caption}</p>
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide px-5 py-3 border-t border-white/10">
                {images.map((img, i) => (
                  <button
                    key={img.publicId}
                    onClick={() => setCurrent(i)}
                    className={`shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === current ? "border-[hsl(45,68%,47%)]" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.caption || `Photo ${i + 1}`}
                      width={56}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ─── Album card ─── */
function AlbumCard({ album, index, onOpen }: { album: Album; index: number; onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover="hover"
      onClick={onOpen}
      className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 hover:border-[hsl(45,68%,47%)]/40 transition-colors duration-300"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[hsl(220,64%,10%)]">
        {album.coverImage ? (
          <>
            <Image
              src={album.coverImage}
              alt={album.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,8%)]/80 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[hsl(220,64%,8%)]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-xl">
                <ZoomIn size={20} className="text-[hsl(220,64%,16%)]" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageOff size={32} className="text-white/10" />
          </div>
        )}

        {/* Photo count badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold">
          <Images size={10} />
          {album.images.length}
        </div>
      </div>

      {/* Title */}
      <div className="p-4">
        <h5 className="text-white font-bold text-sm line-clamp-2 leading-snug">{album.title}</h5>
        {album.description && (
          <p className="text-white/40 text-xs mt-1 line-clamp-2">{album.description}</p>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main GalleryTabs ─── */
export default function GalleryTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0].category);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/albums?category=${activeTab}&commandOnly=true`)
      .then((r) => r.json())
      .then((j) => setAlbums(j.albums || []))
      .catch(() => setAlbums([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const activeLabel = TABS.find((t) => t.category === activeTab)?.label ?? "";

  return (
    <div className="w-full">
      {/* Tab strip */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.category}
            onClick={() => setActiveTab(tab.category)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
              activeTab === tab.category
                ? "bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] shadow-lg"
                : "bg-white/[0.06] border border-white/10 text-white/60 hover:bg-white/[0.1] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={28} className="text-white/30 animate-spin" />
            </div>
          ) : albums.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-5">
                <ImageOff size={24} className="text-white/25" />
              </div>
              <p className="text-white/30 text-sm font-semibold uppercase tracking-wider">
                No albums yet for {activeLabel}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {albums.map((album, i) => (
                <AlbumCard
                  key={album._id}
                  album={album}
                  index={i}
                  onOpen={() => setSelectedAlbum(album)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Album lightbox */}
      {selectedAlbum && (
        <AlbumLightbox
          album={selectedAlbum}
          open={!!selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
        />
      )}
    </div>
  );
}
