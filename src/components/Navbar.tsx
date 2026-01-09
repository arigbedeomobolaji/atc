/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import ATCLogo from "../assets/ATC_logo_big_trans.png";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  TextAlignEnd,
  X,
  Youtube,
  ChevronDown,
  LogIn,
  LogOut,
  Newspaper,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ----------------------
// NAV ITEMS (updated)
// ----------------------
const navItems = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "History", href: "/about#history" },
      { label: "Achievements", href: "/about#achievements" },
      { label: "Organization", href: "/about/organization" },
    ],
  },
  {
    label: "Our Gallery",
    href: "/gallery",
    children: [{ label: "Our Platforms", href: "/gallery/platforms" }],
  },
  { label: "News", href: "/news" },
  { label: "Contact Us", href: "/contact" },
];

const adminNavItems = [
  {
    label: "Admin",
    href: "#",
    children: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Create News", href: "/admin/news/create" },
      { label: "Manage News", href: "/admin/news" },
    ],
  },
];

export function Navbar() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  // Check if Admin is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isAdmin = isLoggedIn;
  const mobileNav = [...navItems, ...(isLoggedIn ? adminNavItems : [])];

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      if (json.authenticated) setIsLoggedIn(true);
    }
    check();
  }, []);

  async function logout() {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    const json = await res.json();

    if (json.success) {
      setIsLoggedIn(false);
      router.replace("/");
    }
  }

  function isParentActive(parentHref: string, children?: any[]) {
    if (pathname === parentHref) return true;
    if (!children) return false;
    return children.some((c) => pathname.startsWith(c.href));
  }

  function isActive(href: string) {
    return pathname === href;
  }

  // Detect scroll to hide desktop links when fixed
  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`px-5 py-1 transition-all duration-500 ${
        isFixed
          ? " bg-blue-950/95 text-white backdrop-blur-md shadow-md"
          : "bg-transparent"
      }  relative z-50 `}
    >
      <div
        className={`w-full h-full max-w-7xl mx-auto flex justify-between items-center `}
      >
        {/* Logo */}
        <div className="relative w-24 h-20">
          <Link href="/">
            <Image
              src={ATCLogo}
              alt="ATC Logo"
              priority
              className="w-full h-full object-contain hover:-translate-y-1 transition-all duration-300"
            />
          </Link>
        </div>

        {/* Moving text */}
        <div
          className={`overflow-hidden w-56 lg:w-72 xl:w-80 2xl:w-80 font-mono ${
            isFixed ? "text-white" : "text-dark"
          }`}
        >
          <motion.p
            className="capitalize font-extrabold text-sm lg:text-md xl:text-xl 2xl:text-2xl whitespace-nowrap"
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "0%", "100%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            WE TRAIN TO DEFEND
          </motion.p>
        </div>

        {/* Desktop Links */}
        <div className="flex gap-5 items-center">
          <motion.div className="font-link text-[16px] font-medium hidden lg:flex gap-5 lg:gap-14">
            {[...navItems, ...(isLoggedIn ? adminNavItems : [])].map(
              (item, index) => {
                const parentActive = isParentActive(item.href, item.children);

                const desktopChildren = item.children || [];

                return (
                  <div key={index} className="relative group">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 hover:-translate-y-1 transition-all duration-300 ${
                        parentActive
                          ? "font-semibold underline underline-offset-20"
                          : "hover:text-blue-300"
                      }`}
                    >
                      <span>{item.label}</span>
                      {desktopChildren.length > 0 && <ChevronDown size={16} />}
                    </Link>

                    {desktopChildren.length > 0 && (
                      <div className="absolute -left-10 top-3 p-3 hidden group-hover:block">
                        <div className="bg-white text-black rounded-lg shadow-lg py-2 min-w-[200px]">
                          {desktopChildren.map((child, cIndex) => (
                            <Link
                              key={cIndex}
                              href={child.href}
                              className={`block px-4 py-2 text-sm hover:-translate-y-0.5 transition-all duration-300 ${
                                isActive(child.href)
                                  ? "bg-blue-100 text-blue-700 font-medium"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            )}

            {/* LOGIN / LOGOUT */}
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="flex items-center gap-2 hover:text-blue-300"
              >
                <LogIn size={18} />
                Login
              </Link>
            ) : (
              <button
                onClick={logout}
                className="flex items-center gap-2 hover:text-red-300"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </motion.div>

          {/* Hamburger */}
          <div
            className="hover:-translate-y-1 transition-all duration-300 cursor-pointer lg:hidden"
            onClick={() => setShowNavbar((prev) => !prev)}
          >
            {showNavbar ? <X size={40} /> : <TextAlignEnd size={40} />}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showNavbar && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 min-h-screen bg-blue-950/95 flex flex-col items-center justify-center gap-6 text-white z-50"
            >
              {/* MOBILE NAV ITEMS */}
              {mobileNav.map((item, index) => {
                const mobileChildren = item.children || [];
                const isOpen = mobileDropdown === item.label;
                return (
                  <div key={index} className="flex flex-col text-center">
                    <button
                      className="text-xl font-semibold flex items-center justify-center gap-2"
                      onClick={() =>
                        setMobileDropdown(isOpen ? null : item.label)
                      }
                    >
                      {item.label}
                      {mobileChildren.length > 0 && (
                        <ChevronDown
                          size={20}
                          className={`transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="flex flex-col gap-3 mt-3"
                        >
                          {mobileChildren.map((child, cIndex) => (
                            <Link
                              key={cIndex}
                              href={child.href}
                              onClick={() => setShowNavbar(false)}
                              className="text-gray-300 hover:text-white"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              {/* MOBILE LOGIN / LOGOUT */}
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-white"
                  onClick={() => setShowNavbar(false)}
                >
                  <LogIn size={22} /> Login
                </Link>
              ) : (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-red-300"
                >
                  <LogOut size={22} /> Logout
                </button>
              )}

              {/* Close Button */}
              <X
                size={50}
                className="absolute top-5 right-5 cursor-pointer"
                onClick={() => setShowNavbar(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
