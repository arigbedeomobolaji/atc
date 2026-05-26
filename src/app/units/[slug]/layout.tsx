/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { UnitNavbar } from "@/components/units/UnitNavbar";

async function getUnit(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/units/slug/${slug}`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function UnitLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { slug } = await params;
  const unit = await getUnit(slug);

  if (!unit || unit.error) return notFound();

  return (
    <div className="bg-[hsl(220,64%,8%)] min-h-screen">
      <UnitNavbar unit={unit} />
      {/* pt accounts for accent bar (32px) + main navbar (56px) = 88px */}
      <main className="pt-[88px]">{children}</main>
    </div>
  );
}
