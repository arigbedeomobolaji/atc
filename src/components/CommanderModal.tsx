/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { useState } from "react";

export function CommanderModal({ commander }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer p-4 bg-gray-50 rounded-xl hover:shadow"
      >
        <p className="font-semibold">
          {commander.rank} {commander.name}
        </p>
        <p className="text-sm text-gray-500">{commander.serviceNumber}</p>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="fixed inset-0 z-50"
      >
        <div className="flex items-center justify-center min-h-screen bg-black/50">
          <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md w-full">
            <Image
              src={commander.image || "/images/default-avatar.png"}
              className="w-32 h-32 object-cover rounded-full mx-auto"
              alt={commander.name}
            />

            <h2 className="text-xl font-bold text-center mt-4">
              {commander.rank} {commander.name}
            </h2>

            <p className="text-center text-gray-500">
              {commander.serviceNumber}
            </p>

            <p className="text-center mt-2">
              {commander.startDate} → {commander.endDate || "Present"}
            </p>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
