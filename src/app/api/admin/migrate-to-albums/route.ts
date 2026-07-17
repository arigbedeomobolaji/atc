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

    // Build a set of gallery IDs already tracked in albums
    const migratedIds = await db
      .collection("albums")
      .distinct("_migratedFromGalleryId", { _migratedFromGalleryId: { $ne: null } });
    const migratedSet = new Set(migratedIds.map((id: any) => id.toString()));

    // Build a set of existing album fingerprints (title + unitId) to avoid content duplicates
    const existing = await db.collection("albums").find({}, { projection: { title: 1, unitId: 1 } }).toArray();
    const fingerprintSet = new Set(
      existing.map((a) => `${a.title}||${a.unitId?.toString() ?? "null"}`)
    );

    const galleries = await db.collection("galleries").find({}).toArray();
    const events = await db.collection("events").find({}).toArray();
    const eventMap = new Map(events.map((e) => [e._id.toString(), e]));

    const toInsert: any[] = [];

    for (const gallery of galleries) {
      const gid = gallery._id.toString();
      if (migratedSet.has(gid)) continue; // already tracked

      const event = gallery.eventId ? eventMap.get(gallery.eventId.toString()) : null;
      const title = event?.title || gallery.caption || "Untitled Album";
      const unitId = gallery.unitId ?? event?.unitId ?? null;
      const fingerprint = `${title}||${unitId?.toString() ?? "null"}`;

      if (fingerprintSet.has(fingerprint)) continue; // content already exists

      toInsert.push({
        title,
        description: event?.description || "",
        category: CATEGORY_MAP[gallery.category ?? event?.category] ?? "COMMUNITY",
        unitId,
        unitName: null,
        date: gallery.createdAt ?? new Date(),
        coverImage: gallery.images?.[0]?.url ?? null,
        images: (gallery.images ?? []).map((img: any) => ({
          url: img.url,
          publicId: img.publicId,
          caption: gallery.caption || "",
        })),
        createdAt: gallery.createdAt ?? new Date(),
        updatedAt: gallery.createdAt ?? new Date(),
        _migratedFromGalleryId: gallery._id,
        _migratedFromEventId: gallery.eventId ?? null,
      });

      fingerprintSet.add(fingerprint); // prevent intra-batch duplicates
    }

    if (toInsert.length === 0) {
      return NextResponse.json({ message: "Nothing new to migrate", migrated: 0 });
    }

    const result = await db.collection("albums").insertMany(toInsert);
    return NextResponse.json({ message: "Migration complete", migrated: result.insertedCount });
  } catch (error) {
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
