/* eslint-disable @typescript-eslint/no-explicit-any */

// /Users/mac/omobolaji/atc/src/app/admin/units/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UnitsAdminPage() {
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/units")
      .then((res) => res.json())
      .then(setUnits);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this unit?")) return;

    const res = await fetch(`/api/units/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setUnits((prev) => prev.filter((u) => u._id !== id));
    }
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-bold text-foreground">Units</h4>

        <Link
          href="/admin/units/create"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow hover:opacity-90"
        >
          + Create Unit
        </Link>
      </div>

      <div className="space-y-4">
        {units.map((u) => (
          <div
            key={u._id}
            className="p-5 border border-border rounded-xl shadow-sm flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold text-foreground">{u.unit}</h4>
              <p className="text-sm text-muted-foreground">{u.location}</p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/units/${u.slug}`}
                className="bg-primary  text-white px-3 py-1 rounded-md hover:bg-secondary"
              >
                View
              </Link>

              <Link
                href={`/admin/units/${u._id}/edit`}
                className="px-3 py-1 rounded-md bg-secondary text-primary font-semibold"
              >
                Edit
              </Link>

              {/* <button
                onClick={() => handleDelete(u._id)}
                className="px-3 py-1 rounded-md bg-primary  text-white"
              >
                Delete
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
