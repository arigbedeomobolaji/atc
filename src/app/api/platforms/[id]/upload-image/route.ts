/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const existing = await db
      .collection("platforms")
      .findOne({ _id: new ObjectId(id) });

    if ((existing as any)?.imagePublicId) {
      await cloudinary.uploader.destroy((existing as any).imagePublicId);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "atc/platforms" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    await db.collection("platforms").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          image: uploadRes.secure_url,
          imagePublicId: uploadRes.public_id,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ image: uploadRes.secure_url });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
