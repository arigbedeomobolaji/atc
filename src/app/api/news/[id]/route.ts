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
