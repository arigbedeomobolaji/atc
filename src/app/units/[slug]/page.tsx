import { notFound } from "next/navigation";
import { units_in_atc } from "@/utils/units_in_ATC";
import Image from "next/image";
import { UnitNavbar } from "@/components/units/UnitNavbar";
import { UnitGalleryCarousel } from "@/components/units/UnitGalleryCarousel";
export async function generateStaticParams() {
  return units_in_atc.map((unit) => ({
    slug: unit.slug,
  }));
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const unit = units_in_atc.find((u) => u.slug === slug);
  console.log({ slug, unit });
  if (!unit) return notFound();

  return (
    <div className="bg-gray-50 text-gray-800">
      <UnitNavbar unit={unit} />

      {/* GALLERY */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10">Gallery</h2>
          <UnitGalleryCarousel
            images={["/images/ATC_HQ.jpeg", "/images/Handing_over.jpeg"]}
          />
        </div>
      </section>

      {/* HERO SECTION */}
      <section id="home" className="relative h-[70vh] w-full">
        <Image
          src={unit.imageSrc}
          alt={unit.unit}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            {unit.unit}
          </h1>
          <p className="text-yellow-400 mt-4 text-lg">{unit.role}</p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-6">About the Unit</h2>
        <p className="leading-relaxed text-gray-700">{unit.fullDescription}</p>
      </section>

      {/* RESPONSIBILITIES */}
      <section id="responsibilities" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Core Responsibilities</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {unit.responsibilities.map((task, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                {task}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* AIRCRAFT */}
      {unit.aircraft && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">Aircraft / Equipment</h2>
            <div className="flex flex-wrap gap-4">
              {unit.aircraft.map((air, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#0B1C2D] text-white rounded-full text-sm"
                >
                  {air}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LINKS */}
      {unit.links.length > 0 && (
        <section id="links" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">Related Links</h2>
            <div className="space-y-3">
              {unit.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="block text-blue-600 hover:underline"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
