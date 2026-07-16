"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Images,
  FilePlus,
  Pencil,
  Trash2,
  ImageOff,
  Building2,
  Globe,
  Loader2,
  Tag,
  Search,
  X,
} from "lucide-react";

type Album = {
  _id: string;
  title: string;
  description: string;
  category: string;
  unitId: string | null;
  unitName: string | null;
  coverImage: string | null;
  images: { url: string; publicId: string; caption: string }[];
  date: string;
};

type Unit = { _id: string; unit: string };

const CATEGORY_LABEL: Record<string, string> = {
  CEREMONY: "Ceremonies & Parades",
  TRAINING: "Training & Education",
  EXERCISE: "Exercises & Operations",
  LEADERSHIP: "Headquarters & Leadership",
  INFRASTRUCTURE: "Infrastructure & Facilities",
  COMMUNITY: "Community & Social Events",
  CADETS: "Students & Cadets Life",
  HISTORY: "History & Archives",
  UNITS: "Units & Departments",
};

const CATEGORY_SHORT: Record<string, string> = {
  CEREMONY: "Ceremonies",
  TRAINING: "Training",
  EXERCISE: "Exercises",
  LEADERSHIP: "Leadership",
  INFRASTRUCTURE: "Infrastructure",
  COMMUNITY: "Community",
  CADETS: "Cadets",
  HISTORY: "History",
  UNITS: "Units",
};

const CATEGORY_COLOR: Record<string, string> = {
  CEREMONY: "bg-amber-50 text-amber-600",
  TRAINING: "bg-emerald-50 text-emerald-600",
  EXERCISE: "bg-blue-50 text-blue-600",
  LEADERSHIP: "bg-[hsl(220,64%,16%)]/10 text-[hsl(220,64%,16%)]",
  INFRASTRUCTURE: "bg-slate-100 text-slate-600",
  COMMUNITY: "bg-violet-50 text-violet-600",
  CADETS: "bg-pink-50 text-pink-600",
  HISTORY: "bg-orange-50 text-orange-600",
  UNITS: "bg-teal-50 text-teal-600",
};

const SELECT =
  "px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors cursor-pointer";

