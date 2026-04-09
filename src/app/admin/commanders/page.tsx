/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CommandersPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/units")
      .then((res) => res.json())
      .then(setUnits);
  }, []);

  const filtered = units.filter((u) =>
    u.unit.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-bold text-[#1a365d]">
          Commanders Management
        </h4>
      </div>

      {/* SEARCH */}
      <div>
        <label htmlFor="search" className="sr-only">
          Search units
        </label>
        <input
          id="search"
          placeholder="Search units..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 p-3 border rounded-lg"
        />
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((unit) => (
          <Link
            key={unit._id}
            href={`/admin/commanders/unit/${unit._id}`}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4 border-[#1a365d]"
          >
            <p className="font-semibold text-lg text-[#1a365d]">{unit.unit}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
