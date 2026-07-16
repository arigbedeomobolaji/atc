/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

type Ctx = { params: Promise<{ albumId: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { albumId } = await params;
    if (!ObjectId.isValid(albumId))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { db } = await connectToDatabase();
    const album = await db.collection("albums").findOne({ _id: new ObjectId(albumId) });
    if (!album) return NextResponse.json({ error: "Album not found" }, { status: 404 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const caption = (formData.get("caption") as string) || "";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder =
      album.scope === "UNIT" && album.unitId
        ? `atc/units/${album.unitId}/albums`
        : "atc/command/albums";

    const uploadRes: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
      stream.end(buffer);
    });

    const image = {
      url: uploadRes.secure_url,
      publicId: uploadRes.public_id,
      caption,
    };

    const isFirstImage = !album.coverImage;

    await db.collection("albums").updateOne(
      { _id: new ObjectId(albumId) },
      {
        $push: { images: image } as any,
        $set: {
          updatedAt: new Date(),
          ...(isFirstImage ? { coverImage: uploadRes.secure_url } : {}),
        },
      }
    );

    return NextResponse.json({ image });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
