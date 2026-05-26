/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CalendarDays, FilePlus, Pencil, Trash2, Upload,
  Building2, Globe, Loader2, Tag,
} from "lucide-react";

const CATEGORY_COLOR: Record<string, string> = {
  CEREMONY: "bg-[hsl(45,68%,47%)]/15 text-[hsl(45,68%,35%)]",
  EXERCISE: "bg-blue-50 text-blue-600",
  TRAINING: "bg-emerald-50 text-emerald-600",
  EVENT: "bg-violet-50 text-violet-600",
};

export default function EventsAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then(setEvents)
      .catch(() => toast.error("Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEvents(prev => prev.filter(e => e._id !== id));
      toast.success("Event deleted");
    } else {
      toast.error("Delete failed");
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">Events</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage command and unit events</p>
        </div>
        <Link href="/admin/events/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors">
          <FilePlus size={15} /> Create Event
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="py-16 text-center border border-slate-200 rounded-2xl">
          <CalendarDays size={36} className="mx-auto text-slate-200 mb-3" />
          <p className="text-slate-400 text-sm">No events yet.</p>
          <Link href="/admin/events/create" className="mt-3 inline-flex items-center gap-2 text-sm text-[hsl(220,64%,16%)] hover:underline">
            <FilePlus size={14} /> Create your first event
          </Link>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="flex-1">Event</span>
            <span className="hidden sm:block w-24">Category</span>
            <span className="hidden md:block w-20">Scope</span>
            <span className="w-32 text-right">Actions</span>
          </div>
          <div className="divide-y divide-slate-100">
            {events.map(event => (
              <div key={event._id} className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{event.title}</p>
                  {event.description && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{event.description}</p>
                  )}
                </div>
                <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide w-24 justify-center ${CATEGORY_COLOR[event.category] || "bg-slate-100 text-slate-500"}`}>
                  <Tag size={9} />{event.category}
                </span>
                <span className="hidden md:flex items-center gap-1 w-20 text-xs text-slate-400">
                  {event.scope === "UNIT" ? <><Building2 size={11} /> Unit</> : <><Globe size={11} /> Command</>}
                </span>
                <div className="flex items-center gap-1.5 w-32 justify-end">
                  <Link href={`/admin/events/${event._id}/upload`}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 transition-colors" title="Upload photos">
                    <Upload size={11} /><span className="hidden sm:inline">Photos</span>
                  </Link>
                  <Link href={`/admin/events/${event._id}/edit`}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-xs font-medium hover:bg-[hsl(220,64%,22%)] transition-colors">
                    <Pencil size={11} /><span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button onClick={() => handleDelete(event._id, event.title)} disabled={deletingId === event._id}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-red-100 text-red-400 text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-50">
                    {deletingId === event._id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
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
