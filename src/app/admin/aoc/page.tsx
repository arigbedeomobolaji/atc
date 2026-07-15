"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { Loader2, Save, Upload, ImageIcon, Goal } from "lucide-react";

const INPUT =
  "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors placeholder:text-slate-300";
const LABEL = "block text-sm font-semibold text-slate-700 mb-1.5";

export default function AOCAdminPage() {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    rank: "",
    awards: "",
    appointment: "",
    statementType: "Vision" as "Vision" | "Mission",
    statement: "",
  });

  useEffect(() => {
    fetch("/api/aoc")
      .then((r) => r.json())
      .then((j) => {
        if (j.aoc) {
          setForm({
            name: j.aoc.name || "",
            rank: j.aoc.rank || "",
            awards: j.aoc.awards || "",
            appointment: j.aoc.appointment || "",
            statementType: j.aoc.statementType || "Vision",
            statement: j.aoc.statement || "",
          });
          if (j.aoc.image) setPreview(j.aoc.image);
        }
      });
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.rank.trim()) return toast.error("Rank is required");
    if (!form.appointment.trim()) return toast.error("Appointment is required");
    if (!form.statement.trim()) return toast.error("Statement is required");

    setSaving(true);
    try {
      const res = await fetch("/api/aoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");

      if (file) {
        setUploading(true);
        const fd = new FormData();
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1200,
        });
        fd.append("file", compressed);
        const up = await fetch("/api/aoc/upload-image", {
          method: "POST",
          body: fd,
        });
        setUploading(false);
        if (!up.ok) toast.warning("Details saved but portrait upload failed");
        else {
          const upJson = await up.json();
          if (upJson.image) setPreview(upJson.image);
          setFile(null);
        }
      }

      toast.success("AOC statement updated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[hsl(220,64%,16%)] flex items-center justify-center">
            <Goal size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">
              AOC Vision Statement
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Update the AOC portrait, details, and vision statement
            </p>
          </div>
        </div>
        <button
          form="aoc-form"
          type="submit"
          disabled={saving || uploading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60"
        >
          {saving || uploading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {uploading ? "Uploading…" : saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <form id="aoc-form" onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
              Officer Details
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className={LABEL}>
                  Full Name <span className="text-[hsl(350,66%,33%)]">*</span>
                </label>
                <input
                  className={INPUT}
                  placeholder="e.g. AVM EP EFANGA"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className={LABEL}>
                  Rank <span className="text-[hsl(350,66%,33%)]">*</span>
                </label>
                <input
                  className={INPUT}
                  placeholder="e.g. Air Vice Marshal"
                  value={form.rank}
                  onChange={(e) => setForm({ ...form, rank: e.target.value })}
                />
              </div>

              <div>
                <label className={LABEL}>Awards / Qualifications</label>
                <input
                  className={INPUT}
                  placeholder="e.g. GSS PSC(+) FDC GSM FCM"
                  value={form.awards}
                  onChange={(e) => setForm({ ...form, awards: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={LABEL}>
                  Appointment <span className="text-[hsl(350,66%,33%)]">*</span>
                </label>
                <input
                  className={INPUT}
                  placeholder="e.g. Air Officer Commanding, Air Training Command"
                  value={form.appointment}
                  onChange={(e) =>
                    setForm({ ...form, appointment: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={LABEL}>Statement Type</label>
                <select
                  className={INPUT + " bg-white cursor-pointer"}
                  value={form.statementType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      statementType: e.target.value as "Vision" | "Mission",
                    })
                  }
                >
                  <option value="Vision">Vision</option>
                  <option value="Mission">Mission</option>
                </select>
              </div>
            </div>

            <div>
              <label className={LABEL}>
                {form.statementType} Statement{" "}
                <span className="text-[hsl(350,66%,33%)]">*</span>
              </label>
              <textarea
                className={INPUT + " h-40 resize-none"}
                placeholder={`Enter the AOC's ${form.statementType.toLowerCase()} statement…`}
                value={form.statement}
                onChange={(e) =>
                  setForm({ ...form, statement: e.target.value })
                }
              />
            </div>
          </div>

          {/* Portrait sidebar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
              AOC Portrait
            </p>
            {preview ? (
              <div className="space-y-3">
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <Image
                    src={preview}
                    alt="AOC Portrait"
                    fill
                    className="object-cover"
                  />
                </div>
                <label className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border-2 border-dashed border-slate-200 text-slate-500 text-sm cursor-pointer hover:border-[hsl(220,64%,16%)] hover:text-[hsl(220,64%,16%)] transition-colors">
                  <Upload size={14} />
                  Replace portrait
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFile}
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 w-full h-56 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 cursor-pointer hover:border-[hsl(220,64%,16%)] hover:text-[hsl(220,64%,16%)] transition-colors">
                <ImageIcon size={32} className="text-slate-200" />
                <div className="text-center">
                  <p className="text-sm font-medium">Upload portrait</p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    JPEG, PNG — max 5 MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFile}
                />
              </label>
            )}
            <p className="text-xs text-slate-400">
              Official uniform portrait recommended.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
