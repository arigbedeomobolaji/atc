// lib/db.ts
import { MongoClient, Db, GridFSBucket } from "mongodb";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

if (!uri) throw new Error("Missing MONGODB_URI in .env.local");
if (!dbName) throw new Error("Missing MONGODB_DB in .env.local");

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout
  });
  await client.connect();

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getGridFSBucket() {
  const { db } = await connectToDatabase();
  return new GridFSBucket(db, { bucketName: "news_images" });
}
