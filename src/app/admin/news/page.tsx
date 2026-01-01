/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/news/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NewsItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  createdAt?: string;
};

export default function AdminNewsList() {
  const [rows, setRows] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news/list")
      .then((r) => r.json())
      .then((j) => {
        setRows(j.news || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Manage News</h2>
      <div className="space-y-3">
        {rows.map((r: any) => (
          <div
            key={r._id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-gray-500">{r.excerpt}</div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/news/edit/${r._id}/${r.slug}`}
                className="px-3 py-1 bg-yellow-400 rounded"
              >
                Edit
              </Link>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={async () => {
                  if (!confirm("Delete?")) return;
                  const res = await fetch("/api/news/delete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: r._id }),
                  });
                  const j = await res.json();
                  if (res.ok) setRows(rows.filter((x) => x._id !== r._id));
                  else alert(j.error || "Failed");
                }}
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
