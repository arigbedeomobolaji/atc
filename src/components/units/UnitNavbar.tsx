"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ATCUnit } from "@/utils/units_in_ATC";
import Image from "next/image";

export function UnitNavbar({ unit }: { unit: ATCUnit }) {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Responsibilities", id: "responsibilities" },
    { label: "Leadership", id: "leadership" },
    { label: "Gallery", id: "gallery" },
    { label: "Links", id: "links" },
  ];
  console.log(unit, "In UnitNavbar");

  return (
    <nav className="fixed w-full bg-[#0B1C2D] text-white z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex gap-1 font-semibold text-lg">
          <Image
            src={unit.logo || "/placeholder.png"}
            alt={unit.abbreviation}
            width={35}
            height={35}
            className="object-contain rounded-full"
          />
          {unit ? unit.abbreviation : "Hello"}
        </div>

        {/* Desktop */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="hover:text-yellow-400 transition"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-[#10273F] flex flex-col px-6 pb-4 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="hover:text-yellow-400"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
