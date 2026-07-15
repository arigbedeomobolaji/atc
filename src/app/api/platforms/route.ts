import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const platforms = await db
      .collection("platforms")
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    return NextResponse.json({
      platforms: platforms.map((p) => ({ ...p, _id: p._id.toString() })),
    });
  } catch {
    return NextResponse.json({ platforms: [] });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { db } = await connectToDatabase();
    const { caption, description } = await req.json();

    if (!caption?.trim()) {
      return NextResponse.json({ error: "Caption is required" }, { status: 400 });
    }

    const count = await db.collection("platforms").countDocuments();

    const result = await db.collection("platforms").insertOne({
      caption: caption.trim(),
      description: (description || "").trim(),
      image: null,
      imagePublicId: null,
      order: count,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id: result.insertedId.toString() });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
