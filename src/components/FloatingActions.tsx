"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

export const FloatingActions = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/2340000000000"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
      >
        <MessageCircle size={22} />
      </motion.a>

      {/* Call Button */}
      <motion.a
        href="tel:+2340000000000"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/80 transition"
      >
        <Phone size={22} />
      </motion.a>
    </div>
  );
};
