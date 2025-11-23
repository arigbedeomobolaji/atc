"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  { label: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const pathname = usePathname();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if (window.scrollY > 100) setIsFixed(true);
      else setIsFixed(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex justify-between items-center px-5 py-1 transition-all duration-500 ${
        isFixed
          ? " bg-blue-950/95 text-white backdrop-blur-md shadow-md"
          : "bg-transparent"
      } relative z-50`}
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

      {/* Links + Hamburger */}
      <div className="flex gap-5 items-center">
        {/* Desktop Links*/}
        <motion.div
          animate={{ opacity: isFixed ? 1 : 1, y: isFixed ? 0 : 0 }}
          transition={{ duration: 0.4 }}
          className={`font-link text-[16px] font-medium hidden md:flex gap-5 lg:gap-14 ${
            isFixed ? "pointer-events-auto" : "pointer-events-auto"
          }`}
        >
          {/* DESKTOP NAV */}
          {navItems.map((item, index) => {
            const parentActive = isParentActive(item.href, item.children);

            return item.children ? (
              <div key={index} className="relative group">
                {/* Parent is now clickable */}
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 hover:-translate-y-1 transition-all duration-300 
          ${
            parentActive
              ? "font-semibold underline underline-offset-20"
              : "hover:text-blue-300"
          }`}
                >
                  <span>{item.label}</span>
                  <ChevronDown size={16} strokeWidth={1.5} />
                </Link>

                {/* Dropdown */}
                <div className="absolute -left-10 top-3 p-3 hidden group-hover:block">
                  <div className="bg-white text-black rounded-lg shadow-lg py-2 min-w-[180px]">
                    {item.children.map((child, cIndex) => (
                      <Link
                        key={cIndex}
                        href={child.href}
                        className={`block px-4 py-2 text-sm hover:-translate-y-0.5 transition-all duration-300
                ${
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
              </div>
            ) : (
              <Link
                key={index}
                href={item.href}
                className={`hover:-translate-y-1 transition-all duration-300 
        ${
          isActive(item.href)
            ? "font-semibold underline underline-offset-20"
            : "hover:text-blue-300"
        }`}
              >
                {item.label}
              </Link>
            );
          })}
        </motion.div>

        {/* Hamburger Icon */}
        <div
          className="hover:-translate-y-1 transition-all duration-300 cursor-pointer md:hidden"
          onClick={() => setShowNavbar((prev) => !prev)}
        >
          {showNavbar ? (
            <X size={40} strokeWidth={1.5} />
          ) : (
            <TextAlignEnd size={40} strokeWidth={1.5} />
          )}
        </div>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {showNavbar && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed  inset-0 min-h-screen min-w-screen bg-blue-950/95 flex flex-col md:flex-row items-center justify-center gap-5 sm:gap-10 text-white backdrop-blur-sm z-50"
          >
            {/* Left Side: Contact + Socials */}
            <div className="md:absolute md:left-16 md:top-1/2 md:-translate-y-1/2 order-2 sm:order-1 flex items-center justify-center gap-5">
              <div className="font-link">
                <h2 className="font-sans pb-2 text-xl">Get in Touch</h2>
                <div className="flex items-center gap-2 hover:-translate-y-1 transition-all duration-300">
                  <Mail size={28} strokeWidth={1.5} />
                  <span className="text-gray-300 text-xs">atc@naf.mil.ng</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="font-sans text-lg mb-2">Social Links</h1>
                <div className="flex gap-2">
                  <Link
                    href="#"
                    className="flex items-center gap-2 hover:-translate-y-1 transition-all duration-300"
                  >
                    <Facebook size={28} strokeWidth={1.5} />
                    <span className="text-gray-300 hidden md:block">
                      Facebook
                    </span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-2 hover:-translate-y-1 transition-all duration-300"
                  >
                    <Instagram size={28} strokeWidth={1.5} />
                    <span className="text-gray-300  hidden md:block">
                      Instagram
                    </span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-2 hover:-translate-y-1 transition-all duration-300"
                  >
                    <Youtube size={28} strokeWidth={1.5} />
                    <span className="text-gray-300  hidden md:block">
                      YouTube
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side: Menu Links (MOBILE) */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-opensans text-[16px] flex flex-col gap-6 lg:gap-10 text-right w-full pr-10"
            >
              {navItems.map((item, index) => {
                const parentActive = isParentActive(item.href, item.children);

                return item.children ? (
                  <div key={index} className="flex flex-col gap-2">
                    {/* Parent link is routable + also toggles children */}
                    <button
                      className={`flex items-center justify-end gap-2 transition-all duration-300
          ${
            parentActive
              ? "underline underline-offset-20 font-semibold"
              : "hover:text-blue-200"
          }`}
                      onClick={() => setMobileAboutOpen((prev) => !prev)}
                    >
                      <Link href={item.href}>{item.label}</Link>

                      <ChevronDown
                        size={20}
                        strokeWidth={1.5}
                        className={`hover:-translate-y-0.5 transition-transform duration-300 
            ${mobileAboutOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Children */}
                    <AnimatePresence initial={false}>
                      {mobileAboutOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-col text-[16px] bg-primary/50 space-y-5 rounded-md shadow-md"
                        >
                          {item.children.map((child, cIndex) => (
                            <Link
                              key={cIndex}
                              href={child.href}
                              className={`text-white rounded-sm hover:-translate-y-0.5 transition-all duration-300
                  ${
                    isActive(child.href)
                      ? "underline underline-offset-20 font-semibold"
                      : "text-gray-300 hover:text-white"
                  }`}
                              onClick={() => setShowNavbar(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={index}
                    href={item.href}
                    className={`transition-all duration-300 
        ${
          isActive(item.href)
            ? "underline underline-offset-20 font-semibold"
            : "hover:text-blue-200"
        }`}
                    onClick={() => setShowNavbar(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </motion.div>

            {/* Close Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <X
                size={50}
                strokeWidth={1.5}
                className="absolute top-5 right-5 cursor-pointer hover:rotate-90 transition-transform duration-300"
                onClick={() => setShowNavbar(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
