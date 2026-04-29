/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Image from "next/image";
import { Medal, Award, Calendar, User, ChevronLeft } from "lucide-react";
import Link from "next/link";

async function getCommanderData(unitId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/commanders/current/${unitId}`,
    { cache: "no-store" }
  );
  return res.json();
}

async function getUnit(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/units/slug/${slug}`
  );
  return res.json();
}

export default async function CommanderFullPage({ params }: any) {
  const { slug } = await params;
  const unit = await getUnit(slug);
  const commander = await getCommanderData(unit._id);

  if (!commander) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href={`/units/${slug}`}
        className="flex items-center text-[#1a365d] hover:text-[#c9a227] mb-8 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back to Unit Profile</span>
      </Link>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Left Side: Portrait & Basic Info */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-4 border-[#c9a227] shadow-xl">
              <Image
                src={commander.portrait}
                alt={commander.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-6 p-4 bg-[#1a365d] text-white rounded-lg">
              <div className="flex flex-col items-center gap-2 mb-2">
                <Medal className="text-[#c9a227] w-5 h-5" />
                <span className="font-bold">
                  {commander.rank + " " + commander.name}
                </span>
                {commander.awards && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#c9a227]" />
                    <span className="text-[#c9a227] text-xs font-medium">
                      {commander.awards}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-white/80">{commander.appointment}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Full Bio & Awards */}
        <div className="md:col-span-2 space-y-10">
          <div>
            <h1 className="text-4xl font-bold text-[#1a365d] mb-2">
              {commander.name}
            </h1>
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  Assumed Command:{" "}
                  {new Date(commander.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] border-b-2 border-[#c9a227] inline-block mb-4">
              Biography
            </h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {commander.bio} {/* Full bio here */}
            </div>
          </section>

          {commander.awards && (
            <section>
              <h2 className="text-2xl font-bold text-[#1a365d] mb-4">
                Honors & Awards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* We split by comma and trim any extra space */}
                {commander.awards.split(",").map((award: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm"
                  >
                    <Award className="text-[#c9a227] w-5 h-5" />
                    <span className="text-sm font-medium text-slate-800">
                      {award.trim()}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
