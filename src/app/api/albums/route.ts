import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const unitId = searchParams.get("unitId");
    const commandOnly = searchParams.get("commandOnly");

    const query: Record<string, unknown> = {};
    if (category) query.category = category;

    if (commandOnly === "true") {
      query.unitId = null;
    } else if (unitId && ObjectId.isValid(unitId)) {
      query.unitId = new ObjectId(unitId);
    }

    const albums = await db
      .collection("albums")
      .find(query)
      .sort({ date: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json({
      albums: albums.map((a) => ({
        ...a,
        _id: a._id.toString(),
        unitId: a.unitId?.toString() ?? null,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    if (!body.title?.trim())
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!body.category)
      return NextResponse.json({ error: "Category is required" }, { status: 400 });

    const isUnit = !!body.unitId && ObjectId.isValid(body.unitId);
    const unitId = isUnit ? new ObjectId(body.unitId) : null;
    const unitName = body.unitName?.trim() || null;

    const album = {
      title: body.title.trim(),
      description: body.description?.trim() || "",
      category: body.category,
      unitId,
      unitName,
      date: body.date ? new Date(body.date) : new Date(),
      coverImage: null as string | null,
      images: [] as { url: string; publicId: string; caption: string }[],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("albums").insertOne(album);
    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 });
  }
}
