"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Unit = {
  _id: string;
  unit: string;
  abbreviation: string;
};

export default function GalleryDashboard() {
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    fetch("/api/units")
      .then((res) => res.json())
      .then(setUnits);
  }, []);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">Gallery Management</h1>

      {units.map((unit) => (
        <Link
          key={unit._id}
          href={`/admin/gallery/${unit._id}`}
          className="block bg-white p-4 rounded-lg shadow"
        >
          {unit.unit}
        </Link>
      ))}
    </div>
  );
}
