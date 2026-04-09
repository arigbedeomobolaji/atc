// Section Header Component
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, scaleIn } from "./Motion";

export default function SectionHeader({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: React.ElementType;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="relative mb-10 flex items-center gap-4 mx-5 xl:mx-10"
    >
      {Icon && (
        <motion.div
          variants={scaleIn}
          className="p-3 rounded-lg bg-gradient-to-br from-[#1a365d] to-[#2d5a9d] shadow-lg"
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      )}
      <div className="flex-1">
        <h4 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#1a365d]">
          {title}
        </h4>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-16 h-1 bg-[#c9a227] rounded-full" />
          <div className="w-8 h-0.5 bg-[#1a365d]/30 rounded-full" />
          <div className="w-4 h-0.5 bg-[#1a365d]/20 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}
