/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { UnitNavbar } from "@/components/units/UnitNavbar";

async function getUnit(slug: string) {
  //   console.log({ slug, message: "Fetching unit data" });
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

  console.log({ slug, unit });

  if (!unit || unit.error) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen">
      <UnitNavbar unit={unit} />
      <main className="pt-20">
        {" "}
        {/* Add padding so navbar no cover content */}
        {children}
      </main>
    </div>
  );
}
