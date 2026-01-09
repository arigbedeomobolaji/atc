// app/news/[slug]/page.tsx - public news detail (server component)

import Breadcrumb from "@/components/Breadcrunb";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { connectToDatabase } from "@/lib/db";
import { normalizeImages } from "@/lib/normalizeImages";
import { convertDate } from "@/utils/covertDate";
import { getPaginatedNews } from "@/lib/services/news.services";
import Link from "next/link";
import { SidebarNews } from "@/components/news/SidebarNews";

async function getBySlug(slug: string) {
  const { db } = await connectToDatabase();
  const news = await db.collection("news").findOne({ slug });
  return news;
}

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getBySlug(slug);
  const { news } = await getPaginatedNews({ page: 1, limit: 10 });

  if (!data) return <div className="p-6">Not found</div>;

  return (
    <div className="max-w-350 mx-auto p-6">
      <WelcomeBanner />

      {/* Fixed Header (Banner + Navbar) */}
      <div className="sticky top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>

      <Breadcrumb rootLabel="Home" rootHref="/" startIndex={0} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        {/* Main News */}
        <div className="max-w-4xl space-y-3 p-3 col-span-1 lg:col-span-3">
          <h1 className="text-4xl text-dark font-heading font-extrabold">
            {data.title}
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 font-mono italic text-xs hover:underline">
              Posted by ATC Admin
            </p>
            <p className="text-sm font-bold">
              {convertDate(data.createdAt, false)}
            </p>
          </div>
          <div
            className="prose max-w-none text-justify"
            dangerouslySetInnerHTML={{
              __html: normalizeImages(data.content),
            }}
          />
        </div>
        {/* hottest news */}
        <SidebarNews news={news} slug={slug} />
      </div>

      <Footer />
    </div>
  );
}
