import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
