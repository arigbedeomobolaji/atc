/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react";
import { abbrevRank } from "@/lib/rankAbbr";

function formatDate(d: any) {
  if (!d) return "Present";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function CommanderHistoryPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/commanders/history/${unitId}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [unitId]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href={`/admin/commanders/unit/${unitId}`} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">Commander History</h1>
          <p className="text-slate-400 text-sm mt-0.5">{data.length} record{data.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />)}</div>
      ) : data.length === 0 ? (
        <p className="text-slate-400 text-sm py-8 text-center">No history records found.</p>
      ) : (
        <div className="space-y-3">
          {data.map((c, idx) => {
            const isCurrent = !c.endDate;
            return (
              <div key={c._id} className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${isCurrent ? "border-[hsl(45,68%,47%)]/40 bg-[hsl(45,68%,47%)]/[0.04]" : "border-slate-200 bg-white"}`}>
                <div className="w-8 h-8 rounded-lg bg-[hsl(220,64%,16%)]/8 flex items-center justify-center shrink-0">
                  <span className="text-[hsl(220,64%,16%)] text-[10px] font-black">{String(idx + 1).padStart(2, "0")}</span>
                </div>
                <User size={16} className="text-slate-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-800">{abbrevRank(c.rank)} {c.name}</p>
                    {isCurrent && <span className="px-2 py-0.5 rounded-full bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] text-[10px] font-black uppercase tracking-wider">Current</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><CalendarDays size={10} />{formatDate(c.startDate)}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{formatDate(c.endDate)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
