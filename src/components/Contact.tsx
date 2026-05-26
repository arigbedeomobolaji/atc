"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { GoogleMap } from "@/components/GoogleMap";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Radio, Map } from "lucide-react";

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: "Phone",
    lines: ["+234 (0) 000 0000 000", "+234 (0) 111 1111 111"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@airtrainingcommand.mil.ng", "support@airtrainingcommand.mil.ng"],
  },
  {
    icon: Clock,
    title: "Office Hours",
    lines: ["Mon – Fri: 8:00am – 4:00pm", "Sat – Sun: Closed"],
  },
];

export default function ContactPage() {
  return (
    <div className="bg-[hsl(220,64%,8%)]">
      <Navbar />

      {/* ── Page hero ── */}
      <section className="relative bg-[hsl(220,64%,8%)] pt-20 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-64 bg-[hsl(45,68%,47%)]/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-5">
            <Radio size={11} className="text-[hsl(350,66%,55%)] animate-pulse" />
            <span className="text-[hsl(45,68%,47%)] text-[11px] font-black uppercase tracking-[0.3em]">
              Air Training Command
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-tight tracking-wide mb-4">
            Contact Us
          </h1>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-20 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
            <div className="w-10 h-0.5 rounded-full bg-white/20" />
          </div>
          <p className="text-white/55 text-base max-w-xl leading-relaxed">
            Reach out to Air Training Command Headquarters through any of our
            official communication channels below.
          </p>
        </div>
      </section>

      {/* ── Address bar ── */}
      <div className="bg-[hsl(45,68%,47%)] py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
          <MapPin size={16} className="text-[hsl(220,64%,16%)] shrink-0" />
          <p className="text-[hsl(220,64%,16%)] font-bold text-sm">
            Headquarters: PMB 4512, Mando, Kaduna, Nigeria.
          </p>
        </div>
      </div>

      {/* ── Contact cards ── */}
      <section className="bg-[hsl(220,64%,10%)] py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          {/* Cards row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {CONTACT_CARDS.map(({ icon: Icon, title, lines }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative p-7 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-[hsl(45,68%,47%)]/40 hover:bg-white/[0.08] transition-all duration-300 group overflow-hidden"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1 ring-[hsl(45,68%,47%)]/30" />

                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(45,68%,47%)]/15 border border-[hsl(45,68%,47%)]/30 flex items-center justify-center mb-5 group-hover:bg-[hsl(45,68%,47%)]/25 transition-colors duration-300">
                    <Icon size={20} className="text-[hsl(45,68%,47%)]" />
                  </div>
                  <h3 className="font-heading font-black text-white uppercase tracking-wide text-sm mb-3">
                    {title}
                  </h3>
                  {lines.map((line) => (
                    <p key={line} className="text-white/55 text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
                <Mail size={16} className="text-[hsl(220,64%,16%)]" />
              </div>
              <div>
                <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">
                  Send a Message
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="w-10 h-0.5 rounded-full bg-[hsl(45,68%,47%)]" />
                  <div className="w-5 h-px rounded-full bg-white/20" />
                </div>
              </div>
            </div>
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* ── Map ── */}
      <section className="bg-[hsl(220,64%,13%)] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
              <Map size={16} className="text-[hsl(220,64%,16%)]" />
            </div>
            <div>
              <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">
                Our Location
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="w-10 h-0.5 rounded-full bg-[hsl(45,68%,47%)]" />
                <div className="w-5 h-px rounded-full bg-white/20" />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <GoogleMap />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
