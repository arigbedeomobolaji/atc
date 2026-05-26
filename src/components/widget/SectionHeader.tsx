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
          className="p-3 rounded-lg bg-primary shadow-lg"
        >
          <Icon className="w-6 h-6 text-primary-foreground" />
        </motion.div>
      )}
      <div className="flex-1">
        <h4 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary">
          {title}
        </h4>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-16 h-1 bg-secondary rounded-full" />
          <div className="w-8 h-0.5 bg-primary/20 rounded-full" />
          <div className="w-4 h-0.5 bg-primary/10 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}
