/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const INPUT = "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors placeholder:text-slate-300";
const LABEL = "block text-sm font-semibold text-slate-700 mb-1.5";

export default function CreateEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [units, setUnits] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "", description: "", scope: "COMMAND", unitId: "", category: "CEREMONY",
  });

  useEffect(() => { fetch("/api/units").then(r => r.json()).then(setUnits); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Event title is required");
    if (form.scope === "UNIT" && !form.unitId) return toast.error("Please select a unit");

    setSaving(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title, description: form.description,
          scope: form.scope, category: form.category,
          unitId: form.scope === "UNIT" ? form.unitId : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create event");
      toast.success("Event created successfully");
      router.push("/admin/events");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/events" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">Create Event</h1>
            <p className="text-slate-400 text-sm mt-0.5">Add a new event to the calendar</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/events" className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Cancel</Link>
          <button form="event-form" type="submit" disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Creating…" : "Create Event"}
          </button>
        </div>
      </div>

      <form id="event-form" onSubmit={handleSubmit}>
        <div className="max-w-2xl space-y-5">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">Event Details</p>

            <div>
              <label className={LABEL}>Event Title <span className="text-[hsl(350,66%,33%)]">*</span></label>
              <input className={INPUT} placeholder="e.g. Annual Passing Out Parade" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>

            <div>
              <label className={LABEL}>Description</label>
              <textarea className={INPUT + " h-24 resize-none"} placeholder="Brief description of the event…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={LABEL}>Category</label>
                <select className={INPUT + " bg-white cursor-pointer"} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="CEREMONY">Ceremony</option>
                  <option value="EXERCISE">Exercise</option>
                  <option value="TRAINING">Training</option>
                  <option value="EVENT">Event</option>
                </select>
              </div>
              <div>
                <label className={LABEL}>Scope</label>
                <select className={INPUT + " bg-white cursor-pointer"} value={form.scope} onChange={e => setForm({ ...form, scope: e.target.value })}>
                  <option value="COMMAND">Command-wide</option>
                  <option value="UNIT">Unit-specific</option>
                </select>
              </div>
            </div>

            {form.scope === "UNIT" && (
              <div>
                <label className={LABEL}>Unit <span className="text-[hsl(350,66%,33%)]">*</span></label>
                <select className={INPUT + " bg-white cursor-pointer"} value={form.unitId} onChange={e => setForm({ ...form, unitId: e.target.value })}>
                  <option value="">Select unit</option>
                  {units.map(u => <option key={u._id} value={u._id}>{u.unit}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
