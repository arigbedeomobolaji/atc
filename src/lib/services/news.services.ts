/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectToDatabase } from "@/lib/db";

type GetNewsParams = {
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isAdmin?: boolean;
};

export async function getPaginatedNews({
  page = 1,
  limit = 5,
  q = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  isAdmin = false,
}: GetNewsParams) {
  const skip = (page - 1) * limit;
  const { db } = await connectToDatabase();

  /** SEARCH FILTER */
  const filter: any = q
    ? {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { content: { $regex: q, $options: "i" } },
          { createdAt: { $regex: q } },
        ],
      }
    : {};

  // Example: public-only filtering later
  //   if (!isAdmin) {
  //     filter.published = true;
  //   }

  const sort: any = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [news, total] = await Promise.all([
    db
      .collection("news")
      .find(filter)
      .sort(sort)
      .project({ content: isAdmin ? 1 : 0 })
      .skip(skip)
      .limit(limit)
      .toArray(),

    db.collection("news").countDocuments(filter),
  ]);

  return {
    news: news.map((n: any) => ({
      ...n,
      _id: n._id.toString(),
    })),
    page,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getOldestNews(limit = 15) {
  const { db } = await connectToDatabase();

  const rows = await db
    .collection("news")
    .find({})
    .sort({ createdAt: 1 })
    .limit(limit)
    .toArray();

  return rows.map((r: any) => ({
    _id: r._id.toString(),
    title: r.title,
    slug: r.slug,
    content: r.content,
    excerpt: r.excerpt,
    coverImage: r.coverImage,
    createdAt: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString("en-GB")
      : "",
  }));
}
