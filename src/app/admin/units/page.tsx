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
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Units</h1>

        <Link
          href="/admin/units/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Unit
        </Link>
      </div>

      <div className="space-y-4">
        {units.map((u) => (
          <div
            key={u._id}
            className="p-4 bg-white rounded shadow flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{u.unit}</h2>
              <p className="text-sm text-gray-500">{u.location}</p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/units/${u.slug}`}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                View
              </Link>

              <Link
                href={`/admin/units/${u._id}/edit`}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(u._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
