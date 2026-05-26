/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowLeft, UserPlus, Pencil, Trash2, Shield, Clock, User, CalendarDays,
} from "lucide-react";

function formatDate(d: any) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function CommanderCard({ c, onDelete }: { c: any; onDelete: (id: string) => void }) {
  const isCurrent = !c.endDate;
  return (
    <div className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-colors ${
      isCurrent
        ? "border-[hsl(45,68%,47%)]/40 bg-[hsl(45,68%,47%)]/[0.04]"
        : "border-slate-200 bg-white hover:border-slate-300"
    }`}>
      {c.portrait ? (
        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0">
          <Image src={c.portrait} alt={c.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-xl bg-[hsl(220,64%,16%)]/10 border border-[hsl(220,64%,16%)]/15 flex items-center justify-center shrink-0">
          <User size={18} className="text-[hsl(220,64%,16%)]/40" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-slate-800">{c.rank} {c.name}</p>
          {isCurrent && (
            <span className="px-2 py-0.5 rounded-full bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-[10px] font-black uppercase tracking-wider">Current</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
          <span className="flex items-center gap-1"><CalendarDays size={10} /> {formatDate(c.startDate)}</span>
          {c.endDate && <span>→ {formatDate(c.endDate)}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Link href={`/admin/commanders/${c._id}/edit`}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-xs font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors">
          <Pencil size={11} /><span className="hidden sm:inline">Edit</span>
        </Link>
        <button onClick={() => onDelete(c._id)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-100 text-red-400 text-xs font-semibold hover:bg-red-50 transition-colors">
          <Trash2 size={11} /><span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
}

export default function UnitCommandersPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const [data, setData] = useState<any[]>([]);
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [cmdRes, unitRes] = await Promise.all([
        fetch(`/api/commanders/history/${unitId}`),
        fetch(`/api/units/${unitId}`),
      ]);
      setData(await cmdRes.json());
      setUnit(await unitRes.json());
    } catch {
      toast.error("Failed to load commanders");
    } finally {
      setLoading(false);
    }
  }, [unitId]);

  useEffect(() => { if (unitId) load(); }, [unitId, load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this commander record? This cannot be undone.")) return;
    const res = await fetch(`/api/commanders/${id}`, { method: "DELETE" });
    if (res.ok) {
      setData(prev => prev.filter(c => c._id !== id));
      toast.success("Commander removed");
    } else {
      toast.error("Delete failed");
    }
  }

  const current = data.filter(c => !c.endDate);
  const past = data.filter(c => c.endDate);

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-10 w-64 bg-slate-100 rounded-lg" />
      <div className="h-32 bg-slate-100 rounded-2xl" />
      <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-xl" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/commanders" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">{unit?.unit}</h1>
            <p className="text-slate-400 text-sm mt-0.5">Commander records · {data.length} total</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/commanders/create?unitId=${unitId}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors">
            <UserPlus size={15} /> Add Current
          </Link>
          <Link href={`/admin/commanders/create?unitId=${unitId}&type=past`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-sm font-semibold hover:bg-[hsl(45,68%,55%)] transition-colors">
            <Clock size={15} /> Add Past
          </Link>
        </div>
      </div>

      {/* Current Commander */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-[hsl(45,68%,47%)]" />
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Commander</h2>
        </div>
        {current.length > 0 ? (
          current.map(c => <CommanderCard key={c._id} c={c} onDelete={handleDelete} />)
        ) : (
          <div className="flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
            <User size={20} className="text-slate-300" />
            <div>
              <p className="text-sm font-medium">No current commander assigned</p>
              <Link href={`/admin/commanders/create?unitId=${unitId}`} className="text-xs text-[hsl(220,64%,16%)] hover:underline mt-0.5 inline-block">
                Assign one now →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Past Commanders */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-slate-400" />
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Past Commanders</h2>
          <span className="text-xs text-slate-300">({past.length})</span>
        </div>
        {past.length > 0 ? (
          past.map(c => <CommanderCard key={c._id} c={c} onDelete={handleDelete} />)
        ) : (
          <p className="px-5 py-4 text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">No past commander records.</p>
        )}
      </div>
    </div>
  );
}
