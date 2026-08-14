"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ShieldCheck, Cpu, Wrench, ChevronRight, Award, Calendar,
  User, Plane, Flag, Medal, History, Star, CheckCircle2,
  MapPin, ZoomIn, X, ArrowRight, Home, ExternalLink,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import ATCLogo from "@/assets/ATC_logo_big_trans.png";
import { abbrevRank } from "@/lib/rankAbbr";
import {
  Carousel, CarouselContent, CarouselItem,
  CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";

/* ── Shared variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

/* ── Reusable section header ── */
function SectionLabel({ icon: Icon, label, title }: { icon: React.ElementType; label: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="flex items-center gap-3 mb-10"
    >
      <div className="w-10 h-10 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg shrink-0">
        <Icon size={18} className="text-[hsl(220,64%,16%)]" />
      </div>
      <div>
        <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">{label}</span>
        <h2 className="font-heading text-2xl md:text-3xl font-black text-white uppercase tracking-wide leading-tight">{title}</h2>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="w-14 h-0.5 rounded-full bg-[hsl(45,68%,47%)]" />
          <div className="w-7 h-px rounded-full bg-white/20" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Timeline ── */
function Timeline({ items }: { items: any[] }) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-[hsl(45,68%,47%)] via-[hsl(350,66%,33%)] to-[hsl(45,68%,47%)]" />
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          className="relative mb-7 last:mb-0"
        >
          <motion.div
            whileHover={{ scale: 1.35 }}
            className="absolute -left-5 top-1 w-5 h-5 rounded-full bg-[hsl(45,68%,47%)] border-3 border-[hsl(220,64%,10%)] shadow-lg z-10"
          />
          <div className="ml-5 p-5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[hsl(45,68%,47%)]/35 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-1.5 text-[hsl(45,68%,47%)] text-[11px] font-semibold uppercase tracking-wider">
              <Calendar size={11} />
              {item.date}
            </div>
            <h4 className="text-white font-bold text-sm mb-1.5">{item.title}</h4>
            <p className="text-white/50 text-xs leading-relaxed">{item.event}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Gallery grid + lightbox ── */
function Gallery({ galleries }: { galleries: any[] }) {
  const [selected, setSelected] = useState<any>(null);
  if (!galleries?.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleries.map((g, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onClick={() => setSelected(g)}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-[hsl(45,68%,47%)]/40 transition-colors duration-300"
          >
            <Image src={g.cover} alt={g.caption} fill sizes="25vw" className="object-cover group-hover:scale-110 transition-transform duration-600" />
            <div className="absolute inset-0 bg-[hsl(220,64%,8%)]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-xl">
                <ZoomIn size={16} className="text-[hsl(220,64%,16%)]" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[hsl(220,64%,8%)]/80 to-transparent">
              <p className="text-white text-xs font-semibold line-clamp-1">{g.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog.Root open={!!selected} onOpenChange={() => setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[999]" />
          <Dialog.Content className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-[hsl(220,64%,12%)] rounded-2xl w-full max-w-4xl border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="h-1 bg-gradient-to-r from-[hsl(220,64%,16%)] via-[hsl(350,66%,33%)] to-[hsl(45,68%,47%)]" />
              {selected && (
                <div className="flex flex-col overflow-hidden max-h-[85vh]">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                    <Dialog.Title className="text-white font-bold text-sm">{selected.caption}</Dialog.Title>
                    <Dialog.Close className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                      <X size={16} />
                    </Dialog.Close>
                  </div>
                  <Carousel className="w-full flex-1 overflow-hidden">
                    <CarouselContent>
                      {selected.images.map((img: any) => (
                        <CarouselItem key={img.publicId} className="basis-full">
                          <div className="relative w-full h-[55vh]">
                            <Image src={img.url} alt="gallery" fill className="object-contain" priority />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-3 bg-[hsl(220,64%,16%)] border-white/20 text-white hover:bg-[hsl(220,64%,22%)]" />
                    <CarouselNext className="right-3 bg-[hsl(220,64%,16%)] border-white/20 text-white hover:bg-[hsl(220,64%,22%)]" />
                  </Carousel>
                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto px-4 py-3 border-t border-white/10">
                    {selected.images.map((img: any, i: number) => (
                      <div key={i} className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-white/10">
                        <Image src={img.url} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

/* ── Custom sections ── */
function CustomSections({ sections }: { sections: { title: string; items: string[] }[] }) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map((section, si) => (
        <section key={si} className={`relative py-20 overflow-hidden ${si % 2 === 0 ? "bg-[hsl(220,64%,10%)]" : "bg-[hsl(220,64%,13%)]"}`}>
          <div className="max-w-7xl mx-auto px-6">
            <SectionLabel icon={CheckCircle2} label="Unit Details" title={section.title} />
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="grid sm:grid-cols-2 gap-5">
              {section.items.map((item, ii) => (
                <motion.div key={ii} variants={fadeUp} whileHover={{ y: -4 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[hsl(45,68%,47%)]/35 hover:bg-white/[0.07] transition-all duration-300 group">
                  <div className="w-9 h-9 rounded-xl bg-[hsl(45,68%,47%)]/12 border border-[hsl(45,68%,47%)]/25 flex items-center justify-center shrink-0 group-hover:bg-[hsl(45,68%,47%)]/22 transition-colors duration-200">
                    <CheckCircle2 size={15} className="text-[hsl(45,68%,47%)]" />
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function UnitPageClient({ unit }: any) {
  const [selectedCommander, setSelectedCommander] = useState<any>(null);
  const [currentCommander, setCurrentCommander]   = useState<any>(null);
  const [pastCommanders, setPastCommanders]        = useState<any[]>([]);
  const [galleryImages, setGalleryImages]          = useState<any[]>([]);

  useEffect(() => {
    if (!unit._id) return;
    Promise.all([
      fetch(`/api/commanders/current/${unit._id}`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/commanders/history/${unit._id}`).then((r) => r.json()),
      fetch(`/api/albums?unitId=${unit._id}`).then((r) => r.ok ? r.json() : { albums: [] }),
    ])
      .then(([cur, hist, albumsRes]) => {
        setCurrentCommander(cur?._id ? cur : null);
        setPastCommanders(Array.isArray(hist) ? hist : []);
        const albums = albumsRes?.albums ?? [];
        setGalleryImages(
          albums
            .filter((a: any) => a.coverImage || a.images?.length > 0)
            .map((a: any) => ({
              caption: a.title,
              cover: a.coverImage || a.images[0]?.url,
              images: a.images,
            }))
        );
      })
      .catch(() => {});
  }, [unit._id]);

  const NAVY_SECTION   = "bg-[hsl(220,64%,10%)]";
  const DARKER_SECTION = "bg-[hsl(220,64%,13%)]";

  return (
    <div className="min-h-screen bg-[hsl(220,64%,8%)]">

      {/* ══ HERO ══ */}
      <section className="relative h-[85vh] min-h-[520px] overflow-hidden bg-[hsl(220,64%,8%)]">
        {/* Background: unit logo blurred or fallback */}
        {unit.logo ? (
          <div className="absolute inset-0">
            <Image src={unit.logo} alt={unit.unit} fill className="object-cover scale-110 blur-sm opacity-15" />
          </div>
        ) : (
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "repeating-linear-gradient(-45deg,white 0,white 1px,transparent 0,transparent 50%)", backgroundSize: "24px 24px" }}
          />
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,64%,8%)]/60 via-[hsl(220,64%,8%)]/50 to-[hsl(220,64%,8%)]/98" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,64%,8%)]/80 via-transparent to-transparent" />
        {/* Glow */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-[hsl(45,68%,47%)]/5 blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {/* Unit logo */}
          {unit.logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65 }}
              className="relative w-24 h-24 md:w-28 md:h-28 mb-6 rounded-2xl overflow-hidden bg-white/10 border border-white/20 shadow-2xl"
            >
              <Image src={unit.logo} alt={unit.abbreviation} fill className="object-contain p-2" />
            </motion.div>
          )}

          {/* NAF badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-2 mb-4"
          >
            <Plane size={11} className="text-[hsl(45,68%,47%)]" />
            <span className="text-[hsl(45,68%,47%)] text-[11px] font-black uppercase tracking-[0.35em]">Nigerian Air Force · Air Training Command</span>
            <Plane size={11} className="text-[hsl(45,68%,47%)] scale-x-[-1]" />
          </motion.div>

          {/* Unit name */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.75 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-tight tracking-wide max-w-4xl mb-3"
          >
            {unit.unit}
          </motion.h1>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="w-24 h-1 bg-[hsl(45,68%,47%)] rounded-full mb-5 origin-center"
          />

          {/* Meta chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            {unit.abbreviation && (
              <span className="px-4 py-1.5 rounded-full bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-xs font-black uppercase tracking-widest shadow-lg">
                {unit.abbreviation.toUpperCase()}
              </span>
            )}
            {unit.location && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/15 text-white/65 text-xs font-semibold">
                <MapPin size={11} />
                {unit.location}
              </span>
            )}
            {unit.establishedDate && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/15 text-white/65 text-xs font-semibold">
                <Calendar size={11} />
                Est. {new Date(unit.establishedDate).getFullYear()}
              </span>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <button
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-2.5 rounded-xl bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-sm font-black uppercase tracking-wide hover:bg-[hsl(45,68%,55%)] transition-colors shadow-xl"
            >
              Explore Unit
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white/65 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <Home size={13} />
              ATC Main Site
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[hsl(45,68%,47%)] rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className={`relative py-20 overflow-hidden ${NAVY_SECTION}`}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <SectionLabel icon={Flag} label="About" title="About the Unit" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[hsl(45,68%,47%)]/30 transition-colors duration-300"
          >
            <p className="text-white/65 text-base leading-relaxed">{unit.description}</p>
          </motion.div>
        </div>
      </section>

      {/* ══ MISSION STATEMENT (if commander exists + mission set) ══ */}
      {currentCommander && unit.mission && (
        <section className={`relative py-20 overflow-hidden ${DARKER_SECTION}`}>
          <div className="absolute inset-x-0 top-0 h-48 bg-[hsl(45,68%,47%)]/4 blur-3xl pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6">
            <SectionLabel icon={Star} label="Command" title="Mission Statement" />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Portrait */}
              <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }} className="relative">
                <div className="relative w-full max-w-xs mx-auto aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[hsl(45,68%,47%)]/50 shadow-2xl">
                  {currentCommander.portrait ? (
                    <img src={currentCommander.portrait} alt={currentCommander.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[hsl(220,64%,16%)] flex items-center justify-center">
                      <User size={64} className="text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,8%)]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Medal size={12} className="text-[hsl(45,68%,47%)]" />
                      <span className="text-[hsl(45,68%,47%)] text-[10px] font-bold uppercase tracking-wider">{currentCommander.rank}</span>
                    </div>
                    <p className="text-white font-bold text-sm">{currentCommander.name}</p>
                    <p className="text-white/50 text-xs">{currentCommander.appointment}</p>
                  </div>
                </div>
                <div className="absolute -top-3 -left-3 w-14 h-14 border-t-2 border-l-2 border-[hsl(45,68%,47%)] rounded-tl-xl" />
                <div className="absolute -bottom-3 -right-3 w-14 h-14 border-b-2 border-r-2 border-[hsl(45,68%,47%)] rounded-br-xl" />
              </motion.div>
              {/* Statement */}
              <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-5">
                <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">{currentCommander.appointment}</span>
                <h3 className="font-heading text-5xl font-black text-white uppercase leading-tight">Mission</h3>
                <div className="w-14 h-0.5 bg-[hsl(45,68%,47%)] rounded-full" />
                <blockquote className="pl-4 border-l-2 border-[hsl(45,68%,47%)]">
                  <p className="text-white/65 text-base leading-relaxed italic">{unit.mission}</p>
                </blockquote>
                <Link href={`/units/${unit.slug}/commander`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(45,68%,47%)]/15 border border-[hsl(45,68%,47%)]/30 text-[hsl(45,68%,47%)] text-sm font-bold hover:bg-[hsl(45,68%,47%)]/25 transition-all duration-200">
                  View Full Commander Profile <ArrowRight size={13} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ══ RESPONSIBILITIES ══ */}
      {!!unit.responsibilities?.length && (
        <section id="responsibilities" className={`relative py-20 overflow-hidden ${NAVY_SECTION}`}>
          <div className="relative max-w-7xl mx-auto px-6">
            <SectionLabel icon={ShieldCheck} label="Mandate" title="Core Responsibilities" />
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="grid sm:grid-cols-2 gap-5">
              {unit.responsibilities.map((r: string, i: number) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[hsl(45,68%,47%)]/35 hover:bg-white/[0.07] transition-all duration-300 group">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-[hsl(45,68%,47%)]/12 border border-[hsl(45,68%,47%)]/25 flex items-center justify-center group-hover:bg-[hsl(45,68%,47%)]/22 transition-colors duration-200">
                      <ShieldCheck size={15} className="text-[hsl(45,68%,47%)]" />
                    </div>
                    <span className="text-[hsl(45,68%,47%)] text-[9px] font-black">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{r}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══ CAPABILITIES ══ */}
      {!!unit.capabilities?.length && (
        <section id="capabilities" className={`relative py-20 overflow-hidden ${DARKER_SECTION}`}>
          <div className="relative max-w-7xl mx-auto px-6">
            <SectionLabel icon={Cpu} label="Technical" title="Unit Capabilities" />
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {unit.capabilities.map((cap: string, i: number) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ y: -5, scale: 1.01 }}
                  className="relative p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[hsl(45,68%,47%)]/40 hover:bg-white/[0.07] transition-all duration-300 group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(45,68%,47%)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-10 h-10 rounded-xl bg-[hsl(45,68%,47%)]/12 border border-[hsl(45,68%,47%)]/25 flex items-center justify-center mb-4 group-hover:bg-[hsl(45,68%,47%)]/22 transition-colors duration-200">
                    <Cpu size={16} className="text-[hsl(45,68%,47%)]" />
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{cap}</p>
                  <span className="text-white/25 text-[9px] font-black uppercase tracking-widest mt-3 block">Capability {String(i + 1).padStart(2, "0")}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══ SYSTEMS / EQUIPMENT ══ */}
      {!!unit.systems?.length && (
        <section className={`relative py-20 overflow-hidden ${NAVY_SECTION}`}>
          <div className="relative max-w-7xl mx-auto px-6">
            <SectionLabel icon={Wrench} label="Equipment" title="Systems &amp; Equipment" />
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {unit.systems.map((sys: string, i: number) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ x: 4 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[hsl(45,68%,47%)]/35 hover:bg-white/[0.07] transition-all duration-300 group">
                  <div className="w-9 h-9 rounded-xl bg-[hsl(350,66%,33%)]/15 border border-[hsl(350,66%,33%)]/25 flex items-center justify-center shrink-0 group-hover:bg-[hsl(350,66%,33%)]/25 transition-colors duration-200">
                    <Wrench size={15} className="text-[hsl(350,66%,55%)]" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-semibold leading-snug">{sys}</p>
                    <span className="text-white/25 text-[9px] font-bold uppercase tracking-widest mt-1 block">Equipment</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══ HISTORY TIMELINE ══ */}
      {!!unit.history?.length && (
        <section className={`relative py-20 overflow-hidden ${DARKER_SECTION}`}>
          <div className="relative max-w-7xl mx-auto px-6">
            <SectionLabel icon={History} label="Timeline" title="Unit History" />
            <div className="max-w-2xl">
              <Timeline items={unit.history} />
            </div>
          </div>
        </section>
      )}

      {/* ══ CUSTOM SECTIONS ══ */}
      {!!unit.customSections?.length && <CustomSections sections={unit.customSections} />}

      {/* ══ CURRENT COMMANDER ══ */}
      {currentCommander && (
        <section id="leadership" className={`relative py-20 overflow-hidden ${NAVY_SECTION}`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-[hsl(45,68%,47%)]/5 blur-3xl pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6">
            <SectionLabel icon={User} label="Leadership" title={`Current ${currentCommander.appointment}`} />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Portrait */}
              <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.65 }} className="relative">
                <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[hsl(45,68%,47%)]/50 shadow-2xl">
                  {currentCommander.portrait ? (
                    <img src={currentCommander.portrait} alt={currentCommander.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[hsl(220,64%,16%)] flex items-center justify-center">
                      <User size={72} className="text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,8%)]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Medal size={12} className="text-[hsl(45,68%,47%)]" />
                      <span className="text-[hsl(45,68%,47%)] text-[10px] font-bold uppercase tracking-wider">{currentCommander.rank}</span>
                    </div>
                    <p className="text-white font-bold text-sm">{currentCommander.name}</p>
                  </div>
                </div>
                <div className="absolute -top-3 -left-3 w-14 h-14 border-t-2 border-l-2 border-[hsl(45,68%,47%)] rounded-tl-xl" />
                <div className="absolute -bottom-3 -right-3 w-14 h-14 border-b-2 border-r-2 border-[hsl(45,68%,47%)] rounded-br-xl" />
              </motion.div>

              {/* Info */}
              <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.65, delay: 0.1 }} className="space-y-5">
                <div>
                  <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">{currentCommander.appointment}</span>
                  <h3 className="font-heading text-2xl md:text-3xl font-black text-white uppercase leading-tight mt-1">
                    {abbrevRank(currentCommander.rank)} {currentCommander.name}
                  </h3>
                  <p className="text-white/40 text-xs mt-1">
                    Since {new Date(currentCommander.startDate).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>

                {currentCommander.awards && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(45,68%,47%)]/10 border border-[hsl(45,68%,47%)]/25 w-fit">
                    <Award size={14} className="text-[hsl(45,68%,47%)]" />
                    <span className="text-[hsl(45,68%,47%)] text-xs font-semibold">{currentCommander.awards}</span>
                  </div>
                )}

                {currentCommander.bio && (
                  <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-4">{currentCommander.bio}</p>
                  </div>
                )}

                <Link
                  href={`/units/${unit.slug}/commander`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-sm font-black uppercase tracking-wide hover:bg-[hsl(45,68%,55%)] transition-colors shadow-lg"
                >
                  View Full Profile <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ══ PAST COMMANDERS ══ */}
      {!!pastCommanders.length && (
        <section className={`relative py-20 overflow-hidden ${DARKER_SECTION}`}>
          <div className="relative max-w-7xl mx-auto px-6">
            <SectionLabel icon={History} label="Alumni" title="Past Commanders" />
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 pb-2 w-max">
                {pastCommanders.map((cmd) => (
                  <motion.div key={cmd._id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedCommander(cmd)}
                    className="min-w-[240px] p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[hsl(45,68%,47%)]/40 hover:bg-white/[0.07] transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  >
                    <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(45,68%,47%)] to-transparent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[hsl(220,64%,22%)] border border-white/15 flex items-center justify-center text-white font-black text-sm shrink-0">
                        {cmd.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm line-clamp-1">{abbrevRank(cmd.rank)} {cmd.name}</p>
                        <p className="text-white/40 text-[10px] truncate">{cmd.appointment}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[hsl(45,68%,47%)] text-[10px] font-semibold">
                      <Calendar size={10} />
                      {new Date(cmd.startDate).toLocaleDateString("en-NG", { year: "numeric", month: "short" })}
                      {" — "}
                      {cmd.endDate ? new Date(cmd.endDate).toLocaleDateString("en-NG", { year: "numeric", month: "short" }) : "Present"}
                    </div>
                    <ChevronRight size={14} className="absolute top-4 right-4 text-white/25 group-hover:text-[hsl(45,68%,47%)] transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Past commander modal */}
      <Dialog.Root open={!!selectedCommander} onOpenChange={() => setSelectedCommander(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[999]" />
          <Dialog.Content className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
              className="bg-[hsl(220,64%,12%)] rounded-2xl max-w-md w-full border border-white/10 overflow-hidden shadow-2xl">
              <div className="h-1 bg-gradient-to-r from-[hsl(220,64%,16%)] via-[hsl(350,66%,33%)] to-[hsl(45,68%,47%)]" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading font-black text-white uppercase tracking-wide text-base">
                    {selectedCommander ? abbrevRank(selectedCommander.rank) : ""} {selectedCommander?.name}
                  </h3>
                  <Dialog.Close className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                    <X size={16} />
                  </Dialog.Close>
                </div>
                <div className="flex items-center gap-2 mb-4 text-[hsl(45,68%,47%)] text-xs font-semibold">
                  <Calendar size={11} />
                  {selectedCommander && (
                    <>
                      {new Date(selectedCommander.startDate).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
                      {" — "}
                      {selectedCommander.endDate
                        ? new Date(selectedCommander.endDate).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })
                        : "Present"}
                    </>
                  )}
                </div>
                <p className="text-white/55 text-sm">
                  Served as {selectedCommander?.appointment || "Commander"} of {unit.abbreviation?.toUpperCase()} during this period.
                </p>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ══ GALLERY ══ */}
      {!!galleryImages.length && (
        <section id="gallery" className={`relative py-20 overflow-hidden ${NAVY_SECTION}`}>
          <div className="relative max-w-7xl mx-auto px-6">
            <SectionLabel icon={Star} label="Media" title="Unit Gallery" />
            <Gallery galleries={galleryImages} />
          </div>
        </section>
      )}

      {/* ══ FOOTER ══ */}
      <footer className="bg-[hsl(220,64%,8%)] border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            {/* Unit identity */}
            <div className="flex items-center gap-4">
              {unit.logo && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/15 shrink-0">
                  <Image src={unit.logo} alt={unit.abbreviation} fill className="object-contain p-1" />
                </div>
              )}
              <div>
                <p className="font-heading font-black text-white uppercase tracking-wide text-sm">{unit.unit}</p>
                <p className="text-white/40 text-xs mt-0.5">Nigerian Air Force · Air Training Command</p>
              </div>
            </div>

            {/* Back to main site */}
            <Link href="/"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[hsl(45,68%,47%)]/10 border border-[hsl(45,68%,47%)]/25 hover:bg-[hsl(45,68%,47%)]/20 transition-all duration-200 group">
              <div className="relative w-8 h-8 shrink-0">
                <Image src={ATCLogo} alt="ATC" fill className="object-contain" />
              </div>
              <div>
                <p className="text-[hsl(45,68%,47%)] font-bold text-xs uppercase tracking-wider">Air Training Command HQ</p>
                <p className="text-white/40 text-[10px]">Visit Main Site</p>
              </div>
              <ExternalLink size={13} className="text-[hsl(45,68%,47%)]/60 group-hover:text-[hsl(45,68%,47%)] transition-colors ml-1" />
            </Link>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/25 text-xs">
            <p>© {new Date().getFullYear()} {unit.abbreviation?.toUpperCase()}. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span>Wings of Integrity</span>
              <span className="w-1 h-1 rounded-full bg-[hsl(45,68%,47%)]/40" />
              <span>Service to the Nation</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
