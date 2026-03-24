/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/units/upload-logo/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const unitId = formData.get("unitId") as string;

    if (!file || !unitId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

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

    const { db } = await connectToDatabase();

    await db.collection("units").updateOne(
      { _id: new ObjectId(unitId) },
      {
        $set: {
          logo: uploadRes.secure_url,
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
