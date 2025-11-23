"use client";

import { motion } from "framer-motion";
import { HeaderText } from "./HeaderText";

const historyParagraphs = [
  {
    content:
      "The Air Training Command (ATC) is one of the 6 field commands of the Nigerian Air Force (NAF). It is an offshoot of the erstwhile Training Command (TC), which was among the foremost commands of the NAF. The TC was responsible for both air and ground training functions in the NAF, however, it was unbundled in 2017 into the Air and Ground Training Commands; headquartered in Kaduna and Enugu, respectively. The splitting of the TC into the Air and Ground Training Commands was borne out of the need for the NAF to expand its Order of Battle, and at the same time, to streamline the span of control of the field commands.",
  },
  {
    content:
      "As a key force sustainment component of the NAF, the ATC is mandated to execute NAF’s local training policies aimed at optimizing all locally available resources for the eventual fulfilment of manpower requirements of the Service. To accomplish this mandate, the ATC is organized into several units with platforms strategically spread across the Country to carry out different assigned roles and responsibilities for the ATC.",
  },
];

export default function ATCHistory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.25 }}
      className="py-10 leading-10"
      id="history"
    >
      <HeaderText title="History" />

      <div className="text-gray-800 leading-9 space-y-10 px-10 lg:px-20">
        {historyParagraphs.map((item, index) => (
          <motion.p
            key={index}
            className="indent-8"
            initial={{ opacity: 0, x: -30, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.94 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
          >
            {item.content}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
