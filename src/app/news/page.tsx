/* eslint-disable @typescript-eslint/no-explicit-any */
// app/news/page.tsx - public news listing (server component)
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";

async function getNews() {
  const { db } = await connectToDatabase();
  return db.collection("news").find({}).sort({ createdAt: -1 }).toArray();
}

export default async function NewsPage() {
  const rows = await getNews();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">News & Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rows.map((r: any) => (
          <Link
            key={r._id.toString()}
            href={`/news/${r.slug}`}
            className="block p-4 bg-white rounded shadow"
          >
            <h3 className="font-semibold text-lg">{r.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{r.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
