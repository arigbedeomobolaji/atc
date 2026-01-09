/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/news/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NewsItemType } from "@/utils/types";

export default function AdminNewsList() {
  const router = useRouter();
  const [rows, setRows] = useState<NewsItemType[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const limit = 10;
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    q: debouncedSearch,
    sortBy,
    sortOrder,
    admin: "true",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // reset pagination on search
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      setLoading(false);
      if (!json.authenticated) router.push("/admin/login");
    }
    check();
  }, [router]);

  useEffect(() => {
    fetch("/api/news/list")
      .then((r) => r.json())
      .then((j) => {
        setRows(j.news || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        q: debouncedSearch,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/news/list?${params}`);
      const j = await res.json();

      setRows(j.news || []);
      setTotalPages(j.totalPages || 1);
      setLoading(false);
    }

    load();
  }, [page, debouncedSearch, sortBy, sortOrder]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Manage News</h2>
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, content or date..."
          className="border px-3 py-2 rounded w-full lg:w-1/2"
        />

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="createdAt">Date</option>
          <option value="title">Title</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="border px-3 py-2 rounded"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

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
                className="px-3 bg-dark text-white py-1 b rounded"
              >
                Edit
              </Link>
              <button
                className="px-3 py-1 bg-red-400 text-white rounded"
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
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-6 flex-wrap">
        {loading ? (
          <div className="p-8">Loading...</div>
        ) : !totalPages ? (
          <p>No News</p>
        ) : (
          Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {p}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
