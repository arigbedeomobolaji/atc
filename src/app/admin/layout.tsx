/* eslint-disable react-hooks/static-components */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Newspaper,
  FilePlus,
  Building2,
  Users,
  Star,
  Images,
  CalendarDays,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Shield,
  ExternalLink,
  Plane,
  Goal,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { toast } from "sonner";

type NavItem = { name: string; href: string; icon: React.ElementType };
type NavGroup = { group: string; collapsible: boolean; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    group: "Overview",
    collapsible: false,
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "News",
    collapsible: true,
    items: [
      { name: "Create Article", href: "/admin/news/create", icon: FilePlus },
      { name: "Manage Articles", href: "/admin/news", icon: Newspaper },
    ],
  },
  {
    group: "Gallery",
    collapsible: true,
    items: [
      { name: "Gallery Photos", href: "/admin/gallery", icon: Images },
      { name: "Events", href: "/admin/events", icon: CalendarDays },
      { name: "Platforms", href: "/admin/platforms", icon: Plane },
    ],
  },
  {
    group: "Organisation",
    collapsible: true,
    items: [
      { name: "Units", href: "/admin/units", icon: Building2 },
      { name: "Commanders", href: "/admin/commanders", icon: Users },
      { name: "Command Leadership", href: "/admin/command-leadership", icon: Star },
      { name: "AOC Statement", href: "/admin/aoc", icon: Goal },
    ],
  },
];

const ALL_ITEMS = NAV.flatMap((g) => g.items);

function isActive(href: string, pathname: string) {
  return pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
}

