"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Newspaper,
  Building2,
  Users,
  Images,
  CalendarDays,
  Star,
  FilePlus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Stats = {
  counts: {
    news: number;
    units: number;
    commanders: number;
    gallery: number;
    events: number;
    leadership: number;
  };
  recentNews: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    createdAt: string;
  }[];
};

const STAT_CARDS = [
  {
    key: "news" as const,
    label: "News Articles",
    icon: Newspaper,
    color: "bg-[hsl(220,64%,16%)]",
    href: "/admin/news",
  },
  {
    key: "units" as const,
    label: "Units",
    icon: Building2,
    color: "bg-[hsl(350,66%,33%)]",
    href: "/admin/units",
  },
  {
    key: "commanders" as const,
    label: "Commanders",
    icon: Users,
    color: "bg-[hsl(45,68%,47%)]",
    href: "/admin/commanders",
  },
  {
    key: "gallery" as const,
    label: "Gallery Sets",
    icon: Images,
    color: "bg-slate-600",
    href: "/admin/gallery",
  },
  {
    key: "events" as const,
    label: "Events",
    icon: CalendarDays,
    color: "bg-emerald-600",
    href: "/admin/events",
  },
  {
    key: "leadership" as const,
    label: "Leadership Slots",
    icon: Star,
    color: "bg-violet-600",
    href: "/admin/command-leadership",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Write News",
    description: "Publish a new article",
    href: "/admin/news/create",
    icon: FilePlus,
    accent: "border-[hsl(220,64%,16%)] hover:bg-[hsl(220,64%,16%)]",
  },
  {
    label: "Manage News",
    description: "Edit, delete, bulk-manage",
    href: "/admin/news",
    icon: Newspaper,
    accent: "border-[hsl(350,66%,33%)] hover:bg-[hsl(350,66%,33%)]",
  },
  {
    label: "Units",
    description: "Add or update units",
    href: "/admin/units",
    icon: Building2,
    accent: "border-[hsl(45,68%,47%)] hover:bg-[hsl(45,68%,47%)]",
  },
  {
    label: "Gallery",
    description: "Upload & categorise photos",
    href: "/admin/gallery",
    icon: Images,
    accent: "border-slate-400 hover:bg-slate-600",
  },
  {
    label: "Commanders",
    description: "Unit leadership records",
    href: "/admin/commanders",
    icon: Users,
    accent: "border-emerald-500 hover:bg-emerald-600",
  },
  {
    label: "Command Leadership",
    description: "HQ ATC appointments",
    href: "/admin/command-leadership",
    icon: Star,
    accent: "border-violet-500 hover:bg-violet-600",
  },
];

export default function AdminDashboard() {
  const { checking } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (checking) return;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((j) => {
        if (!j.error) setStats(j);
      })
      .finally(() => setLoadingStats(false));
  }, [checking]);

  if (checking) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Welcome back — here's your content at a glance.
          </p>
        </div>
        <Link
          href="/admin/news/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,20%)] transition-colors"
        >
          <FilePlus size={16} />
          New Article
        </Link>
      </div>

      {/* Stats grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Content Overview
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            const count = stats?.counts[card.key];
            return (
              <Link
                key={card.key}
                href={card.href}
                className="group bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div
                  className={`w-9 h-9 rounded-lg ${card.color} flex items-center justify-center mb-3`}
                >
                  <Icon size={16} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-[hsl(220,64%,16%)]">
                  {loadingStats ? (
                    <span className="inline-block w-8 h-6 rounded bg-slate-100 animate-pulse" />
                  ) : (
                    (count ?? 0).toLocaleString()
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 group-hover:text-[hsl(220,64%,16%)] transition-colors">
                  {card.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick actions + Recent news */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`group border-2 ${action.accent} rounded-xl p-4 transition-all duration-200 hover:text-white`}
                >
                  <Icon
                    size={20}
                    className="mb-2 text-slate-600 group-hover:text-white transition-colors"
                  />
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-white transition-colors leading-tight">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-400 group-hover:text-white/80 transition-colors mt-0.5 leading-tight">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent news */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Recent Articles
            </h2>
            <Link
              href="/admin/news"
              className="text-xs text-[hsl(220,64%,16%)] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-2">
            {loadingStats ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-slate-100 animate-pulse"
                />
              ))
            ) : stats?.recentNews.length ? (
              stats.recentNews.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate group-hover:text-[hsl(220,64%,16%)] transition-colors">
                      {item.title}
                    </p>
                    {item.excerpt && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:block">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })
                        : ""}
                    </span>
                    <Link
                      href={`/admin/news/edit/${item._id}/${item.slug}`}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[hsl(220,64%,16%)] text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm">
                No articles yet.{" "}
                <Link
                  href="/admin/news/create"
                  className="text-[hsl(220,64%,16%)] underline"
                >
                  Create your first one.
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-48 bg-slate-100 rounded-lg" />
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-slate-100 rounded-xl" />
    </div>
  );
}
