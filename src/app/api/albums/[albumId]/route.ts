/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

type Ctx = { params: Promise<{ albumId: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { albumId } = await params;
    if (!ObjectId.isValid(albumId))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { db } = await connectToDatabase();
    const album = await db.collection("albums").findOne({ _id: new ObjectId(albumId) });
    if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      album: {
        ...album,
        _id: album._id.toString(),
        unitId: album.unitId?.toString() ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { albumId } = await params;
    if (!ObjectId.isValid(albumId))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await req.json();
    const { db } = await connectToDatabase();

    const unitId =
      body.unitId && ObjectId.isValid(body.unitId) ? new ObjectId(body.unitId) : null;
    const unitName = body.unitName?.trim() || null;

    await db.collection("albums").updateOne(
      { _id: new ObjectId(albumId) },
      {
        $set: {
          title: body.title,
          description: body.description,
          category: body.category,
          unitId,
          unitName,
          date: body.date ? new Date(body.date) : undefined,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { albumId } = await params;
    if (!ObjectId.isValid(albumId))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { db } = await connectToDatabase();
    const album = await db.collection("albums").findOne({ _id: new ObjectId(albumId) });
    if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const publicIds = ((album.images as any[]) || [])
      .map((i: any) => i.publicId)
      .filter(Boolean);

    if (publicIds.length) {
      await cloudinary.api.delete_resources(publicIds);
    }

    await db.collection("albums").deleteOne({ _id: new ObjectId(albumId) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
