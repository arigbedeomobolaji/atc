// "use client";

// import { motion } from "framer-motion";
// import { Award } from "lucide-react";
// import { fadeInUp } from "./widget/Motion";
// import SectionHeader from "./widget/SectionHeader";

// const achievements = [
//   {
//     title: "Attainment of 10,000 Flying Hours on the A-29 Super Tucano:",
//     content:
//       "Within a remarkably short period of 3 years, the NAF’s A-29 Super Tucano fleet under ATC control achieved a landmark 10,000 flying hours. This milestone underscores the Command’s high operational tempo, improved pilot proficiency, and efficient maintenance culture.",
//   },
//   {
//     title: "Conduct of a 4,800-Hour Periodic Depot Maintenance Inspection:",
//     content:
//       "Another significant accomplishment was the successful in-country 4,800-hour Periodic Depot Maintenance Inspection on the DO-228 aircraft (NAF 031). This complex engineering procedure was executed entirely by indigenous engineers and technicians of the 431 Engineering Group, demonstrating enhanced local technical capacity and reduced reliance on foreign maintenance facilities.",
//   },
//   {
//     title: "Expansion of Operational Capabilities:",
//     content:
//       "The Command has made progressive strides in strengthening its operational readiness. Through intensified mission planning, improved training cycles, and continuous equipment optimization, ATC has supported the NAF’s operational commitments nationwide with increased efficiency.",
//   },
//   {
//     title: "Improved Training, Research, and Development (R&D):",
//     content:
//       "In line with its mandate, ATC has achieved significant growth in advanced aircrew training, capacity building programs, and technical development. The Command’s R&D efforts have resulted in innovations that support local maintenance, simulation, and operational enhancement initiatives.",
//   },
//   {
//     title: "Strengthening of Civil–Military Cooperation (CIMIC):",
//     content:
//       "The ATC continues to foster positive relationships with host communities through targeted outreach programs, educational support, humanitarian assistance, and public engagement activities. These initiatives enhance trust, cooperation, and societal support for the NAF’s activities.",
//   },
// ];

// export default function ATCAchievements() {
//   return (
//     <section id="achievements" className="py-16 px-6">
//       <div className="max-w-6xl mx-auto">
//         {/* 🔰 Header */}
//         <SectionHeader title="Achievements" icon={Award} />

//         {/* 📦 Container */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: "-100px" }}
//           variants={fadeInUp}
//           className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-8 md:p-10 relative overflow-hidden"
//         >
//           {/* 🎨 Corner Accent */}
//           <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent" />

//           {/* 🧠 Grid Overlay */}
//           <div className="absolute inset-0 grid-overlay-primary-soft opacity-40" />

//           <div className="relative z-10 space-y-8">
//             {/* 🧾 Intro */}
//             <p className="text-slate-700 leading-loose text-justify">
//               Apart from the ATC’s active participation in national
//               counter-terrorism and counter-insurgency operations, the Command
//               has recorded several notable achievements. Highlighted below are
//               key accomplishments that reflect operational excellence and
//               technical advancement:
//             </p>

//             {/* 🏅 Achievement Blocks */}
//             <div className="space-y-6">
//               {achievements.map((item, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.6, delay: index * 0.1 }}
//                   className="flex items-start gap-4 p-4 rounded-lg
//                   bg-gradient-to-br from-white to-slate-50
//                   border border-slate-200/60
//                   hover:shadow-md transition"
//                 >
//                   {/* 🟡 Index Badge */}
//                   <div
//                     className="flex-shrink-0 w-8 h-8 flex items-center justify-center
//                     rounded-full bg-secondary text-black text-sm font-bold shadow-sm"
//                   >
//                     {String.fromCharCode(65 + index)}
//                   </div>

//                   {/* 📜 Content */}
//                   <div>
//                     <h4 className="font-semibold text-slate-900">
//                       {item.title}
//                     </h4>
//                     <p className="text-slate-700 mt-1 leading-relaxed">
//                       {item.content}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

"use client";

import SectionHeader from "./widget/SectionHeader";
import { Award } from "lucide-react";
import Timeline from "./widget/Timeline";

const achievementsTimeline = [
  {
    date: "Milestone A",
    title: "10,000 Flying Hours – A-29 Super Tucano",
    event:
      "Within a remarkably short period of 3 years, the NAF’s A-29 Super Tucano fleet under ATC control achieved a landmark 10,000 flying hours. This milestone underscores the Command’s high operational tempo, improved pilot proficiency, and efficient maintenance culture.",
  },
  {
    date: "Milestone B",
    title: "4,800-Hour Depot Maintenance (DO-228)",
    event:
      "Another significant accomplishment was the successful in-country 4,800-hour Periodic Depot Maintenance Inspection on the DO-228 aircraft (NAF 031). This complex engineering procedure was executed entirely by indigenous engineers and technicians of the 431 Engineering Group, demonstrating enhanced local technical capacity and reduced reliance on foreign maintenance facilities.",
  },
  {
    date: "Milestone C",
    title: "Expansion of Operational Capabilities",
    event:
      "The Command has made progressive strides in strengthening its operational readiness. Through intensified mission planning, improved training cycles, and continuous equipment optimization, ATC has supported the NAF’s operational commitments nationwide with increased efficiency.",
  },
  {
    date: "Milestone D",
    title: "Training, R&D Growth",
    event:
      "In line with its mandate, ATC has achieved significant growth in advanced aircrew training, capacity building programs, and technical development. The Command’s R&D efforts have resulted in innovations that support local maintenance, simulation, and operational enhancement initiatives.",
  },
  {
    date: "Milestone E",
    title: "Civil–Military Cooperation (CIMIC)",
    event:
      "The ATC continues to foster positive relationships with host communities through targeted outreach programs, educational support, humanitarian assistance, and public engagement activities. These initiatives enhance trust, cooperation, and societal support for the NAF’s activities.",
  },
];

export default function ATCAchievements() {
  return (
    <section id="achievements" className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="Achievements Timeline" icon={Award} />

        <div className="max-w-3xl mx-auto">
          <Timeline items={achievementsTimeline} />
        </div>
      </div>
    </section>
  );
}
