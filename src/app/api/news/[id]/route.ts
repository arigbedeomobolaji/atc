/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/news/[id]/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log({ id });
    const { db } = await connectToDatabase();
    const item = await db
      .collection("news")
      .findOne({ _id: new ObjectId(id) as any });
    console.log({ item });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ news: item });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing title or content" },
        { status: 400 }
      );
    }
    // ✅ regenerate excerpt from updated content
    const excerpt = content.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160);

    const { db } = await connectToDatabase();

    const result = await db.collection("news").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          content,
          excerpt,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
