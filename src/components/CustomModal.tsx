"use client";

import { X } from "lucide-react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function CustomModal({
  isOpen,
  onClose,
  children,
}: CustomModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-4 max-w-xl w-[95%] h-[80vh] shadow-xl animate-fadeIn overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <X size={22} className="cursor-pointer text-red-500 text-2xl" />
        </button>
        <div className="pt-5">{children}</div>
      </div>
    </div>
  );
}
