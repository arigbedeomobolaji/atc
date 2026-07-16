"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const INPUT =
  "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors placeholder:text-slate-300";
const LABEL = "block text-sm font-semibold text-slate-700 mb-1.5";

const CATEGORIES = [
  { value: "CEREMONY", label: "Ceremonies & Parades" },
  { value: "TRAINING", label: "Training & Education" },
  { value: "EXERCISE", label: "Exercises & Operations" },
  { value: "LEADERSHIP", label: "Headquarters & Leadership" },
  { value: "INFRASTRUCTURE", label: "Infrastructure & Facilities" },
  { value: "COMMUNITY", label: "Community & Social Events" },
  { value: "CADETS", label: "Students & Cadets Life" },
  { value: "HISTORY", label: "History & Archives" },
  { value: "UNITS", label: "Units & Departments" },
];

type Unit = { _id: string; unit: string };

export default function EditAlbumPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "CEREMONY",
    belongsTo: "",   // "" = command-wide, unitId = unit-specific
    date: "",
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/albums/${albumId}`).then((r) => r.json()),
      fetch("/api/units").then((r) => r.json()),
    ]).then(([albumJson, unitsJson]) => {
      if (albumJson.album) {
        const a = albumJson.album;
        setForm({
          title: a.title || "",
          description: a.description || "",
          category: a.category || "CEREMONY",
          belongsTo: a.unitId || "",
          date: a.date ? new Date(a.date).toISOString().slice(0, 10) : "",
        });
      }
      setUnits(Array.isArray(unitsJson) ? unitsJson : []);
      setLoading(false);
    });
  }, [albumId]);

  const selectedUnit = units.find((u) => u._id === form.belongsTo) ?? null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");

    setSaving(true);
    try {
      const res = await fetch(`/api/albums/${albumId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          unitId: form.belongsTo || null,
          unitName: selectedUnit?.unit || null,
          date: form.date,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Album updated");
      router.push(`/admin/gallery/albums/${albumId}`);
    } catch {
      toast.error("Failed to update album");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/gallery/albums/${albumId}`}
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">
              Edit Album
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Update album details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/gallery/albums/${albumId}`}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            form="edit-album-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <form id="edit-album-form" onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
              Album Details
            </p>

            <div>
              <label className={LABEL}>
                Title <span className="text-[hsl(350,66%,33%)]">*</span>
              </label>
              <input
                className={INPUT}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className={LABEL}>Description</label>
              <textarea
                className={INPUT + " h-24 resize-none"}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={LABEL}>Category</label>
                <select
                  className={INPUT + " bg-white cursor-pointer"}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={LABEL}>Date</label>
                <input
                  type="date"
                  className={INPUT}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL}>Belongs to</label>
                <select
                  className={INPUT + " bg-white cursor-pointer"}
                  value={form.belongsTo}
                  onChange={(e) => setForm({ ...form, belongsTo: e.target.value })}
                >
                  <option value="">Command-wide (appears on main gallery)</option>
                  {units.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.unit}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1.5">
                  {form.belongsTo
                    ? `This album will appear on ${selectedUnit?.unit ?? "that unit"}'s page.`
                    : "This album will appear on the main public gallery page."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
