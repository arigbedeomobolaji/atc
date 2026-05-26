"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const INPUT = "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors placeholder:text-slate-300";
const LABEL = "block text-sm font-semibold text-slate-700 mb-1.5";

export default function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("CEREMONY");

  useEffect(() => {
    if (!eventId) return;
    fetch(`/api/events/${eventId}`)
      .then(r => r.json())
      .then(json => {
        setTitle(json.event?.title || "");
        setDescription(json.event?.description || "");
        setCategory(json.event?.category || "CEREMONY");
      })
      .catch(() => toast.error("Failed to load event"))
      .finally(() => setLoading(false));
  }, [eventId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    setSaving(true);
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Event updated");
      router.push("/admin/events");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-10 w-56 bg-slate-100 rounded-lg" />
      <div className="max-w-2xl h-60 bg-slate-100 rounded-2xl" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/events" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">Edit Event</h1>
            <p className="text-slate-400 text-sm mt-0.5 truncate max-w-xs">{title || "Untitled"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/events" className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Cancel</Link>
          <button form="event-form" type="submit" disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <form id="event-form" onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">Event Details</p>
            <div>
              <label className={LABEL}>Event Title <span className="text-[hsl(350,66%,33%)]">*</span></label>
              <input className={INPUT} value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Description</label>
              <textarea className={INPUT + " h-24 resize-none"} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Category</label>
              <select className={INPUT + " bg-white cursor-pointer"} value={category} onChange={e => setCategory(e.target.value)}>
                <option value="CEREMONY">Ceremony</option>
                <option value="EXERCISE">Exercise</option>
                <option value="TRAINING">Training</option>
                <option value="EVENT">Event</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
