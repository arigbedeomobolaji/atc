/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      setLoading(false);

      if (!json.authenticated) {
        router.push("/admin/login");
      }
    }

    check();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#1a365d]">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm">Manage NAF system content</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="News Articles" value="24" />
        <StatCard title="Units" value="12" />
        <StatCard title="Commanders" value="8" />
      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          title="Create News"
          description="Publish a new article"
          href="/admin/news/create"
        />
        <Card
          title="Manage News"
          description="Edit or delete articles"
          href="/admin/news"
        />
        <Card title="Units" description="Manage units" href="/admin/units" />
        <Card
          title="Commanders"
          description="Manage leadership"
          href="/admin/commanders"
        />
        <Card
          title="Gallery"
          description="Manage images"
          href="/admin/gallery"
        />
        <Card title="Events" description="Manage events" href="/admin/events" />
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-[#1a365d]">{value}</h3>
    </div>
  );
}

function Card({ title, description, href }: any) {
  return (
    <Link href={href}>
      <div className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="text-lg font-semibold text-[#1a365d] group-hover:text-[#c9a227]">
          {title}
        </div>

        <p className="text-sm text-slate-500 mt-2">{description}</p>

        <div className="mt-4 text-xs text-[#c9a227] font-semibold opacity-0 group-hover:opacity-100 transition">
          Open →
        </div>
      </div>
    </Link>
  );
}
