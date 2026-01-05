// app/news/[slug]/page.tsx - public news detail (server component)

import Breadcrumb from "@/components/Breadcrunb";
import NewsViewer from "@/components/editor/NewsViewer";
import { Navbar } from "@/components/Navbar";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { connectToDatabase } from "@/lib/db";

async function getBySlug(slug: string) {
  const { db } = await connectToDatabase();
  const news = await db.collection("news").findOne({ slug });
  return news;
}

function normalizeImages(html: string) {
  return html.replace(
    /<img([^>]*)>(.*?)<span>Source:\s*(.*?)<\/span>/g,
    `
    <figure class="editor-figure">
      <img $1 />
     
      <span class="editor-source">Source: $3</span>
       <figcaption class="editor-caption">$2</figcaption>
    </figure>
    `
  );
}

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log({ slug });
  const data = await getBySlug(slug);
  if (!data) return <div className="p-6">Not found</div>;

  return (
    <div className="max-w-350 mx-auto p-6">
      <WelcomeBanner />

      {/* Fixed Header (Banner + Navbar) */}
      <div className="sticky top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>

      <Breadcrumb rootLabel="Home" rootHref="/" startIndex={0} />
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    </div>
  );
}
