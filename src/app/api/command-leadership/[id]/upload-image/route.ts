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
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const { id } = await params;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    //  1. Get existing image
    const existing = await db
      .collection("commandLeadership")
      .findOne({ _id: new ObjectId(id) });

    //  2. Delete old image from Cloudinary
    if (existing?.imagePublicId) {
      await cloudinary.uploader.destroy(existing.imagePublicId);
    }

    //  3. Upload new image
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "atc/command-leadership",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    //  4. Save to DB
    await db.collection("commandLeadership").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          image: uploadRes.secure_url,
          imagePublicId: uploadRes.public_id,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      image: uploadRes.secure_url,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
