// app/api/news/[slug]/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const { db } = await connectToDatabase();
    const item = await db.collection("news").findOne({ slug });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ news: item });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
