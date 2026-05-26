"use client";

import { motion } from "framer-motion";
import { Award, Plane, Wrench, TrendingUp, FlaskConical, Handshake } from "lucide-react";

const MILESTONES = [
  {
    icon: Plane,
    badge: "A",
    title: "10,000 Flying Hours — A-29 Super Tucano",
    body: "Within a remarkably short period of 3 years, the NAF's A-29 Super Tucano fleet under ATC control achieved a landmark 10,000 flying hours. This milestone underscores the Command's high operational tempo, improved pilot proficiency, and efficient maintenance culture.",
  },
  {
    icon: Wrench,
    badge: "B",
    title: "4,800-Hour Depot Maintenance (DO-228)",
    body: "The successful in-country 4,800-hour Periodic Depot Maintenance Inspection on the DO-228 aircraft (NAF 031) was executed entirely by indigenous engineers and technicians of the 431 Engineering Group, demonstrating enhanced local technical capacity.",
  },
  {
    icon: TrendingUp,
    badge: "C",
    title: "Expansion of Operational Capabilities",
    body: "Through intensified mission planning, improved training cycles, and continuous equipment optimization, ATC has supported the NAF's operational commitments nationwide with increased efficiency and readiness.",
  },
  {
    icon: FlaskConical,
    badge: "D",
    title: "Training, Research & Development Growth",
    body: "ATC has achieved significant growth in advanced aircrew training, capacity building programs, and technical development. R&D efforts have resulted in innovations supporting local maintenance, simulation, and operational enhancement initiatives.",
  },
  {
    icon: Handshake,
    badge: "E",
    title: "Civil–Military Cooperation (CIMIC)",
    body: "ATC fosters positive relationships with host communities through targeted outreach programs, educational support, humanitarian assistance, and public engagement activities that enhance trust and cooperation.",
  },
];

export default function ATCAchievements() {
  return (
    <section
      id="achievements"
      className="relative py-24 bg-[hsl(220,64%,13%)] overflow-hidden"
    >
      {/* Diagonal stripe */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[hsl(45,68%,47%)]/6 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-14"
        >
          <div className="w-10 h-10 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
            <Award size={18} className="text-[hsl(220,64%,16%)]" />
          </div>
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-black text-white uppercase tracking-wide">
              Key Milestones
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-16 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
              <div className="w-8 h-0.5 rounded-full bg-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-white/55 text-sm leading-relaxed max-w-2xl mb-10 pl-1 border-l-2 border-[hsl(45,68%,47%)]  ml-0 pl-4"
        >
          Apart from active participation in national counter-terrorism and
          counter-insurgency operations, the Command has recorded several notable
          achievements reflecting operational excellence and technical advancement.
        </motion.p>

        {/* Milestone cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MILESTONES.map(({ icon: Icon, badge, title, body }, i) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className="relative p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[hsl(45,68%,47%)]/40 hover:bg-white/[0.07] transition-all duration-300 group overflow-hidden"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[hsl(45,68%,47%)]/15 border border-[hsl(45,68%,47%)]/30 flex items-center justify-center text-[hsl(45,68%,47%)] text-xs font-black">
                {badge}
              </div>

              <div className="w-11 h-11 rounded-xl bg-[hsl(45,68%,47%)]/12 border border-[hsl(45,68%,47%)]/25 flex items-center justify-center mb-5 group-hover:bg-[hsl(45,68%,47%)]/22 transition-colors duration-300">
                <Icon size={20} className="text-[hsl(45,68%,47%)]" />
              </div>

              <h4 className="font-heading font-black text-white uppercase tracking-wide text-sm leading-snug mb-3">
                {title}
              </h4>

              <p className="text-white/50 text-xs leading-relaxed">{body}</p>

              {/* Bottom accent bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                className="mt-5 h-0.5 bg-gradient-to-r from-[hsl(45,68%,47%)] to-transparent origin-left rounded-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
