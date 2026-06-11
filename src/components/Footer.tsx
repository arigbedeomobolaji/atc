import {
  Facebook,
  Instagram,
  Youtube,
  Plane,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NAFLogo from "../assets/NAF_logo.png";
import ATCLogo from "../assets/ATC_logo_big_trans.png";

const LINKS = [
  { label: "About ATC", href: "/about" },
  { label: "Our History", href: "/about#history" },
  { label: "Organization", href: "/about/organization" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Our Platforms", href: "/gallery/platforms" },
  { label: "Contact Us", href: "/contact" },
  { label: "Admin", href: "/admin/login" },
];

const SOCIAL = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-[hsl(220,64%,16%)] text-white">
      {/* Gold accent top bar */}
      <div className="h-1 bg-gradient-to-r from-[hsl(45,68%,47%)] via-[hsl(350,66%,33%)] to-[hsl(45,68%,47%)]" />

      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src={ATCLogo}
                alt="ATC Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white leading-tight">
                Air Training Command
              </p>
              <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] mt-0.5">
                Nigerian Air Force · Kaduna
              </p>
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            Delivering advanced aviation training, operational excellence, and
            disciplined leadership for the Nigerian Air Force.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3 mt-5">
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center text-white/60 hover:bg-[hsl(45,68%,47%)] hover:text-[hsl(220,64%,16%)] transition-all duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(45,68%,47%)] mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2.5">
            {LINKS.map(({ label, href }) => (
              <li
                key={label}
                className={
                  label === "Admin"
                    ? "opacity-0 hover:opacity-100 transition-opacity duration-300"
                    : ""
                }
              >
                <Link
                  href={href}
                  className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[hsl(45,68%,47%)]/50 group-hover:bg-[hsl(45,68%,47%)] transition-colors shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Relevant links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(45,68%,47%)] mb-4">
            External Links
          </h4>
          <div className="space-y-3">
            <a
              href="https://www.airforce.mil.ng/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/6 hover:bg-white/12 border border-white/8 transition-all duration-200 group"
            >
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src={NAFLogo}
                  alt="NAF"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-[hsl(45,68%,47%)] transition-colors">
                  NAF Official Website
                </p>
                <p className="text-[11px] text-white/40">airforce.mil.ng</p>
              </div>
            </a>
          </div>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(45,68%,47%)] mb-4">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-3">
              <Plane
                size={15}
                className="text-[hsl(45,68%,47%)] mt-0.5 shrink-0"
              />
              <span>
                Air Training Command, Kaduna Military Airport, Kaduna, Nigeria.
              </span>
            </li>{" "}
            <li className="flex items-start gap-3">
              <MessageCircle
                size={15}
                className="text-[hsl(45,68%,47%)] mt-0.5 shrink-0"
              />
              <span>PMB 2247</span>
            </li>
            {/* <li className="flex items-center gap-3">
              <Phone size={15} className="text-[hsl(45,68%,47%)] shrink-0" />
              <span>+234 — — — — —</span>
            </li> */}
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-[hsl(45,68%,47%)] shrink-0" />
              <span>hqtc@airforce.mil.ng</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/30">
          <span>
            © {new Date().getFullYear()} Air Training Command, Nigerian Air
            Force. All rights reserved.
          </span>
          <span>Developed by 441 CIS Group, Kaduna</span>
        </div>
      </div>
    </footer>
  );
}