/* ── Tooltip wrapper for minimized icons ── */
function IconTip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group/tip flex justify-center">
      {children}
      <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-lg border border-white/10 bg-[hsl(220,64%,6%)] px-2.5 py-1.5 text-xs text-white shadow-xl opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100 z-[999]">
        {label}
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[hsl(220,64%,6%)]" />
      </span>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      if (localStorage.getItem("admin-sidebar-min") === "true") setMinimized(true);
      const saved = localStorage.getItem("admin-sidebar-collapsed");
      if (saved) setCollapsedGroups(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  function toggleMinimized() {
    setMinimized((prev) => {
      const next = !prev;
      localStorage.setItem("admin-sidebar-min", String(next));
      return next;
    });
  }

  function toggleGroup(group: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      localStorage.setItem("admin-sidebar-collapsed", JSON.stringify([...next]));
      return next;
    });
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/admin/login");
  }

  /* ── Shared nav-item link ── */
  function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
    const Icon = item.icon;
    const active = isActive(item.href, pathname);
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
          active
            ? "bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] font-semibold"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon
          size={16}
          className={
            active ? "text-[hsl(220,64%,16%)]" : "text-white/50 group-hover:text-white"
          }
        />
        <span>{item.name}</span>
        {active && (
          <ChevronRight size={14} className="ml-auto text-[hsl(220,64%,16%)]/60" />
        )}
      </Link>
    );
  }

  /* ── Desktop sidebar ── */
  const DesktopSidebar = () => (
    <aside
      className={`flex flex-col h-full bg-[hsl(220,64%,16%)] text-white transition-all duration-300 ${
        minimized ? "w-16" : "w-64"
      }`}
    >
      {/* Brand + collapse toggle */}
      <div
        className={`flex items-center border-b border-white/10 py-4 ${
          minimized ? "flex-col gap-3 px-1 py-4" : "gap-3 px-4"
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-[hsl(45,68%,47%)] flex items-center justify-center shrink-0">
          <Shield size={16} className="text-[hsl(220,64%,16%)]" />
        </div>
        {!minimized && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold leading-tight">ATC Admin</p>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">
              Nigerian Air Force
            </p>
          </div>
        )}
        <IconTip label={minimized ? "Expand sidebar" : "Collapse sidebar"}>
          <button
            onClick={toggleMinimized}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-white/40 hover:bg-white/10 hover:text-white/80 transition-all shrink-0"
          >
            {minimized ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </IconTip>
      </div>

      {/* Nav */}
      <nav
        className={`flex-1 py-4 ${
          minimized
            ? "px-1 overflow-visible"   // visible so tooltips aren't clipped
            : "px-3 space-y-4 overflow-y-auto"
        }`}
      >
        {minimized ? (
          /* Minimized: flat icon list with tooltips */
          <div className="space-y-1">
            {ALL_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, pathname);
              return (
                <IconTip key={item.href} label={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                      active
                        ? "bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)]"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                  </Link>
                </IconTip>
              );
            })}
          </div>
        ) : (
          /* Expanded: collapsible groups */
          NAV.map((group) => (
            <div key={group.group}>
              {group.collapsible ? (
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="w-full flex items-center justify-between px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
                >
                  <span>{group.group}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      collapsedGroups.has(group.group) ? "-rotate-90" : ""
                    }`}
                  />
                </button>
              ) : (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                  {group.group}
                </p>
              )}

              {!collapsedGroups.has(group.group) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavLink key={item.href} item={item} />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </nav>

      {/* Footer */}
      <div
        className={`border-t border-white/10 py-4 space-y-1 ${
          minimized ? "px-1" : "px-3"
        }`}
      >
        {minimized ? (
          <>
            <IconTip label="View Site">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-center w-10 h-10 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                <ExternalLink size={16} />
              </Link>
            </IconTip>
            <IconTip label="Logout">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-white/60 hover:bg-[hsl(350,66%,33%)] hover:text-white transition-all"
              >
                <LogOut size={16} />
              </button>
            </IconTip>
          </>
        ) : (
          <>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
            >
              <ExternalLink size={16} />
              <span>View Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-[hsl(350,66%,33%)] hover:text-white transition-all"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
            <p className="mt-2 px-3 text-[10px] text-white/30">
              © {new Date().getFullYear()} Nigerian Air Force
            </p>
          </>
        )}

      </div>
    </aside>
  );

  /* ── Mobile sidebar (always full-width, no minimize) ── */
  const MobileSidebar = () => (
    <aside className="flex flex-col h-full w-72 bg-[hsl(220,64%,16%)] text-white">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-[hsl(45,68%,47%)] flex items-center justify-center">
          <Shield size={16} className="text-[hsl(220,64%,16%)]" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">ATC Admin</p>
          <p className="text-[10px] text-white/50 uppercase tracking-widest">
            Nigerian Air Force
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="ml-auto text-white/60 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {NAV.map((group) => (
          <div key={group.group}>
            {group.collapsible ? (
              <button
                onClick={() => toggleGroup(group.group)}
                className="w-full flex items-center justify-between px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
              >
                <span>{group.group}</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    collapsedGroups.has(group.group) ? "-rotate-90" : ""
                  }`}
                />
              </button>
            ) : (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                {group.group}
              </p>
            )}

            {!collapsedGroups.has(group.group) && (
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <ExternalLink size={16} />
          <span>View Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-[hsl(350,66%,33%)] hover:text-white transition-all"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
        <p className="mt-2 px-3 text-[10px] text-white/30">
          © {new Date().getFullYear()} Nigerian Air Force
        </p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-screen sticky top-0 overflow-visible z-20">
        <DesktopSidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MobileSidebar />
      </div>

      {/* Main */}
      <main className="flex-1 min-h-screen flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
            <Breadcrumb pathname={pathname} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              <ExternalLink size={12} />
              View Site
            </Link>
            <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(220,64%,16%)]/8 text-[hsl(220,64%,16%)] text-xs font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(45,68%,47%)]" />
              Admin
            </span>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname
    .replace(/^\/admin\/?/, "")
    .split("/")
    .filter(Boolean);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin/dashboard" },
  ];
  let path = "/admin";
  for (const seg of segments) {
    path += `/${seg}`;
    crumbs.push({
      label: seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: path,
    });
  }
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {crumbs.map((c, i) => (
        <span key={c.href + i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={13} className="text-slate-300 shrink-0" />}
          {i === crumbs.length - 1 ? (
            <span className="font-semibold text-slate-700 truncate max-w-[160px]">
              {c.label}
            </span>
          ) : (
            <Link
              href={c.href}
              className="text-slate-400 hover:text-slate-600 transition-colors truncate max-w-[120px]"
            >
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
