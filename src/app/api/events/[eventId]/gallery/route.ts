import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  try {
    const { db } = await connectToDatabase();
    const { eventId } = await context.params;

    const gallery = await db.collection("galleries").findOne({
      eventId: new ObjectId(eventId),
    });

    if (!gallery) {
      return NextResponse.json({
        _id: null,
        images: [],
      });
    }

    return NextResponse.json({
      _id: gallery._id.toString(),
      images: gallery.images || [],
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
