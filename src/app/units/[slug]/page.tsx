/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound } from "next/navigation";
import Image from "next/image";
import UnitPageClient from "./UnitPageClient";
import { Shield, Radio, Cpu, History, Users, Wrench } from "lucide-react";

import { UnitNavbar } from "@/components/units/UnitNavbar";
import { UnitGalleryCarousel } from "@/components/units/UnitGalleryCarousel";

async function getUnit(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/units/slug/${slug}`,
    { cache: "no-store" }
  );

  return res.json();
}

async function getGallery(unitId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/units/${unitId}/gallery`,
    { cache: "no-store" }
  );

  return res.json();
}

export default async function UnitPage({ params }: any) {
  const { slug } = await params;

  const unit = await getUnit(slug);
  if (!unit || unit.error) return notFound();

  const gallery = await getGallery(unit._id);

  return (
    <div className="bg-gray-50">
      <UnitNavbar unit={unit} />

      {/* HERO */}
      <section className="relative h-[70vh] w-full">
        <Image
          src={unit.logo || "/images/default.jpg"}
          alt={unit.unit}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/60 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {unit.unit}
          </h1>
          <p className="text-blue-200 mt-4">{unit.role}</p>
        </div>
      </section>

      {/* 🔥 CLIENT SIDE UI */}
      <UnitPageClient unit={unit} gallery={gallery} />
    </div>
  );
}
