/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export type GalleryDoc = {
  _id?: ObjectId;
  images: { url: string; publicId: string }[];
  caption: string;
  category: string;
  scope: string;
  unitId?: ObjectId | null;
  eventId?: ObjectId | null;
  createdAt: Date;
};

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const formData = await req.formData();

    const type = formData.get("type"); //  KEY
    const caption = formData.get("caption") as string;
    const category = formData.get("category") as string;
    const scope = formData.get("scope") as string;
    const unitId = formData.get("unitId") as string | null;
    const eventId = formData.get("eventId") as string | null;

    // ============================
    //  1. PORTRAIT (SINGLE FILE)
    // ============================
    if (type === "PORTRAIT") {
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No file uploaded" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadRes: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `atc/units/${unitId}/commanders`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(buffer);
      });

      return NextResponse.json({
        message: "Portrait uploaded",
        data: {
          imageUrl: uploadRes.secure_url,
          publicId: uploadRes.public_id,
        },
      });
    }

    // ============================
    //  2. GALLERY (MULTIPLE)
    // ============================
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadedImages = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadRes: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: scope === "COMMAND" ? "atc/command" : `atc/units/${unitId}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(buffer);
      });

      uploadedImages.push({
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
      });

      //  set cover image once
      if (eventId) {
        const existingEvent = await db.collection("events").findOne({
          _id: new ObjectId(eventId),
        });

        if (!existingEvent?.coverImage) {
          await db
            .collection("events")
            .updateOne(
              { _id: new ObjectId(eventId) },
              { $set: { coverImage: uploadRes.secure_url } }
            );
        }
      }
    }

    // ============================
    //  UPSERT GALLERY
    // ============================
    await db.collection<GalleryDoc>("galleries").updateOne(
      {
        eventId: eventId ? new ObjectId(eventId) : null,
      },
      {
        $setOnInsert: {
          caption,
          category,
          scope,
          unitId: unitId ? new ObjectId(unitId) : null,
          eventId: eventId ? new ObjectId(eventId) : null,
          createdAt: new Date(),
        },
        $push: {
          images: {
            $each: uploadedImages,
          },
        } as any, // ✅ FIX TS ERROR HERE
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: "Upload successful",
      images: uploadedImages,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const { db } = await connectToDatabase();
//     const formData = await req.formData();
//     const type = formData.get("type"); // "GALLERY" | "PORTRAIT"

//     const file = formData.get("file") as File;
//     const caption = formData.get("caption") as string;
//     const category = formData.get("category") as string;
//     const scope = formData.get("scope") as string;
//     const unitId = formData.get("unitId") as string | null;
//     const eventId = formData.get("eventId") as string | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // Convert file to buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Upload to Cloudinary
//     const uploadRes: any = await new Promise((resolve, reject) => {
//       const isPortrait = type === "PORTRAIT";

//       const stream = cloudinary.uploader.upload_stream(
//         {
//           folder: isPortrait
//             ? `atc/units/${unitId}/commanders`
//             : scope === "COMMAND"
//             ? "atc/command"
//             : `atc/units/${unitId}`,
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );

//       stream.end(buffer);
//     });

//     //  ADD THIS BLOCK HERE
//     if (eventId) {
//       const existing = await db.collection("events").findOne({
//         _id: new ObjectId(eventId),
//       });

//       if (!existing?.coverImage) {
//         await db
//           .collection("events")
//           .updateOne(
//             { _id: new ObjectId(eventId) },
//             { $set: { coverImage: uploadRes.secure_url } }
//           );
//       }
//     }

//     // Save to MongoDB (gallery)
//     const newImage = {
//       imageUrl: uploadRes.secure_url,
//       publicId: uploadRes.public_id,
//       caption,
//       category,
//       scope,
//       unitId: unitId ? new ObjectId(unitId) : null,
//       eventId: eventId ? new ObjectId(eventId) : null,
//       createdAt: new Date(),
//     };

//     if (type !== "PORTRAIT") {
//       await db.collection("galleries").insertOne(newImage);
//     }

//     return NextResponse.json({
//       message: "Upload successful",
//       data: {
//         imageUrl: uploadRes.secure_url,
//         publicId: uploadRes.public_id,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }
