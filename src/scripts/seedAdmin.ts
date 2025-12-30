// scripts/seedAdmin.ts (run with ts-node or compile)
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectToDatabase } from "../lib/db";
import { hashPassword } from "../lib/hash";

async function seed() {
  const { db } = await connectToDatabase();
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const existing = await db.collection("admins").findOne({ username });
  if (existing) {
    console.log("Admin already exists");
    return;
  }
  if (!password) {
    console.log("Please provide password.");
    return;
  }
  const hashed = await hashPassword(password);
  await db
    .collection("admins")
    .insertOne({ username, password: hashed, createdAt: new Date() });
  console.log("Admin created:", username);
}
seed().catch(console.error);
