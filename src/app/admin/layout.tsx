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
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="px-6 py-4 text-lg font-bold border-b border-slate-700">
          Admin Panel
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {nav.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded ${
                  pathname === item.href ? "bg-slate-700" : "hover:bg-slate-800"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Breadcrumb />
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
}
