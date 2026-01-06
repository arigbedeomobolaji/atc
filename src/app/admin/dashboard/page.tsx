// app/admin/dashboard/page.tsx
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
      if (!json.authenticated) router.push("/admin/login");
    }
    check();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <Card title="Analytics" description="Coming soon" href="#" />
      </div>
    </div>
  );
}

function Card({
  title,
  description,
  href,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </Link>
  );
}
