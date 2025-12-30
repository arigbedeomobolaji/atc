// app/api/news/list/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const rows = await db
      .collection("news")
      .find({})
      .sort({ createdAt: -1 })
      .project({ content: 0 }) // omit big content if listing
      .toArray();
    return NextResponse.json({ news: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ news: [] });
  }
}
