import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { CheckCircle2 } from "lucide-react";
import { fadeInUp, staggerContainer } from "./Motion";

// const customSectionFadeInUp: Variants = {
//   hidden: { opacity: 0, y: 40 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// const customSectionStagger: Variants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.1, delayChildren: 0.2 },
//   },
// };

export default function CustomSections({
  sections,
}: {
  sections: { title: string; items: string[] }[];
}) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => (
        <section
          key={index}
          className={`py-16 px-6 ${
            index % 2 === 0 ? "bg-slate-100" : "bg-white"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            {/* ✅ Section Header (same style as others) */}
            <SectionHeader title={section.title} icon={CheckCircle2} />

            {/* ✅ Items Grid (same style as responsibilities) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="naf-card p-6 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#1a365d] to-[#2d5a9d] shadow-md">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <p className="text-slate-800 font-medium leading-relaxed">
                        {item}
                      </p>

                      <span className="text-xs text-slate-400 uppercase tracking-wider mt-2 block">
                        {section.title} {String(itemIndex + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ))}
    </>
  );
}
