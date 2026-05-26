/* eslint-disable react-hooks/static-components */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
  Shield,
  HouseIcon,
} from "lucide-react";
import { toast } from "sonner";

const NAV = [
  {
    group: "Relevant Link",
    items: [{ name: "Homepage", href: "/", icon: HouseIcon }],
  },
  {
    group: "Overview",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "Content",
    items: [
      { name: "Create News", href: "/admin/news/create", icon: FilePlus },
      { name: "Manage News", href: "/admin/news", icon: Newspaper },
      { name: "Gallery", href: "/admin/gallery", icon: Images },
      { name: "Events", href: "/admin/events", icon: CalendarDays },
    ],
  },
  {
    group: "Organization",
    items: [
      { name: "Units", href: "/admin/units", icon: Building2 },
      { name: "Commanders", href: "/admin/commanders", icon: Users },
      {
        name: "Command Leadership",
        href: "/admin/command-leadership",
        icon: Star,
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out successfully");
    router.push("/admin/login");
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`flex flex-col h-full bg-[hsl(220,64%,16%)] text-white ${
        mobile ? "w-72" : "w-64"
      }`}
    >
      {/* Brand */}
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
        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {NAV.map((group, index) => (
          <div key={group.group + index}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                      active
                        ? "bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] font-semibold"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        active
                          ? "text-[hsl(220,64%,16%)]"
                          : "text-white/50 group-hover:text-white"
                      }
                    />
                    <span>{item.name}</span>
                    {active && (
                      <ChevronRight
                        size={14}
                        className="ml-auto text-[hsl(220,64%,16%)]/60"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-[hsl(350,66%,33%)] hover:text-white transition-all duration-150"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
        <p className="mt-3 px-3 text-[10px] text-white/30">
          © {new Date().getFullYear()} Nigerian Air Force
        </p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar mobile />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
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
            <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(220,64%,16%)]/8 text-[hsl(220,64%,16%)] text-xs font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(45,68%,47%)]" />
              Admin
            </span>
          </div>
        </header>

        {/* Page */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-full">
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

  // Add Home first
  const crumbs = [{ label: "Home", href: "/" }];

  // Then Admin
  crumbs.push({ label: "Admin", href: "/admin/dashboard" });

  let path = "/admin";

  for (const seg of segments) {
    path += `/${seg}`;

    const label = seg
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    crumbs.push({ label, href: path });
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {crumbs.map((c, i) => (
        <span key={c.href + i} className="flex items-center gap-1.5">
          {i > 0 && (
            <ChevronRight size={13} className="text-slate-300 shrink-0" />
          )}

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
