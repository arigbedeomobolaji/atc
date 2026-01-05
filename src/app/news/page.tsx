/* eslint-disable @typescript-eslint/no-explicit-any */
// app/news/page.tsx - public news listing (server component)
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { Navbar } from "@/components/Navbar";

async function getNews() {
  const { db } = await connectToDatabase();
  return db.collection("news").find({}).sort({ createdAt: -1 }).toArray();
}

export default async function NewsPage() {
  const rows = await getNews();

  return (
    <div className="max-w-350 mx-auto p-6">
      <WelcomeBanner />

      {/* Fixed Header (Banner + Navbar) */}
      <div className="sticky top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>
      <h1 className="text-3xl font-semibold my-6">News & Events</h1>
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
