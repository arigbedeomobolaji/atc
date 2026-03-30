/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "../lib/db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function seedGallery() {
  const { db } = await connectToDatabase();

  // 1️⃣ Create Event
  const eventRes = await db.collection("events").insertOne({
    title: "AOC Leadership & Command",
    description: "Leadership of Air Training Command",
    scope: "COMMAND",
    category: "CEREMONY",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const eventId = eventRes.insertedId;

  const images = [
    {
      file: "AOC_portrait.jpeg",
      caption: "Portrait of the AOC",
      description: "Official portrait...",
      category: "LEADERSHIP",
    },
    {
      file: "Handing_command_colour.jpeg",
      caption: "Command Colour Handover",
      description: "Ceremony event...",
      category: "CEREMONY",
    },
  ];

  for (const img of images) {
    const filePath = path.join(process.cwd(), "public/assets", img.file);

    const upload: any = await cloudinary.uploader.upload(filePath, {
      folder: "atc/command/leadership",
    });

    await db.collection("galleries").insertOne({
      imageUrl: upload.secure_url,
      caption: img.caption,
      description: img.description,
      category: img.category,
      scope: "COMMAND",
      eventId,
      createdAt: new Date(),
    });

    console.log(`Uploaded ${img.file}`);
  }

  console.log("✅ Gallery seeded successfully");
}

seedGallery().catch(console.error);
