// app/news/[slug]/page.tsx - public news detail (server component)

import { connectToDatabase } from "@/lib/db";

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
  console.log({ slug });
  const data = await getBySlug(slug);
  if (!data) return <div className="p-6">Not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <div
        className="mt-4 prose"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  );
}
