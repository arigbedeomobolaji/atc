/* eslint-disable @typescript-eslint/no-explicit-any */
// /Users/mac/omobolaji/atc/src/app/api/units/[unitId]/upload-logo/route.ts

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || !unitId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // 🔥 1. GET existing unit
    const existingUnit = await db.collection("units").findOne({
      _id: new ObjectId(unitId),
    });

    // 🔥 2. DELETE OLD IMAGE (VERY IMPORTANT)
    if (existingUnit?.logoPublicId) {
      await cloudinary.uploader.destroy(existingUnit.logoPublicId);
    }

    // 🔥 3. Upload new image
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `atc/units/${unitId}/logo`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    // 🔥 4. SAVE NEW LOGO
    await db.collection("units").updateOne(
      { _id: new ObjectId(unitId) },
      {
        $set: {
          logo: uploadRes.secure_url,
          logoPublicId: uploadRes.public_id, // ✅ FIXED
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      message: "Logo updated",
      logo: uploadRes.secure_url,
    });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}