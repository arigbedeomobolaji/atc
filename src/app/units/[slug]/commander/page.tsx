/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Medal, Award, Calendar, ChevronLeft, Star, User } from "lucide-react";
import { abbrevRank } from "@/lib/rankAbbr";

async function getCommanderData(unitId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/commanders/current/${unitId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

async function getUnit(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/units/slug/${slug}`
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function CommanderFullPage({ params }: any) {
  const { slug } = await params;
  const unit = await getUnit(slug);
  if (!unit) return notFound();
  const commander = await getCommanderData(unit._id);

  if (!commander) return notFound();

  const awards = commander.awards
    ? commander.awards.split(",").map((a: string) => a.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-[hsl(220,64%,8%)] py-16">
      <div className="max-w-5xl mx-auto px-6">

        {/* Back link */}
        <Link
          href={`/units/${slug}`}
          className="inline-flex items-center gap-2 text-white/45 hover:text-[hsl(45,68%,47%)] text-sm font-semibold transition-colors duration-200 mb-10 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Back to {unit.abbreviation?.toUpperCase()} Unit Page
        </Link>

        {/* Page title */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Star size={11} className="text-[hsl(45,68%,47%)] fill-[hsl(45,68%,47%)]" />
            <span className="text-[hsl(45,68%,47%)] text-[11px] font-black uppercase tracking-[0.3em]">
              Commander Profile
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white uppercase leading-tight tracking-wide">
            {abbrevRank(commander.rank)} {commander.name}
          </h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-16 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
            <div className="w-8 h-0.5 rounded-full bg-white/20" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">

          {/* ── Left: portrait + meta ── */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-5">
              {/* Portrait */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[hsl(45,68%,47%)]/50 shadow-2xl">
                {commander.portrait ? (
                  <Image
                    src={commander.portrait}
                    alt={commander.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[hsl(220,64%,16%)] flex items-center justify-center">
                    <User size={80} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,64%,8%)]/80 via-transparent to-transparent" />
                <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-[hsl(45,68%,47%)] rounded-tl-xl" />
                <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-[hsl(45,68%,47%)] rounded-br-xl" />
              </div>

              {/* Info card */}
              <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Medal size={14} className="text-[hsl(45,68%,47%)] shrink-0" />
                  <span className="text-white font-bold text-sm">{abbrevRank(commander.rank)} {commander.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-white/40 shrink-0" />
                  <span className="text-white/60 text-xs">{commander.appointment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-white/40 shrink-0" />
                  <span className="text-white/60 text-xs">
                    Assumed Command: {new Date(commander.startDate).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t border-white/10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(45,68%,47%)]/15 border border-[hsl(45,68%,47%)]/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(45,68%,47%)]" />
                    <span className="text-[hsl(45,68%,47%)] text-[10px] font-bold uppercase tracking-wider">Currently Serving</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: bio + awards ── */}
          <div className="md:col-span-2 space-y-8">

            {/* Biography */}
            <div className="p-7 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[hsl(45,68%,47%)]/15 border border-[hsl(45,68%,47%)]/25 flex items-center justify-center">
                  <User size={14} className="text-[hsl(45,68%,47%)]" />
                </div>
                <h2 className="font-heading font-black text-white uppercase tracking-wide text-base">Biography</h2>
              </div>
              <div className="w-10 h-0.5 rounded-full bg-[hsl(45,68%,47%)] mb-5" />
              <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
                {commander.bio}
              </p>
            </div>

            {/* Awards */}
            {awards.length > 0 && (
              <div className="p-7 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(45,68%,47%)]/15 border border-[hsl(45,68%,47%)]/25 flex items-center justify-center">
                    <Award size={14} className="text-[hsl(45,68%,47%)]" />
                  </div>
                  <h2 className="font-heading font-black text-white uppercase tracking-wide text-base">Honours &amp; Awards</h2>
                </div>
                <div className="w-10 h-0.5 rounded-full bg-[hsl(45,68%,47%)] mb-5" />
                <div className="grid sm:grid-cols-2 gap-3">
                  {awards.map((award: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <Award size={14} className="text-[hsl(45,68%,47%)] shrink-0" />
                      <span className="text-white/70 text-xs font-medium">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
