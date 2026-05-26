"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FilePlus,
  Newspaper,
  SortAsc,
  SortDesc,
  CheckSquare,
  Square,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { NewsItemType } from "@/utils/types";

const LIMIT = 10;

export default function AdminNewsList() {
  const { checking } = useAuth();

  const [rows, setRows] = useState<NewsItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        q: debouncedSearch,
        sortBy,
        sortOrder,
      });
      const res = await fetch(`/api/news/list?${params}`);
      const j = await res.json();
      setRows(j.news || []);
      setTotalPages(j.totalPages || 1);
    } catch {
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    if (!checking) loadNews();
  }, [checking, loadNews]);

  async function deleteOne(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch("/api/news/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setRows((prev) => prev.filter((r) => r._id !== id));
      toast.success("Article deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function bulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} article(s)?`)) return;
    setBulkDeleting(true);
    let deleted = 0;
    for (const id of selected) {
      try {
        const res = await fetch("/api/news/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) deleted++;
      } catch {
        /* continue */
      }
    }
    setBulkDeleting(false);
    toast.success(`Deleted ${deleted} of ${selected.size} articles`);
    loadNews();
  }

  function toggleAll() {
    if (selected.size === rows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map((r) => r._id as string)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (checking) return <PageSkeleton />;

  const allSelected = rows.length > 0 && selected.size === rows.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">
            News Articles
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage, edit and organise published content
          </p>
        </div>
        <Link
          href="/admin/news/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,20%)] transition-colors"
        >
          <FilePlus size={16} />
          New Article
        </Link>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or content…"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/30"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/30 bg-white"
        >
          <option value="createdAt">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>

        <button
          onClick={() =>
            setSortOrder((o) => (o === "desc" ? "asc" : "desc"))
          }
          className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-50 transition-colors"
          title={sortOrder === "desc" ? "Newest first" : "Oldest first"}
        >
          {sortOrder === "desc" ? (
            <SortDesc size={16} className="text-slate-500" />
          ) : (
            <SortAsc size={16} className="text-slate-500" />
          )}
          <span className="hidden sm:inline text-slate-600">
            {sortOrder === "desc" ? "Newest" : "Oldest"}
          </span>
        </button>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(350,66%,33%)]/8 border border-[hsl(350,66%,33%)]/20">
          <AlertTriangle size={15} className="text-[hsl(350,66%,33%)]" />
          <span className="text-sm font-medium text-[hsl(350,66%,33%)]">
            {selected.size} article{selected.size > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={bulkDelete}
            disabled={bulkDeleting}
            className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(350,66%,33%)] text-white text-sm font-semibold hover:bg-[hsl(350,66%,28%)] transition-colors disabled:opacity-60"
          >
            {bulkDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            Delete selected
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Table header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <button onClick={toggleAll} className="shrink-0">
            {allSelected ? (
              <CheckSquare
                size={16}
                className="text-[hsl(220,64%,16%)]"
              />
            ) : (
              <Square size={16} className="text-slate-400" />
            )}
          </button>
          <span className="flex-1">Title / Excerpt</span>
          <span className="hidden md:block w-24 text-right">Date</span>
          <span className="w-20 text-right">Actions</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-4">
                <div className="w-4 h-4 rounded bg-slate-100 animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center">
            <Newspaper
              size={36}
              className="mx-auto text-slate-200 mb-3"
            />
            <p className="text-slate-400 text-sm">
              {debouncedSearch
                ? `No results for "${debouncedSearch}"`
                : "No articles yet."}
            </p>
            <Link
              href="/admin/news/create"
              className="mt-3 inline-flex items-center gap-2 text-sm text-[hsl(220,64%,16%)] hover:underline"
            >
              <FilePlus size={14} /> Write your first article
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.map((row) => {
              const id = row._id as string;
              const isSelected = selected.has(id);
              return (
                <div
                  key={id}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-colors group ${
                    isSelected ? "bg-[hsl(220,64%,16%)]/4" : "hover:bg-slate-50"
                  }`}
                >
                  <button
                    onClick={() => toggleOne(id)}
                    className="shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare
                        size={16}
                        className="text-[hsl(220,64%,16%)]"
                      />
                    ) : (
                      <Square
                        size={16}
                        className="text-slate-300 group-hover:text-slate-400"
                      />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {row.title}
                    </p>
                    {row.excerpt && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {row.excerpt}
                      </p>
                    )}
                  </div>

                  <span className="hidden md:block w-24 text-right text-xs text-slate-400 shrink-0">
                    {row.createdAt
                      ? new Date(row.createdAt as string).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short", year: "2-digit" }
                        )
                      : ""}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/admin/news/edit/${id}/${row.slug}`}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-xs font-medium hover:bg-[hsl(220,64%,20%)] transition-colors"
                    >
                      <Pencil size={12} />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    <button
                      onClick={() => deleteOne(id, row.title)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={12} />
                      <span className="hidden sm:inline">Del</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-[hsl(220,64%,16%)] text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>

          <span className="ml-2 text-sm text-slate-400">
            Page {page} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-10 w-48 bg-slate-100 rounded-lg" />
      <div className="h-10 bg-slate-100 rounded-lg" />
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-14 bg-slate-50 border-b border-slate-100"
          />
        ))}
      </div>
    </div>
  );
}

