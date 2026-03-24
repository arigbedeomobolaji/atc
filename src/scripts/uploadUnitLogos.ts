/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { connectToDatabase } from "../lib/db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function uploadLogos() {
  const { db } = await connectToDatabase();

  const units = await db.collection("units").find({}).toArray();

  for (const unit of units) {
    const filePath = path.join(
      process.cwd(),
      "public/logos",
      `${unit.slug}.jpg` // naming convention
    );

    console.log({
      cloud: process.env.CLOUDINARY_CLOUD_NAME,
      key: process.env.CLOUDINARY_API_KEY ? "loaded" : "missing",
      secret: process.env.CLOUDINARY_API_SECRET ? "loaded" : "missing",
    });

    if (!fs.existsSync(filePath)) continue;

    const result: any = await cloudinary.uploader.upload(filePath, {
      folder: `atc/units/${unit.slug}/logo`,
    });

    await db.collection("units").updateOne(
      { _id: unit._id },
      {
        $set: {
          logo: result.secure_url,
        },
      }
    );

    console.log(`Uploaded logo for ${unit.unit}`);
  }

  console.log("✅ All logos uploaded");
}

uploadLogos().catch(console.error);
