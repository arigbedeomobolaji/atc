/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import UnitCard from "./UnitCard";
import { useEffect, useState } from "react";

export default function UnitsGrid() {
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/units")
      .then((res) => res.json())
      .then(setUnits);
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
      {units &&
        !!units.length &&
        units.map((item) => (
          <Link key={item.slug} href={`/units/${item.slug}`}>
            <UnitCard
              unit={item.unit}
              description={item.description}
              abbreviation={item.abbreviation.toUpperCase()}
              imageSrc={item.logo}
            />
          </Link>
        ))}
    </div>
  );
}
