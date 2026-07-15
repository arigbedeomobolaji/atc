import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const news = await db
      .collection("news")
      .find({})
      .sort({ createdAt: -1, _id: -1 })
      .limit(10)
      .project({
        title: 1,
        slug: 1,
        coverImage: 1,
        excerpt: 1,
        createdAt: 1,
      })
      .toArray();

    return NextResponse.json({
      news: news.map((n) => ({ ...n, _id: n._id.toString() })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ news: [] });
  }
}
