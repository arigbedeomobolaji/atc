/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound } from "next/navigation";
import UnitPageClient from "./UnitPageClient";

import { UnitNavbar } from "@/components/units/UnitNavbar";

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
      {/* 🔥 CLIENT SIDE UI */}
      <UnitPageClient unit={unit} gallery={gallery} />
    </div>
  );
}
