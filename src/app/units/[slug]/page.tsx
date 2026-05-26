/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UnitPageClient from "./UnitPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const unit = await getUnit(slug);
  if (!unit || unit.error) return { title: "Unit Not Found | ATC" };
  const description = unit.description?.slice(0, 160) || `${unit.unit} — Nigerian Air Force Air Training Command`;
  return {
    title: `${unit.unit} | Air Training Command`,
    description,
    openGraph: {
      title: unit.unit,
      description,
      images: unit.logo ? [{ url: unit.logo }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: unit.unit,
      description,
    },
  };
}

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

  return <UnitPageClient unit={unit} gallery={gallery} />;
}
