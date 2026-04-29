/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as Dialog from "@radix-ui/react-dialog";

export default function LeadershipCard({ leader }: any) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="flex gap-5 cursor-pointer group">
          {/* ================= LEFT IMAGE CARD ================= */}
          <div className="relative w-[240px] h-[340px] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={leader.image?.trim()}
              alt={leader.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            {/* 🔥 MULTI GRADIENT OVERLAY (premium look) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-indigo-900/30" />

            {/* TEXT */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h5 className="font-bold">{leader.name}</h5>
              <p className="text-xl font-bold tracking-wide">
                {leader.appointmentAbbreviation}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {leader.appointment}
              </p>
            </div>
          </div>

          {/* ================= RIGHT STACK ================= */}
          <div className="flex flex-col gap-4 w-[220px] h-[340px]">
            {/* ===== TOP CARD (GLASS GRADIENT) ===== */}
            <div className="flex-[0.9] rounded-2xl p-4 text-white flex flex-col justify-center text-center relative overflow-hidden shadow-lg">
              {/* gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-primary" />
              <div className="absolute inset-0 bg-black/20" />

              {/* content */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold leading-tight">
                  {leader.name}
                </h3>

                <p className="text-2xl font-extrabold mt-2 tracking-wider">
                  {leader.appointmentAbbreviation}
                </p>
              </div>
            </div>

            {/* ===== BOTTOM CARD (RICH CONTENT) ===== */}
            <div className="flex-[1.1] rounded-2xl p-4 shadow-lg relative overflow-hidden">
              {/* soft gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />

              <div className="relative z-10 flex flex-col justify-between h-full text-center">
                {/* top */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {leader.name}
                  </p>

                  <p className="font-semibold text-sm mt-1 leading-tight">
                    {leader.appointment}
                    {leader.appointmentAbbreviation && (
                      <span className="text-primary">
                        {" ("}
                        {leader.appointmentAbbreviation} {")"}
                      </span>
                    )}
                  </p>
                </div>

                {/* middle */}
                <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                  {leader.bio?.slice(0, 120)}...
                </p>

                {/* bottom */}
                <p className="text-[10px] text-gray-400 mt-2 line-clamp-1">
                  {leader.awards}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Trigger>

      {/* ================= MODAL ================= */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-[999]" />

        <Dialog.Content className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh] relative animate-fadeIn">
            <Dialog.Close className="absolute top-4 right-4 text-xl">
              ✕
            </Dialog.Close>

            <h2 className="text-xl font-bold mb-2">{leader.name}</h2>

            <p className="text-sm text-gray-500 mb-4">
              {leader.rank} • {leader.appointment}
            </p>

            <p className="text-sm whitespace-pre-line leading-relaxed">
              {leader.bio}
            </p>

            <div className="mt-4 text-sm">
              <strong>Awards:</strong> {leader.awards}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
