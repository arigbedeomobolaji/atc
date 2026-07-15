"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  FilePlus,
  Trash2,
  Pencil,
  ArrowUp,
  ArrowDown,
  ImageOff,
  Plane,
} from "lucide-react";

type Platform = {
  _id: string;
  caption: string;
  description: string;
  image: string | null;
  order: number;
};

export default function PlatformsAdminPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/platforms")
      .then((r) => r.json())
      .then((j) => setPlatforms(j.platforms || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this platform?")) return;
    const res = await fetch(`/api/platforms/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPlatforms((prev) => prev.filter((p) => p._id !== id));
      toast.success("Platform deleted");
    } else {
      toast.error("Failed to delete");
    }
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...platforms];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setPlatforms(next);
  }

  async function saveOrder() {
    setSaving(true);
    const res = await fetch("/api/platforms/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: platforms.map((p) => p._id) }),
    });
    setSaving(false);
    if (res.ok) toast.success("Order saved");
    else toast.error("Failed to save order");
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[hsl(220,64%,16%)] flex items-center justify-center shrink-0">
            <Plane size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">
              Platforms
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Manage aircraft and equipment platforms
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {platforms.length > 1 && (
            <button
              onClick={saveOrder}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Order"}
            </button>
          )}
          <Link
            href="/admin/platforms/create"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors"
          >
            <FilePlus size={15} />
            Add Platform
          </Link>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : platforms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Plane size={40} className="mb-3 text-slate-200" />
          <p className="font-medium">No platforms yet</p>
          <p className="text-sm mt-1">
            <Link href="/admin/platforms/create" className="text-[hsl(220,64%,16%)] underline">
              Add your first platform
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">Use the arrows to reorder, then click Save Order.</p>
          {platforms.map((platform, index) => (
            <div
              key={platform._id}
              className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-slate-200 transition-shadow min-w-0"
            >
              {/* Up/Down controls */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="p-1 rounded text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  aria-label="Move up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === platforms.length - 1}
                  className="p-1 rounded text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  aria-label="Move down"
                >
                  <ArrowDown size={13} />
                </button>
              </div>

              {/* Thumbnail */}
              <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 hidden sm:flex items-center justify-center">
                {platform.image ? (
                  <Image
                    src={platform.image}
                    alt={platform.caption}
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
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {platform.caption}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {platform.description || "No description"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={`/admin/platforms/${platform._id}/edit`}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[hsl(220,64%,16%)] transition-colors"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(platform._id)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-[hsl(350,66%,33%)] hover:text-white hover:border-[hsl(350,66%,33%)] transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
