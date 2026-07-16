/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

type Ctx = { params: Promise<{ albumId: string }> };

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { albumId } = await params;
    if (!ObjectId.isValid(albumId))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { publicId } = await req.json();
    if (!publicId) return NextResponse.json({ error: "publicId required" }, { status: 400 });

    const { db } = await connectToDatabase();
    const album = await db.collection("albums").findOne({ _id: new ObjectId(albumId) });
    if (!album) return NextResponse.json({ error: "Album not found" }, { status: 404 });

    await cloudinary.uploader.destroy(publicId);

    const images = (album.images as any[]) || [];
    const deletedUrl = images.find((i: any) => i.publicId === publicId)?.url ?? null;
    const remaining = images.filter((i: any) => i.publicId !== publicId);

    const newCover =
      album.coverImage === deletedUrl ? (remaining[0]?.url ?? null) : album.coverImage;

    await db.collection("albums").updateOne(
      { _id: new ObjectId(albumId) },
      {
        $pull: { images: { publicId } } as any,
        $set: { coverImage: newCover, updatedAt: new Date() },
      }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
