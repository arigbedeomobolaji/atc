/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { ArrowLeft, Loader2, Save, Upload, Trash2, User } from "lucide-react";

const APPOINTMENTS = [
  "Air Officer Commanding",
  "Chief of Staff",
  "Deputy Chief of Staff",
  "Command Training Officer",
  "Command Administrative Officer",
  "Command Evaluation Officer",
  "Command Aircraft Engineering Officer",
  "Command Communications & IS Officer",
  "Command Logistics Officer",
  "Command Medical Officer",
  "Command Finance Officer",
  "Command Air Provost Officer",
  "Command Education Officer",
  "Command Legal Officer",
  "Command Intelligence Officer",
  "Command Public Relations Officer",
  "Command Sports Officer",
  "Commander",
  "Commandant",
];
const INPUT = "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors placeholder:text-slate-300";
const LABEL = "block text-sm font-semibold text-slate-700 mb-1.5";

export default function EditLeaderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [customAppointment, setCustomAppointment] = useState(false);

  const [form, setForm] = useState({
    name: "", rank: "", appointment: "", appointmentAbbreviation: "", bio: "", awards: "", image: "",
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/command-leadership/${id}`)
      .then(r => r.json())
      .then(data => {
        const appt = data.appointment || "";
        setForm({
          name: data.name || "", rank: data.rank || "",
          appointment: appt, appointmentAbbreviation: data.appointmentAbbreviation || "",
          bio: data.bio || "", awards: data.awards || "", image: data.image || "",
        });
        if (appt && !APPOINTMENTS.includes(appt)) setCustomAppointment(true);
        setPreview(data.image || null);
      })
      .catch(() => toast.error("Failed to load officer data"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      const res = await fetch(`/api/command-leadership/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);

      if (file) {
        const fd = new FormData();
        const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 800 });
        fd.append("file", compressed);
        const up = await fetch(`/api/command-leadership/${id}/upload-image`, { method: "POST", body: fd });
        if (!up.ok) toast.warning("Saved but portrait upload failed");
      }

      toast.success("Officer updated");
      router.push("/admin/command-leadership");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveImage() {
    if (!confirm("Remove current portrait?")) return;
    await fetch(`/api/command-leadership/${id}/delete-image`, { method: "DELETE" });
    setForm(p => ({ ...p, image: "" }));
    setPreview(null);
    setFile(null);
    toast.success("Portrait removed");
  }

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
          <Link href="/admin/command-leadership" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">Edit Officer</h1>
            <p className="text-slate-400 text-sm mt-0.5">{form.rank} {form.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/command-leadership" className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Cancel</Link>
          <button
            form="leader-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <form id="leader-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">Officer Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={LABEL}>Full Name <span className="text-[hsl(350,66%,33%)]">*</span></label>
                  <input className={INPUT} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className={LABEL}>Rank</label>
                  <input className={INPUT} value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })} />
                </div>
                <div>
                  <label className={LABEL}>Appointment</label>
                  <select
                    className={INPUT + " bg-white cursor-pointer"}
                    value={customAppointment ? "__other__" : form.appointment}
                    onChange={e => {
                      if (e.target.value === "__other__") {
                        setCustomAppointment(true);
                        setForm({ ...form, appointment: "" });
                      } else {
                        setCustomAppointment(false);
                        setForm({ ...form, appointment: e.target.value });
                      }
                    }}
                  >
                    <option value="">Select appointment</option>
                    {APPOINTMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                    <option value="__other__">Other…</option>
                  </select>
                  {customAppointment && (
                    <input
                      className={INPUT + " mt-2"}
                      placeholder="Type custom appointment"
                      value={form.appointment}
                      onChange={e => setForm({ ...form, appointment: e.target.value })}
                    />
                  )}
                </div>
                <div>
                  <label className={LABEL}>Abbreviation</label>
                  <input className={INPUT} value={form.appointmentAbbreviation} onChange={e => setForm({ ...form, appointmentAbbreviation: e.target.value })} />
                </div>
                <div>
                  <label className={LABEL}>Awards</label>
                  <input className={INPUT} value={form.awards} onChange={e => setForm({ ...form, awards: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Biography</label>
                <textarea className={INPUT + " h-32 resize-none"} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Portrait */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">Portrait Photo</p>
              {preview ? (
                <div className="space-y-3">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <Image src={preview} alt="Portrait" fill className="object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium cursor-pointer hover:bg-slate-50 transition-colors">
                      <Upload size={12} /> Replace
                      <input type="file" accept="image/*" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
                    </label>
                    {form.image && (
                      <button type="button" onClick={handleRemoveImage} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-100 text-red-400 text-xs font-medium hover:bg-red-50 transition-colors">
                        <Trash2 size={12} /> Remove
                      </button>
                    )}
                  </div>
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
