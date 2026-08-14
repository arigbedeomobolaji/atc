/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { ArrowLeft, Loader2, Save, Upload, User } from "lucide-react";
import { abbrevRank } from "@/lib/rankAbbr";

const APPOINTMENTS = ["COMMANDER", "COMMANDANT", "AOC", "ACTING COMMANDER", "ACTING COMMANDANT"] as const;
const INPUT = "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors placeholder:text-slate-300";
const LABEL = "block text-sm font-semibold text-slate-700 mb-1.5";

export default function EditCommanderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [units, setUnits] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unitId, setUnitId] = useState("");

  const [form, setForm] = useState({
    name: "", rank: "", svcNo: "", unitId: "", appointment: "",
    startDate: "", endDate: "", bio: "", portrait: "", awards: "", portraitPublicId: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [cmdRes, unitRes] = await Promise.all([
          fetch(`/api/commanders/${id}`),
          fetch("/api/units"),
        ]);
        const cmd = await cmdRes.json();
        const unitsData = await unitRes.json();
        setUnits(unitsData);
        setUnitId(cmd.unitId || "");
        setForm({
          name: cmd.name || "", rank: cmd.rank || "", svcNo: cmd.svcNo || "", unitId: cmd.unitId || "",
          appointment: cmd.appointment || "",
          startDate: cmd.startDate?.split("T")[0] || "",
          endDate: cmd.endDate?.split("T")[0] || "",
          bio: cmd.bio || "", portrait: cmd.portrait || "",
          awards: cmd.awards || "", portraitPublicId: cmd.portraitPublicId || "",
        });
        setPreview(cmd.portrait || null);
      } catch {
        toast.error("Failed to load commander");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    let imageUrl = form.portrait;
    let publicId = form.portraitPublicId;

    try {
      if (file) {
        const fd = new FormData();
        const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1000 });
        fd.append("file", compressed);
        fd.append("category", "LEADERSHIP");
        fd.append("scope", "UNIT");
        fd.append("unitId", form.unitId);
        fd.append("type", "PORTRAIT");
        const up = await fetch("/api/gallery/upload", { method: "POST", body: fd });
        const upJson = await up.json();
        imageUrl = upJson.data?.imageUrl || imageUrl;
        publicId = upJson.data?.publicId || publicId;
      }

      const res = await fetch(`/api/commanders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, portrait: imageUrl, portraitPublicId: publicId }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Update failed");

      toast.success("Commander updated");
      router.push(unitId ? `/admin/commanders/unit/${unitId}` : "/admin/commanders");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  const backHref = unitId ? `/admin/commanders/unit/${unitId}` : "/admin/commanders";

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-10 w-64 bg-slate-100 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-slate-100 rounded-2xl" />
        <div className="h-56 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href={backHref} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">Edit Commander</h1>
            <p className="text-slate-400 text-sm mt-0.5">{abbrevRank(form.rank)} {form.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={backHref} className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Cancel</Link>
          <button form="cmd-form" type="submit" disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <form id="cmd-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">Commander Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={LABEL}>Full Name</label>
                  <input className={INPUT} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className={LABEL}>Rank</label>
                  <input className={INPUT} value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })} />
                </div>
                <div>
                  <label className={LABEL}>Service Number</label>
                  <input className={INPUT} placeholder="e.g. NAF/12345" value={form.svcNo} onChange={e => setForm({ ...form, svcNo: e.target.value })} />
                </div>
                <div>
                  <label className={LABEL}>Unit</label>
                  <select className={INPUT + " bg-white cursor-pointer"} value={form.unitId} onChange={e => { setForm({ ...form, unitId: e.target.value }); setUnitId(e.target.value); }}>
                    <option value="">Select unit</option>
                    {units.map(u => <option key={u._id} value={u._id}>{u.unit}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Appointment</label>
                  <select className={INPUT + " bg-white cursor-pointer"} value={form.appointment} onChange={e => setForm({ ...form, appointment: e.target.value })}>
                    <option value="">Select appointment</option>
                    {APPOINTMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Awards</label>
                  <input className={INPUT} value={form.awards} onChange={e => setForm({ ...form, awards: e.target.value })} />
                </div>
                <div>
                  <label className={LABEL}>Start Date</label>
                  <input type="date" className={INPUT} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div>
                  <label className={LABEL}>End Date <span className="text-slate-400 font-normal">(leave blank if current)</span></label>
                  <input type="date" className={INPUT} value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Biography</label>
                <textarea className={INPUT + " h-28 resize-none"} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Portrait */}
          <div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">Portrait Photo</p>
              {preview ? (
                <div className="space-y-3">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <Image src={preview} alt="Portrait" fill className="object-cover" />
                  </div>
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border-2 border-dashed border-slate-200 text-slate-500 text-sm cursor-pointer hover:border-[hsl(220,64%,16%)] transition-colors">
                    <Upload size={14} /> Replace photo
                    <input type="file" accept="image/*" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
                  </label>
                  <p className="text-xs text-slate-400">New upload replaces the current portrait</p>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 w-full h-48 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 cursor-pointer hover:border-[hsl(220,64%,16%)] transition-colors">
                  <User size={32} className="text-slate-200" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Upload portrait</p>
                    <p className="text-xs text-slate-300 mt-0.5">JPEG, PNG — max 5 MB</p>
                  </div>
                  <input type="file" accept="image/*" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
