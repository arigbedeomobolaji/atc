"use client";

import { motion } from "framer-motion";
import { HeaderText } from "./HeaderText";

// Achievements as objects
const achievements = [
  {
    title: "Attainment of 10,000 Flying Hours on the A-29 Super Tucano:",
    content:
      "Within a remarkably short period of 3 years, the NAF’s A-29 Super Tucano fleet under ATC control achieved a landmark 10,000 flying hours. This milestone underscores the Command’s high operational tempo, improved pilot proficiency, and efficient maintenance culture.",
  },
  {
    title: "Conduct of a 4,800-Hour Periodic Depot Maintenance Inspection:",
    content:
      "Another significant accomplishment was the successful in-country 4,800-hour Periodic Depot Maintenance Inspection on the DO-228 aircraft (NAF 031). This complex engineering procedure was executed entirely by indigenous engineers and technicians of the 431 Engineering Group, demonstrating enhanced local technical capacity and reduced reliance on foreign maintenance facilities.",
  },
  {
    title: "Expansion of Operational Capabilities:",
    content:
      "The Command has made progressive strides in strengthening its operational readiness. Through intensified mission planning, improved training cycles, and continuous equipment optimization, ATC has supported the NAF’s operational commitments nationwide with increased efficiency.",
  },
  {
    title: "Improved Training, Research, and Development (R&D):",
    content:
      "In line with its mandate, ATC has achieved significant growth in advanced aircrew training, capacity building programs, and technical development. The Command’s R&D efforts have resulted in innovations that support local maintenance, simulation, and operational enhancement initiatives.",
  },
  {
    title: "Strengthening of Civil–Military Cooperation (CIMIC):",
    content:
      "The ATC continues to foster positive relationships with host communities through targeted outreach programs, educational support, humanitarian assistance, and public engagement activities. These initiatives enhance trust, cooperation, and societal support for the NAF’s activities.",
  },
];

export default function ATCAchievements() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
      className="py-10 leading-10"
      id="achievements"
    >
      <HeaderText title="Achievements" />

      <div className="text-gray-800 leading-9 space-y-10 px-10 lg:px-20">
        <p className="indent-10">
          Apart from the ATC’s active participation in the Nation’s
          counter-terrorism and counter-insurgency operations, which have
          yielded significant and measurable results, the Command has equally
          recorded several notable achievements. Highlighted below is the
          summary of these key accomplishments:
        </p>

        {/* Animated Achievements */}
        <ol className="list-[upper-alpha] space-y-6 pl-6 marker:text-primary">
          {achievements.map((item, index) => (
            <motion.li
              key={index}
              className="pl-5 lg:pl-10"
              initial={{ opacity: 0, x: -30, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
            >
              <strong>{item.title}</strong> {item.content}
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}
