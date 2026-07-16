/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const CATEGORY_MAP: Record<string, string> = {
  CEREMONY: "CEREMONY",
  EXERCISE: "EXERCISE",
  TRAINING: "TRAINING",
  EVENT: "COMMUNITY",
};

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { db } = await connectToDatabase();

    const existingCount = await db.collection("albums").countDocuments();
    if (existingCount > 0) {
      return NextResponse.json(
        { error: "Albums collection already has data. Drop it first or use force=true." },
        { status: 409 }
      );
    }

    const [events, galleries] = await Promise.all([
      db.collection("events").find({}).toArray(),
      db.collection("galleries").find({}).toArray(),
    ]);

    const albumsToInsert: any[] = [];
    const migratedGalleryIds = new Set<string>();

    for (const event of events) {
      const gallery = galleries.find(
        (g) => g.eventId && g.eventId.toString() === event._id.toString()
      );

      if (gallery) migratedGalleryIds.add(gallery._id.toString());

      albumsToInsert.push({
        title: event.title,
        description: event.description || "",
        category: CATEGORY_MAP[event.category] ?? event.category,
        scope: event.scope,
        unitId: event.unitId ?? null,
        date: event.createdAt ?? new Date(),
        coverImage: event.coverImage || (gallery?.images?.[0]?.url ?? null),
        images: (gallery?.images ?? []).map((img: any) => ({
          url: img.url,
          publicId: img.publicId,
          caption: gallery?.caption || "",
        })),
        createdAt: event.createdAt ?? new Date(),
        updatedAt: event.updatedAt ?? new Date(),
        _migratedFromEventId: event._id,
        _migratedFromGalleryId: gallery?._id ?? null,
      });
    }

    // Orphaned galleries (no matching event)
    for (const gallery of galleries) {
      if (migratedGalleryIds.has(gallery._id.toString())) continue;

      albumsToInsert.push({
        title: gallery.caption || "Untitled Album",
        description: "",
        category: CATEGORY_MAP[gallery.category] ?? gallery.category ?? "COMMUNITY",
        scope: gallery.scope || "COMMAND",
        unitId: gallery.unitId ?? null,
        date: gallery.createdAt ?? new Date(),
        coverImage: gallery.images?.[0]?.url ?? null,
        images: (gallery.images ?? []).map((img: any) => ({
          url: img.url,
          publicId: img.publicId,
          caption: gallery.caption || "",
        })),
        createdAt: gallery.createdAt ?? new Date(),
        updatedAt: gallery.createdAt ?? new Date(),
        _migratedFromEventId: null,
        _migratedFromGalleryId: gallery._id,
      });
    }

    if (albumsToInsert.length === 0) {
      return NextResponse.json({ message: "Nothing to migrate", migrated: 0 });
    }

    const result = await db.collection("albums").insertMany(albumsToInsert);
    return NextResponse.json({
      message: "Migration complete",
      migrated: result.insertedCount,
      fromEvents: events.length,
      fromOrphanedGalleries: albumsToInsert.length - events.length,
    });
  } catch (error) {
    console.error("MIGRATION ERROR:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
