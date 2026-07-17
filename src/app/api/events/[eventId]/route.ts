import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

/**
 * GET SINGLE EVENT
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await context.params; // ✅ FIX

    const id = eventId?.toString().trim();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const event = await db.collection("events").findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Look up the album that was migrated from this event (or manually linked)
    const album = await db.collection("albums").findOne({
      _migratedFromEventId: new ObjectId(id),
    });

    return NextResponse.json({
      event: {
        ...event,
        _id: event._id.toString(),
        unitId: event.unitId?.toString(),
      },
      images: (album?.images ?? []).map((img: any, idx: number) => ({
        _id: idx.toString(),
        imageUrl: img.url,
        caption: img.caption ?? "",
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

/**
 * UPDATE EVENT
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { db } = await connectToDatabase();
    const { eventId } = await params;

    await db.collection("events").updateOne(
      { _id: new ObjectId(eventId) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/**
 * DELETE EVENT
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { db } = await connectToDatabase();

    const { eventId } = await params;

    await db.collection("events").deleteOne({
      _id: new ObjectId(eventId),
    });

    // Delete the linked album (migrated or manually linked)
    await db.collection("albums").deleteMany({
      _migratedFromEventId: new ObjectId(eventId),
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
