import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = "mongodb+srv://atc_db:2mcguYg3oPW3tG9l@cluster0.powqnox.mongodb.net/?appName=Cluster0";
const DB_NAME = "atc_db";

const CATEGORY_MAP = {
  CEREMONY: "CEREMONY",
  EXERCISE: "EXERCISE",
  TRAINING: "TRAINING",
  EVENT: "COMMUNITY",
};

async function migrate() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const existingCount = await db.collection("albums").countDocuments();
  if (existingCount > 0) {
    console.log(`⚠️  albums collection already has ${existingCount} documents. Skipping.`);
    await client.close();
    return;
  }

  const [events, galleries] = await Promise.all([
    db.collection("events").find({}).toArray(),
    db.collection("galleries").find({}).toArray(),
  ]);

  console.log(`Found ${events.length} events and ${galleries.length} galleries`);

  const albumsToInsert = [];
  const migratedGalleryIds = new Set();

  for (const event of events) {
    const gallery = galleries.find(
      (g) => g.eventId && g.eventId.toString() === event._id.toString()
    );

    if (gallery) migratedGalleryIds.add(gallery._id.toString());

    const images = (gallery?.images ?? []).map((img) => ({
      url: img.url,
      publicId: img.publicId,
      caption: gallery?.caption || "",
    }));

    albumsToInsert.push({
      title: event.title,
      description: event.description || "",
      category: CATEGORY_MAP[event.category] ?? event.category,
      scope: event.scope,
      unitId: event.unitId ?? null,
      date: event.createdAt ?? new Date(),
      coverImage: event.coverImage || (images[0]?.url ?? null),
      images,
      createdAt: event.createdAt ?? new Date(),
      updatedAt: event.updatedAt ?? new Date(),
      _migratedFromEventId: event._id,
      _migratedFromGalleryId: gallery?._id ?? null,
    });

    console.log(
      `  ✓ Event "${event.title}" → ${images.length} image(s)` +
        (gallery ? "" : " (no gallery found)")
    );
  }

  // Orphaned galleries
  let orphaned = 0;
  for (const gallery of galleries) {
    if (migratedGalleryIds.has(gallery._id.toString())) continue;
    const images = (gallery.images ?? []).map((img) => ({
      url: img.url,
      publicId: img.publicId,
      caption: gallery.caption || "",
    }));
    albumsToInsert.push({
      title: gallery.caption || "Untitled Album",
      description: "",
      category: CATEGORY_MAP[gallery.category] ?? gallery.category ?? "COMMUNITY",
      scope: gallery.scope || "COMMAND",
      unitId: gallery.unitId ?? null,
      date: gallery.createdAt ?? new Date(),
      coverImage: images[0]?.url ?? null,
      images,
      createdAt: gallery.createdAt ?? new Date(),
      updatedAt: gallery.createdAt ?? new Date(),
      _migratedFromEventId: null,
      _migratedFromGalleryId: gallery._id,
    });
    orphaned++;
    console.log(`  ✓ Orphaned gallery "${gallery.caption || gallery._id}" → ${images.length} image(s)`);
  }

  if (albumsToInsert.length === 0) {
    console.log("Nothing to migrate.");
    await client.close();
    return;
  }

  const result = await db.collection("albums").insertMany(albumsToInsert);
  console.log(`\n✅ Migration complete!`);
  console.log(`   Inserted: ${result.insertedCount} albums`);
  console.log(`   From events: ${events.length}`);
  console.log(`   From orphaned galleries: ${orphaned}`);

  await client.close();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
