"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  Wrench,
  ChevronRight,
  Award,
  Calendar,
  User,
  Plane,
  Target,
  Flag,
  Medal,
  History,
  Image as ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

// Section Header Component
function SectionHeader({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: React.ElementType;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="relative mb-10 flex items-center gap-4"
    >
      {Icon && (
        <motion.div
          variants={scaleIn}
          className="p-3 rounded-lg bg-gradient-to-br from-[#1a365d] to-[#2d5a9d] shadow-lg"
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      )}
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#1a365d]">
          {title}
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-16 h-1 bg-[#c9a227] rounded-full" />
          <div className="w-8 h-0.5 bg-[#1a365d]/30 rounded-full" />
          <div className="w-4 h-0.5 bg-[#1a365d]/20 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

// Timeline Component
function Timeline({ items }: { items: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="relative pl-8 md:pl-12"
    >
      {/* Timeline Line */}
      <div className="absolute left-3 md:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1a365d] via-[#c9a227] to-[#1a365d]" />

      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          className="relative mb-8 last:mb-0"
        >
          {/* Timeline Dot */}
          <motion.div
            whileHover={{ scale: 1.3 }}
            className="absolute -left-5 md:-left-6 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#c9a227] to-[#b8941f] border-4 border-white shadow-lg z-10"
          />

          {/* Content Card */}
          <div className="ml-6 bg-white rounded-lg border border-slate-200/60 shadow-sm p-5 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#c9a227]" />
              <span className="text-sm font-semibold text-[#1a365d]">
                {item.date}
              </span>
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">
              {item.title}
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {item.event}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Gallery Component
function Gallery({ galleries }: { galleries: any[] }) {
  const [selectedGallery, setSelectedGallery] = useState<any>(null);
  const firstItems = galleries.slice(0, 8);
  const remainingItems = galleries.slice(8);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!galleries) return;
  return (
    <>
      {/* GRID */}
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

export default function UnitPageClient({ unit, gallery }: any) {
  const [selectedCommander, setSelectedCommander] = useState<any>(null);
  const [scrollY, setScrollY] = useState(0);

  const [currentCommander, setCurrentCommander] = useState<any>(null);
  const [pastCommanders, setPastCommanders] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCommanders() {
      if (!unit._id) return;

      try {
        const [currentRes, historyRes, galleryRes] = await Promise.all([
          fetch(`/api/commanders/current/${unit._id}`),
          fetch(`/api/commanders/history/${unit._id}`),
          fetch(`/api/gallery/unit/${unit._id}`),
        ]);

        const currentData = await currentRes.json();
        const historyData = await historyRes.json();
        const galleryData = await galleryRes.json();

        console.log({ galleryData });

        // ✅ FIXED
        setCurrentCommander(currentData || null);

        const filteredHistory = historyData.filter(
          (c: any) => c.endDate !== null
        );

        setPastCommanders(filteredHistory);

        const formattedGallery = galleryData.map((g: any) => ({
          caption: g.caption,
          cover: g.images[0]?.url, // 🔥 first image as cover
          images: g.images, // 🔥 keep full array
        }));

        setGalleryImages(formattedGallery);
      } catch (err) {
        console.error("Failed to fetch commanders", err);
      }
    }

    fetchCommanders();
  }, [unit._id]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect(() => {
  //   async function loadGallery() {
  //     const res = await fetch(`/api/gallery/unit/${unitId}`);
  //     const data = await res.json();

  //     // 🔥 flatten all gallery images into one array
  //     const allImages = data.flatMap((g: any) =>
  //       g.images.map((img: any) => ({
  //         url: img.url,
  //         caption: g.caption, // 👈 gallery-level caption
  //       }))
  //     );

  //     setGalleryImages(allImages);
  //   }

  //   if (unitId) loadGallery();
  // }, [unitId]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[60vh] min-h-[400px] overflow-hidden"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop')",
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a365d]/90 via-[#1a365d]/70 to-[#1a365d]/90" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center gap-3 mb-4"
          >
            <Plane className="w-8 h-8 text-[#c9a227]" />
            <span className="text-[#c9a227] uppercase tracking-[0.3em] text-sm font-semibold">
              Nigerian Air Force
            </span>
            <Plane className="w-8 h-8 text-[#c9a227] scale-x-[-1]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wider mb-4"
          >
            {unit.unit}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="w-32 h-1 bg-[#c9a227] mb-6"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-white/80 text-lg max-w-2xl"
          >
            Air Training Command • Service to the Nation
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
            >
              <div className="w-1.5 h-3 bg-[#c9a227] rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="About the Unit" icon={Target} />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-8 md:p-10 relative overflow-hidden"
          >
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1a365d]/10 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-[#c9a227]/10">
                  <Flag className="w-6 h-6 text-[#c9a227]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1a365d] mb-2">
                    Mission Statement
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-[14px]">
                    {unit.mission ||
                      "To train world-class military aviators who will defend Nigeria's airspace with professionalism, integrity, and unwavering commitment to national security."}
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-loose text-justify">
                {unit.fullDescription}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Responsibilities Section */}
      {unit.responsibilities && (
        <section id="responsibilities" className="py-16 px-6 bg-slate-100">
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Core Responsibilities" icon={ShieldCheck} />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {unit.responsibilities.map(
                (responsibility: string, index: number) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="naf-card p-6 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-[#1a365d] to-[#2d5a9d] shadow-md group-hover:shadow-lg transition-shadow">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-800 font-medium leading-relaxed">
                          {responsibility}
                        </p>
                        <span className="text-xs text-slate-400 uppercase tracking-wider mt-2 block">
                          Responsibility {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Capabilities Section */}
      {unit.capabilities && (
        <section id="capabilities" className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Unit Capabilities" icon={Cpu} />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {unit.capabilities.map((capability: string, index: number) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  className="relative bg-white rounded-lg border border-slate-200/60 shadow-sm p-6 overflow-hidden group"
                >
                  {/* Top Accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a365d] to-[#c9a227]" />

                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-3 rounded-lg bg-[#1a365d]/5 group-hover:bg-[#1a365d] transition-colors"
                    >
                      <Cpu className="w-5 h-5 text-[#1a365d] group-hover:text-white transition-colors" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-slate-800 font-semibold leading-snug">
                        {capability}
                      </p>
                      <span className="text-xs text-slate-400 uppercase tracking-wider mt-2 block">
                        Capability
                      </span>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-2 ring-[#c9a227]/30" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Systems Section */}
      {unit.systems && (
        <section id="systems" className="py-16 px-6 bg-slate-100">
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Unit Systems / Equipment" icon={Wrench} />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {unit.systems.map((system: string, index: number) => (
                <motion.div
                  key={index}
                  variants={fadeInLeft}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  className="naf-card p-6 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#c9a227] to-[#b8941f] shadow-md">
                      <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 font-semibold leading-snug">
                        {system}
                      </p>
                      <span className="text-xs text-slate-400 uppercase tracking-wider mt-2 block">
                        Equipment
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* History Timeline Section */}
      {unit.history && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Unit History Timeline" icon={History} />

            <div className="max-w-3xl mx-auto">
              <Timeline items={unit.history} />
            </div>
          </div>
        </section>
      )}

      {/* Current Commander Section */}
      {currentCommander && (
        <section
          id="leadership"
          className="py-16 px-6 bg-gradient-to-br from-[#1a365d] to-[#0f2744] relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border border-white/30 rounded-full" />
            <div className="absolute bottom-10 right-10 w-60 h-60 border border-white/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="flex items-center gap-4 mb-10"
            >
              <div className="p-3 rounded-lg bg-[#c9a227]">
                <User className="w-6 h-6 text-[#1a365d]" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">
                  Current {currentCommander.appointment}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-16 h-1 bg-[#c9a227] rounded-full" />
                  <div className="w-8 h-0.5 bg-white/30 rounded-full" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-10 items-center"
            >
              {/* Image */}
              <motion.div variants={fadeInLeft} className="relative">
                <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-4 border-[#c9a227]">
                  <img
                    src={currentCommander.portrait}
                    alt={currentCommander.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Rank Badge */}
                  <div className="absolute -top-1 left-0 right-0 bg-gradient-to-t from-[#1a365d] to-transparent py-2 px-6">
                    <div className="flex items-center gap-2">
                      <Medal className="w-5 h-5 text-[#c9a227]" />
                      <span className="text-white font-semibold">
                        {currentCommander.rank}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-[#c9a227] rounded-tl-xl" />
                <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-[#c9a227] rounded-br-xl" />
              </motion.div>

              {/* Details */}
              <motion.div
                variants={fadeInRight}
                className="text-white space-y-6"
              >
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">
                    {currentCommander.rank} {currentCommander.name}
                  </h3>
                  <p className="text-[#c9a227] font-semibold uppercase tracking-wider">
                    {currentCommander.appointment}
                  </p>
                  <p className="text-white/60 text-sm mt-1">
                    Since{" "}
                    {new Date(currentCommander.startDate).toLocaleDateString(
                      "en-NG",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                {/* Awards */}
                {currentCommander.awards && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="inline-flex items-center gap-2 bg-[#c9a227]/20 border border-[#c9a227]/40 rounded-full px-4 py-2"
                  >
                    <Award className="w-4 h-4 text-[#c9a227]" />
                    <span className="text-[#c9a227] text-sm font-medium">
                      {currentCommander.awards}
                    </span>
                  </motion.div>
                )}

                {/* Bio */}
                {currentCommander.bio && (
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-[#c9a227]" />
                      Biography
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      {currentCommander.bio}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Past Commanders Section */}
      {pastCommanders.length > 0 && (
        <section id="leadership" className="py-16 px-6 bg-slate-100">
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Unit Past Commanders" icon={History} />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin"
            >
              {pastCommanders.map((commander) => (
                <motion.div
                  key={commander._id}
                  variants={scaleIn}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCommander(commander)}
                  className="min-w-[280px] bg-white rounded-lg shadow-md border border-slate-200/60 p-5 cursor-pointer relative overflow-hidden group"
                >
                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a365d] to-[#c9a227]" />

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a365d] to-[#2d5a9d] flex items-center justify-center text-white font-bold text-lg">
                      {commander.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#1a365d] text-lg">
                        {commander.rank} {commander.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(commander.startDate).toLocaleDateString(
                            "en-NG",
                            {
                              year: "numeric",
                              month: "short",
                            }
                          )}{" "}
                          —{" "}
                          {commander.endDate
                            ? new Date(commander.endDate).toLocaleDateString(
                                "en-NG",
                                {
                                  year: "numeric",
                                  month: "short",
                                }
                              )
                            : "Present"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Indicator */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-[#c9a227]" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Commander Modal */}
      <Dialog
        open={!!selectedCommander}
        onOpenChange={() => setSelectedCommander(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1a365d]">
              {selectedCommander?.rank} {selectedCommander?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                Tenure:{" "}
                {selectedCommander &&
                  new Date(selectedCommander.startDate).toLocaleDateString(
                    "en-NG",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}{" "}
                —{" "}
                {selectedCommander?.endDate
                  ? new Date(selectedCommander.endDate).toLocaleDateString(
                      "en-NG",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "Present"}
              </span>
            </div>
            <p className="text-slate-600 text-sm">
              Served as {selectedCommander?.appointment || "Commander"} of{" "}
              {unit.abbreviation} during this period.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Unit Gallery" icon={ImageIcon} />
          <Gallery galleries={galleryImages} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a365d] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Plane className="w-8 h-8 text-[#c9a227]" />
              <div>
                <h3 className="font-bold uppercase tracking-wider">
                  Air Training Command - Nigerian Air Force
                </h3>
                <p className="text-white/60 text-sm">{unit.unit}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/60">
              <span>Wings of Integrity</span>
              <span className="w-1 h-1 bg-[#c9a227] rounded-full" />
              <span>Service to the Nation</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            <p>© {new Date().getFullYear()} 441 CIS Gp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
