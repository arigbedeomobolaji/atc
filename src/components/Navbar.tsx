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
  LogIn,
  LogOut,
  Menu,
  X,
  Plane,
} from "lucide-react";
import ATCLogo from "../assets/ATC_logo_big_trans.png";

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

const ADMIN_NAV: typeof NAV_ITEMS = [
  {
    label: "Admin",
    href: "/admin/dashboard",
    children: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Manage News", href: "/admin/news" },
      { label: "Create News", href: "/admin/news/create" },
      { label: "Manage Units", href: "/admin/units" },
      { label: "Create Unit", href: "/admin/units/create" },
      { label: "Manage Gallery", href: "/admin/gallery" },
      { label: "Manage Events", href: "/admin/events" },
      { label: "Create Event", href: "/admin/events/create" },
      { label: "Commanders", href: "/admin/commanders" },
      { label: "Add Commander", href: "/admin/commanders/create" },
      { label: "HQ Leadership", href: "/admin/command-leadership" },
      { label: "Add Leader", href: "/admin/command-leadership/create" },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => setIsLoggedIn(j.authenticated));
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    router.replace("/");
  }

  const allNav = [...NAV_ITEMS, ...(isLoggedIn ? ADMIN_NAV : [])];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/") || pathname.startsWith(href + "#");
  }

  function isParentActive(item: (typeof NAV_ITEMS)[0]) {
    return isActive(item.href) || (item.children?.some((c) => isActive(c.href)) ?? false);
  }

  return (
    <header className="sticky top-0 z-50">
      {/* ── Accent bar ─────────────────────────── */}
      <div className="bg-[hsl(220,64%,16%)] border-b border-[hsl(45,68%,47%)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/70 text-[11px] font-mono tracking-widest uppercase">
            <Plane size={11} className="text-[hsl(45,68%,47%)]" />
            <span className="hidden sm:inline">Welcome to Air Training Command Kaduna</span>
            <span className="sm:hidden">ATC Kaduna</span>
          </div>
          <div className="flex items-center gap-3 text-white/50">
            <a href="#" aria-label="Facebook" className="hover:text-[hsl(45,68%,47%)] transition-colors">
              <Facebook size={13} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-[hsl(45,68%,47%)] transition-colors">
              <Instagram size={13} />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-[hsl(45,68%,47%)] transition-colors">
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
            {allNav.map((item) => (
              <DesktopNavItem
                key={item.href}
                item={item}
                active={isParentActive(item)}
                isItemActive={isActive}
              />
            ))}
          </nav>

          {/* ─── Right cluster ─── */}
          <div className="ml-auto lg:ml-0 flex items-center gap-2 shrink-0">
            {/* Auth button */}
            {!isLoggedIn ? (
              <Link
                href="/admin/login"
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-[hsl(220,64%,16%)] border border-[hsl(220,64%,16%)]/20 hover:bg-[hsl(220,64%,16%)] hover:text-white transition-all duration-200"
              >
                <LogIn size={14} />
                Admin
              </Link>
            ) : (
              <button
                onClick={logout}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-[hsl(350,66%,33%)] border border-[hsl(350,66%,33%)]/20 hover:bg-[hsl(350,66%,33%)] hover:text-white transition-all duration-200"
              >
                <LogOut size={14} />
                Logout
              </button>
            )}

            {/* Hamburger */}
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
                    <Image src={ATCLogo} alt="ATC" fill className="object-contain" />
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
                {allNav.map((item) => {
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
                            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
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
              </nav>

              {/* Drawer footer */}
              <div className="p-4 border-t border-slate-100">
                {!isLoggedIn ? (
                  <Link
                    href="/admin/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[hsl(220,64%,16%)] text-white font-semibold text-sm hover:bg-[hsl(220,64%,20%)] transition-colors"
                  >
                    <LogIn size={16} />
                    Admin Login
                  </Link>
                ) : (
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[hsl(350,66%,33%)] text-white font-semibold text-sm hover:bg-[hsl(350,66%,28%)] transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
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
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