export default function GalleryAdminPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState(""); // "" = all, "command" = null unitId, unitId string = specific unit

  useEffect(() => {
    Promise.all([
      fetch("/api/albums").then((r) => r.json()),
      fetch("/api/units").then((r) => r.json()),
    ]).then(([albumJson, unitJson]) => {
      setAlbums(albumJson.albums || []);
      setUnits(Array.isArray(unitJson) ? unitJson : []);
      setLoading(false);
    });
  }, []);

  // Derive only categories that actually exist in the data
  const availableCategories = useMemo(() => {
    const seen = new Set(albums.map((a) => a.category));
    return Array.from(seen).sort();
  }, [albums]);

  // Derive only units that actually have albums
  const availableUnits = useMemo(() => {
    const unitIds = new Set(albums.map((a) => a.unitId).filter(Boolean));
    return units.filter((u) => unitIds.has(u._id));
  }, [albums, units]);

  const hasCommandAlbums = useMemo(
    () => albums.some((a) => !a.unitId),
    [albums]
  );

  // Apply all three filters client-side
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return albums.filter((a) => {
      if (categoryFilter && a.category !== categoryFilter) return false;
      if (unitFilter === "command" && a.unitId !== null) return false;
      if (unitFilter && unitFilter !== "command" && a.unitId !== unitFilter) return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.description?.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [albums, categoryFilter, unitFilter, search]);

  const hasActiveFilter = search || categoryFilter || unitFilter;

  function clearFilters() {
    setSearch("");
    setCategoryFilter("");
    setUnitFilter("");
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}" and all its photos? This cannot be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/albums/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAlbums((prev) => prev.filter((a) => a._id !== id));
      toast.success("Album deleted");
    } else {
      toast.error("Delete failed");
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[hsl(220,64%,16%)] flex items-center justify-center shrink-0">
            <Images size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">
              Gallery Albums
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {loading ? "Loading…" : `${albums.length} album${albums.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
        </div>
        <Link
          href="/admin/gallery/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors"
        >
          <FilePlus size={15} />
          New Album
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search albums…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category dropdown — only shows available categories */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={SELECT}
          disabled={loading}
        >
          <option value="">All Categories</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABEL[cat] ?? cat}
            </option>
          ))}
        </select>

        {/* Unit dropdown — command + units that have albums */}
        <select
          value={unitFilter}
          onChange={(e) => setUnitFilter(e.target.value)}
          className={SELECT}
          disabled={loading}
        >
          <option value="">All</option>
          {hasCommandAlbums && <option value="command">Command-wide</option>}
          {availableUnits.map((u) => (
            <option key={u._id} value={u._id}>
              {u.unit}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {hasActiveFilter && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      {/* Results count when filtering */}
      {hasActiveFilter && !loading && (
        <p className="text-xs text-slate-400">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {search && <> for &ldquo;<span className="text-slate-600 font-medium">{search}</span>&rdquo;</>}
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 border border-slate-200 rounded-2xl">
          <Images size={40} className="mb-3 text-slate-200" />
          {hasActiveFilter ? (
            <>
              <p className="font-medium">No albums match your filters</p>
              <button onClick={clearFilters} className="text-sm mt-2 text-[hsl(220,64%,16%)] underline">
                Clear filters
              </button>
            </>
          ) : (
            <>
              <p className="font-medium">No albums yet</p>
              <p className="text-sm mt-1">
                <Link href="/admin/gallery/create" className="text-[hsl(220,64%,16%)] underline">
                  Create your first album
                </Link>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="w-14 hidden sm:block shrink-0">Cover</span>
            <span className="flex-1">Album</span>
            <span className="hidden sm:block w-28">Category</span>
            <span className="hidden md:block w-36">Belongs to</span>
            <span className="hidden sm:block w-14 text-center">Photos</span>
            <span className="w-28 text-right shrink-0">Actions</span>
          </div>
          <div className="divide-y divide-slate-100">
            {filtered.map((album) => (
              <div
                key={album._id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
              >
                {/* Cover thumbnail */}
                <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 hidden sm:flex items-center justify-center">
                  {album.coverImage ? (
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      width={56}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageOff size={14} className="text-slate-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{album.title}</p>
                  {album.description && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{album.description}</p>
                  )}
                </div>

                {/* Category badge */}
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide w-28 justify-center ${
                    CATEGORY_COLOR[album.category] || "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Tag size={9} />
                  {CATEGORY_SHORT[album.category] || album.category}
                </span>

                {/* Belongs to */}
                <span className="hidden md:flex items-center gap-1 w-36 text-xs text-slate-400 min-w-0">
                  {album.unitName ? (
                    <>
                      <Building2 size={11} className="shrink-0" />
                      <span className="truncate">{album.unitName}</span>
                    </>
                  ) : (
                    <>
                      <Globe size={11} className="shrink-0" />
                      <span>Command-wide</span>
                    </>
                  )}
                </span>

                {/* Photo count */}
                <span className="hidden sm:block w-14 text-center text-sm font-semibold text-slate-600">
                  {album.images?.length ?? 0}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5 w-28 justify-end shrink-0">
                  <Link
                    href={`/admin/gallery/albums/${album._id}`}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 transition-colors"
                    title="Manage photos"
                  >
                    <Images size={11} />
                    <span className="hidden sm:inline">Photos</span>
                  </Link>
                  <Link
                    href={`/admin/gallery/albums/${album._id}/edit`}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[hsl(220,64%,16%)] transition-colors"
                    title="Edit album"
                  >
                    <Pencil size={13} />
                  </Link>
                  <button
                    onClick={() => handleDelete(album._id, album.title)}
                    disabled={deletingId === album._id}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-[hsl(350,66%,33%)] hover:text-white hover:border-[hsl(350,66%,33%)] transition-colors disabled:opacity-50"
                    title="Delete album"
                  >
                    {deletingId === album._id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
