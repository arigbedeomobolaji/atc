import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://atc_db:2mcguYg3oPW3tG9l@cluster0.powqnox.mongodb.net/?appName=Cluster0";
const DB_NAME = "atc_db";

async function run() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  // Build unitId → name lookup
  const units = await db.collection("units").find({}).toArray();
  const unitMap = Object.fromEntries(units.map((u) => [u._id.toString(), u.unit]));
  console.log(`Loaded ${units.length} units`);

  const albums = await db.collection("albums").find({}).toArray();
  console.log(`Processing ${albums.length} albums…`);

  let updated = 0;
  for (const album of albums) {
    const unitName = album.unitId ? (unitMap[album.unitId.toString()] ?? null) : null;

    await db.collection("albums").updateOne(
      { _id: album._id },
      {
        $set: { unitName },
        $unset: {
          scope: "",
          _migratedFromEventId: "",
          _migratedFromGalleryId: "",
        },
      }
    );
    console.log(
      `  ✓ "${album.title}" → unitName: ${unitName ?? "null (command-wide)"}`
    );
    updated++;
  }

  // Create indexes
  await db.collection("albums").createIndex({ unitId: 1, date: -1 });
  await db.collection("albums").createIndex({ category: 1, unitId: 1, date: -1 });
  console.log(`\n✅ Done. Updated ${updated} albums + created 2 indexes.`);

  await client.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
