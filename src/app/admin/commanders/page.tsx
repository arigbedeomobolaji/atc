/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CommandersPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/commanders")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Commanders</h1>

        <Link
          href="/admin/commanders/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Commander
        </Link>
      </div>

      {data.map((c) => (
        <div
          key={c._id}
          className="flex justify-between items-center p-4 bg-white rounded shadow mb-3"
        >
          <h2>
            {c.rank} {c.name}
          </h2>

          <div className="flex gap-2 mt-2">
            {/* <Link href={`/admin/commanders/${c._id}`}>View</Link> */}

            <Link href={`/admin/commanders/${c._id}/edit`}>Edit</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
