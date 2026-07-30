"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X, Star, Medal } from "lucide-react";

interface Leader {
  _id: string;
  name: string;
  rank: string;
  appointment: string;
  appointmentAbbreviation: string;
  image?: string;
  bio?: string;
  awards?: string;
}

export default function LeadershipCard({ leader }: { leader: Leader }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <motion.div
          whileHover="hover"
          className="relative w-[220px] shrink-0 cursor-pointer group select-none"
        >
          {/* ── Portrait ─── */}
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
            {/* Image */}
            {leader.image ? (
              <img
                src={leader.image}
                alt={leader.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-[hsl(220,64%,22%)] flex items-center justify-center">
                <Star size={48} className="text-[hsl(45,68%,47%)]/40" />
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,10%)]/95 via-[hsl(220,64%,16%)]/30 to-transparent" />

            {/* Appointment badge */}
            <div className="absolute top-3 right-3">
              <div className="px-2 py-0.5 rounded-full bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-[10px] font-black uppercase tracking-wider shadow">
                {leader.appointmentAbbreviation}
              </div>
            </div>

            {/* Name / rank block */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-[11px] text-[hsl(45,68%,47%)] font-bold uppercase tracking-[0.2em] mb-0.5">
                {leader.rank}
              </p>
              <h5 className="text-white font-bold text-sm leading-tight line-clamp-2">
                {leader.name}
              </h5>
              <p className="text-white/50 text-[11px] mt-1 truncate">
                {leader.appointment}
              </p>
            </div>

            {/* Hover gold border */}
            <motion.div
              variants={{ hover: { opacity: 1 } }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-2xl ring-2 ring-[hsl(45,68%,47%)] pointer-events-none"
            />
          </div>

          {/* Bottom gold line */}
          <motion.div
            variants={{ hover: { scaleX: 1 } }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 h-0.5 bg-gradient-to-r from-[hsl(45,68%,47%)] to-transparent origin-left rounded-full"
          />
        </motion.div>
      </Dialog.Trigger>

      {/* ── Bio modal ─── */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[999] data-[state=open]:animate-fadeIn" />

        <Dialog.Content className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden"
          >
            {/* Modal header stripe */}
            <div className="h-1.5 bg-gradient-to-r from-[hsl(220,64%,16%)] via-[hsl(350,66%,33%)] to-[hsl(45,68%,47%)]" />

            <div className="p-6 sm:p-8">
              <div className="flex gap-5 mb-6">
                {/* Thumbnail */}
                {leader.image && (
                  <div className="relative w-24 h-28 rounded-xl overflow-hidden shrink-0 shadow-md">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-[10px] font-black uppercase tracking-wider mb-2">
                    <Star size={9} />
                    {leader.appointmentAbbreviation}
                  </div>
                  <h2 className="text-xl font-black text-[hsl(220,64%,16%)] font-heading uppercase tracking-wide leading-tight">
                    {leader.name}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {leader.rank} {leader.appointment}
                  </p>
                </div>
                <Dialog.Close className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors self-start shrink-0">
                  <X size={18} />
                </Dialog.Close>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-12 h-0.5 bg-[hsl(45,68%,47%)] rounded-full" />
                <div className="w-6 h-px bg-slate-200 rounded-full" />
              </div>

              {/* Bio */}
              {leader.bio && (
                <div className="mb-5">
                  <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                    {leader.bio}
                  </p>
                </div>
              )}

              {/* Awards */}
              {leader.awards && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[hsl(220,64%,16%)]/4 border border-[hsl(220,64%,16%)]/8">
                  <Medal
                    size={16}
                    className="text-[hsl(45,68%,47%)] mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[hsl(220,64%,16%)] mb-1">
                      Awards & Decorations
                    </p>
                    <p className="text-sm text-slate-600">{leader.awards}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
