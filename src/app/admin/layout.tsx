"use client";

import Breadcrumb from "@/components/Breadcrunb";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const nav = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Create News", href: "/admin/news/create" },
    { name: "Manage News", href: "/admin/news" },
    { name: "Units", href: "/admin/units" },
    { name: "Commanders", href: "/admin/commanders" },
    { name: "Events", href: "/admin/events" },
    { name: "Gallery", href: "/admin/gallery" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1a365d] text-white flex flex-col shadow-xl">
        <div className="px-6 py-5 text-lg font-bold border-b border-white/10">
          ✈️ ATC Admin
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {nav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition ${
                  active
                    ? "bg-[#c9a227] text-[#1a365d] font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 text-xs text-white/50 border-t border-white/10">
          © NAF System
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Breadcrumb />
          <div className="mt-4">{children}</div>
        </div>
      </main>
    </div>
  );
}
