"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Home, ChevronRight, ExternalLink } from "lucide-react";
import { ATCUnit } from "@/utils/units_in_ATC";
import Image from "next/image";
import Link from "next/link";
import ATCLogo from "../../assets/ATC_logo_big_trans.png";

const NAV_LINKS = [
  { label: "Overview",        id: "about" },
  { label: "Responsibilities", id: "responsibilities" },
  { label: "Capabilities",    id: "capabilities" },
  { label: "Leadership",      id: "leadership" },
  { label: "Gallery",         id: "gallery" },
];

export function UnitNavbar({ unit }: { unit: ATCUnit }) {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]   = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
    setOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ── Accent bar: back-link to main site ── */}
      <div className="bg-[hsl(220,64%,8%)] border-b border-[hsl(45,68%,47%)]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/50 hover:text-[hsl(45,68%,47%)] text-[10px] font-semibold uppercase tracking-widest transition-colors duration-200 group"
          >
            <Home size={10} />
            <span className="hidden sm:inline">Air Training Command HQ</span>
            <span className="sm:hidden">ATC HQ</span>
            <ExternalLink size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <div className="flex items-center gap-1.5 text-white/30 text-[10px] tracking-wider">
            <span className="hidden sm:inline">HQ ATC</span>
            <ChevronRight size={9} />
            <span className="text-white/55">{unit.abbreviation?.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* ── Main navbar ── */}
      <div className={`transition-all duration-300 ${
        scrolled
          ? "bg-[hsl(220,64%,12%)]/98 backdrop-blur-md border-b border-white/10 shadow-xl"
          : "bg-[hsl(220,64%,16%)]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          {/* Unit identity */}
          <div className="flex items-center gap-3 shrink-0">
            {unit.logo ? (
              <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white/10 border border-white/20 shrink-0">
                <Image
                  src={unit.logo}
                  alt={unit.abbreviation}
                  fill
                  className="object-contain p-0.5"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-[hsl(45,68%,47%)]/20 border border-[hsl(45,68%,47%)]/30 flex items-center justify-center shrink-0">
                <span className="text-[hsl(45,68%,47%)] text-[9px] font-black">
                  {unit.abbreviation?.slice(0, 3)?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="leading-tight hidden sm:block">
              <p className="text-white font-black text-xs uppercase tracking-[0.15em] line-clamp-1">
                {unit.abbreviation?.toUpperCase()}
              </p>
              <p className="text-white/40 text-[9px] uppercase tracking-widest">
                Nigerian Air Force
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 bg-white/15 mx-1" />

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  active === link.id
                    ? "text-[hsl(45,68%,47%)] bg-white/[0.06]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Back to main site CTA */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[hsl(45,68%,47%)]/40 text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-wider hover:bg-[hsl(45,68%,47%)] hover:text-[hsl(220,64%,16%)] transition-all duration-200"
            >
              <div className="relative w-4 h-4 shrink-0">
                <Image src={ATCLogo} alt="ATC" fill className="object-contain" />
              </div>
              HQ ATC
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-screen w-[min(300px,88vw)] bg-[hsl(220,64%,12%)] border-l border-white/10 flex flex-col lg:hidden z-50 shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 shrink-0">
                    <Image src={ATCLogo} alt="ATC" fill className="object-contain" />
                  </div>
                  <p className="text-white text-xs font-black uppercase tracking-widest">
                    {unit.abbreviation?.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="p-4 border-t border-white/10">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] font-black text-sm uppercase tracking-wide hover:bg-[hsl(45,68%,55%)] transition-colors"
                >
                  <Home size={14} />
                  Back to ATC Main Site
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
