import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = requireAuth(req);
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { db } = await connectToDatabase();

    const [news, units, commanders, gallery, events, leadership] =
      await Promise.all([
        db.collection("news").countDocuments(),
        db.collection("units").countDocuments(),
        db.collection("commanders").countDocuments(),
        db.collection("gallery").countDocuments(),
        db.collection("events").countDocuments(),
        db.collection("commandLeadership").countDocuments(),
      ]);

    const recentNews = await db
      .collection("news")
      .find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .project({ title: 1, slug: 1, createdAt: 1, excerpt: 1, coverImage: 1 })
      .toArray();

    return NextResponse.json({
      counts: { news, units, commanders, gallery, events, leadership },
      recentNews: recentNews.map((n) => ({
        ...n,
        _id: (n._id as object).toString(),
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
