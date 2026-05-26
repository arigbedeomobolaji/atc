/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, Search, MapPin, ChevronRight, Users } from "lucide-react";

export default function CommandersPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/units")
      .then(r => r.json())
      .then(setUnits)
      .finally(() => setLoading(false));
  }, []);

  const filtered = units.filter(u =>
    u.unit.toLowerCase().includes(search.toLowerCase()) ||
    u.abbreviation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">Commanders</h1>
          <p className="text-slate-400 text-sm mt-0.5">Select a unit to manage its commanders</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search units…"
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-slate-200 rounded-2xl">
          <Building2 size={36} className="mx-auto text-slate-200 mb-3" />
          <p className="text-slate-400 text-sm">No units match your search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(unit => (
            <Link
              key={unit._id}
              href={`/admin/commanders/unit/${unit._id}`}
              className="group flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-[hsl(220,64%,16%)]/30 hover:shadow-md transition-all duration-200"
            >
              {unit.logo ? (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                  <Image src={unit.logo} alt={unit.abbreviation} fill className="object-contain p-1" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[hsl(220,64%,16%)]/8 border border-[hsl(220,64%,16%)]/10 flex items-center justify-center shrink-0">
                  <Building2 size={20} className="text-[hsl(220,64%,16%)]/40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-[hsl(220,64%,16%)] transition-colors">{unit.unit}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-black text-[hsl(220,64%,16%)] uppercase tracking-wider bg-[hsl(220,64%,16%)]/8 px-2 py-0.5 rounded">
                    {unit.abbreviation}
                  </span>
                  {unit.location && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin size={9} />{unit.location}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-[hsl(220,64%,16%)] transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
