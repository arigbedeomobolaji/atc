import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { connectToDatabase } from "../lib/db";

async function createIndexes() {
  const { db } = await connectToDatabase();

  await db
    .collection("commanders")
    .createIndex({ unitId: 1, startDate: 1 }, { unique: true });

  console.log("✅ Commander indexes created");
}

createIndexes().catch(console.error);

// npx tsx src/scripts/createIndexes.ts
