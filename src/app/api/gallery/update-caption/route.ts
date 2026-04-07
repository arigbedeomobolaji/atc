import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
  try {
    const { galleryId, caption } = await req.json();

    if (!galleryId) {
      return NextResponse.json(
        { error: "Gallery ID required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    await db.collection("galleries").updateOne(
      { _id: new ObjectId(galleryId) },
      {
        $set: {
          caption,
        },
      }
    );

    return NextResponse.json({ message: "Caption updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update caption" },
      { status: 500 }
    );
  }
}
