"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Youtube,
  Menu,
  X,
  Plane,
  Building2,
} from "lucide-react";
import ATCLogo from "../assets/ATC_logo_big_trans.png";

type Unit = { _id: string; abbreviation: string; slug: string; unit: string };

const NAV_ITEMS = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "History & Achievements", href: "/about#history" },
      { label: "Organization", href: "/about/organization" },
    ],
  },
  {
    label: "Gallery",
    href: "/gallery",
    children: [{ label: "Our Platforms", href: "/gallery/platforms" }],
  },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    fetch("/api/units")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setUnits(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return (
      pathname === href ||
      pathname.startsWith(href + "/") ||
      pathname.startsWith(href + "#")
    );
  }

  function isParentActive(item: (typeof NAV_ITEMS)[0]) {
    return (
      isActive(item.href) ||
      (item.children?.some((c) => isActive(c.href)) ?? false)
    );
  }

  return (
    <header className="sticky top-0 z-50">
      {/* ── Accent bar ─────────────────────────── */}
      <div className="bg-[hsl(220,64%,16%)] border-b border-[hsl(45,68%,47%)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/70 text-[11px] font-mono tracking-widest uppercase">
            <Plane size={11} className="text-[hsl(45,68%,47%)]" />
            <span className="hidden sm:inline">
              Welcome to Air Training Command Kaduna
            </span>
            <span className="sm:hidden">ATC Kaduna</span>
          </div>
          <div className="flex items-center gap-3 text-white/50">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-[hsl(45,68%,47%)] transition-colors"
            >
              <Facebook size={13} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-[hsl(45,68%,47%)] transition-colors"
            >
              <Instagram size={13} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="hover:text-[hsl(45,68%,47%)] transition-colors"
            >
              <Youtube size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main nav ───────────────────────────── */}
      <div className="bg-white/96 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[66px] flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-11 h-11">
              <Image
                src={ATCLogo}
                alt="ATC Logo"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-[12px] font-black text-[hsl(220,64%,16%)] uppercase tracking-[0.15em]">
                Air Training Command
              </p>
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em]">
                Nigerian Air Force
              </p>
            </div>
          </Link>

          {/* ─── Desktop links ─── */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-auto">
            {NAV_ITEMS.map((item) => (
              <DesktopNavItem
                key={item.href}
                item={item}
                active={isParentActive(item)}
                isItemActive={isActive}
              />
            ))}
            <UnitsDropdown units={units} activeSlug={pathname.startsWith("/units/") ? pathname.split("/")[2] : ""} />
          </nav>

          {/* ─── Hamburger ─── */}
          <div className="ml-auto lg:ml-0 flex items-center shrink-0">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 rounded-lg text-[hsl(220,64%,16%)] hover:bg-slate-100 transition-colors"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ──────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-screen w-[min(320px,90vw)] bg-white shadow-2xl flex flex-col lg:hidden z-50"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-[hsl(220,64%,16%)]">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={ATCLogo}
                      alt="ATC"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    ATC Kaduna
                  </p>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {NAV_ITEMS.map((item) => {
                  const children = item.children ?? [];
                  const expanded = mobileExpanded === item.label;
                  const active = isParentActive(item);

                  return (
                    <div key={item.href} className="mb-0.5">
                      <button
                        onClick={() => {
                          if (children.length === 0) {
                            router.push(item.href);
                            setMobileOpen(false);
                          } else {
                            setMobileExpanded(expanded ? null : item.label);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          active
                            ? "bg-[hsl(220,64%,16%)] text-white"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{item.label}</span>
                        {children.length > 0 && (
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${
                              expanded ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 mt-0.5 mb-1 pl-4 border-l-2 border-[hsl(45,68%,47%)]/40 space-y-0.5">
                              {children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                    isActive(child.href)
                                      ? "text-[hsl(220,64%,16%)] font-semibold"
                                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Units section in mobile */}
                {units.length > 0 && (
                  <div className="mb-0.5">
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === "Units" ? null : "Units")}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        pathname.startsWith("/units/")
                          ? "bg-[hsl(220,64%,16%)] text-white"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Building2 size={15} />
                        Units
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${mobileExpanded === "Units" ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {mobileExpanded === "Units" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 mt-0.5 mb-1 pl-4 border-l-2 border-[hsl(45,68%,47%)]/40 space-y-0.5">
                            {units.map((u) => (
                              <Link
                                key={u._id}
                                href={`/units/${u.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                  pathname === `/units/${u.slug}`
                                    ? "text-[hsl(220,64%,16%)] font-semibold"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                              >
                                {u.abbreviation.toUpperCase()}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ── Units mega-dropdown (desktop) ─────────── */
function UnitsDropdown({ units, activeSlug }: { units: Unit[]; activeSlug: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = activeSlug.length > 0;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (units.length === 0) return null;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors relative ${
          isActive
            ? "text-[hsl(220,64%,16%)]"
            : "text-slate-600 hover:text-[hsl(220,64%,16%)] hover:bg-slate-50"
        }`}
      >
        Units
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        {isActive && (
          <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[hsl(45,68%,47%)]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 pt-2 w-[520px]"
          >
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-3">
              <div className="h-0.5 bg-gradient-to-r from-[hsl(45,68%,47%)] to-[hsl(220,64%,16%)] mx-3 mb-3 rounded-full" />
              <p className="px-4 pb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Command Units
              </p>
              <div className="grid grid-cols-3 gap-0.5 px-2">
                {units.map((u) => (
                  <Link
                    key={u._id}
                    href={`/units/${u.slug}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors group ${
                      activeSlug === u.slug
                        ? "bg-[hsl(220,64%,16%)] text-white"
                        : "text-slate-600 hover:bg-[hsl(220,64%,16%)]/6 hover:text-[hsl(220,64%,16%)]"
                    }`}
                  >
                    <Building2
                      size={11}
                      className={`shrink-0 ${activeSlug === u.slug ? "text-[hsl(45,68%,47%)]" : "text-slate-300 group-hover:text-[hsl(45,68%,47%)]"}`}
                    />
                    <span className="truncate">{u.abbreviation.toUpperCase()}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Desktop dropdown item ──────────────────── */
function DesktopNavItem({
  item,
  active,
  isItemActive,
}: {
  item: (typeof NAV_ITEMS)[0];
  active: boolean;
  isItemActive: (href: string) => boolean;
}) {
  const children = item.children ?? [];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => children.length && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={item.href}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors relative group ${
          active
            ? "text-[hsl(220,64%,16%)]"
            : "text-slate-600 hover:text-[hsl(220,64%,16%)] hover:bg-slate-50"
        }`}
      >
        {item.label}
        {children.length > 0 && (
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
        {/* Active indicator */}
        {active && (
          <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[hsl(45,68%,47%)]" />
        )}
      </Link>

      <AnimatePresence>
        {open && children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 pt-2 min-w-[200px]"
          >
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1.5">
              {/* Gold accent strip */}
              <div className="h-0.5 bg-gradient-to-r from-[hsl(45,68%,47%)] to-[hsl(220,64%,16%)] mx-3 mb-1.5 rounded-full" />
              {children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
                    isItemActive(child.href)
                      ? "bg-[hsl(220,64%,16%)]/6 text-[hsl(220,64%,16%)] font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
