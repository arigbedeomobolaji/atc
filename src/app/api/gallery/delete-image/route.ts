/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";
import { GalleryDoc } from "../upload/route";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    const { galleryId, publicId } = body;

    if (!galleryId || !publicId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const gallery = await db.collection("galleries").findOne({
      _id: new ObjectId(galleryId),
    });

    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    // =========================
    //  1. DELETE FROM CLOUDINARY
    // =========================
    await cloudinary.uploader.destroy(publicId);

    // =========================
    //  2. REMOVE FROM ARRAY
    // =========================
    await db.collection<GalleryDoc>("galleries").updateOne(
      { _id: new ObjectId(galleryId) },
      {
        $pull: {
          images: { publicId },
        },
      }
    );

    // =========================
    //  3. CHECK IF EMPTY
    // =========================
    const updatedGallery = await db.collection("galleries").findOne({
      _id: new ObjectId(galleryId),
    });

    if (!updatedGallery || updatedGallery.images.length === 0) {
      await db.collection("galleries").deleteOne({
        _id: new ObjectId(galleryId),
      });
    }

    // =========================
    //  4. HANDLE EVENT COVER IMAGE
    // =========================
    if (gallery.eventId) {
      const event = await db.collection("events").findOne({
        _id: gallery.eventId,
      });

      const deletedImageUrl = gallery.images.find(
        (img: any) => img.publicId === publicId
      )?.url;

      if (event?.coverImage === deletedImageUrl) {
        const nextImage = updatedGallery?.images?.[0];

        await db.collection("events").updateOne(
          { _id: gallery.eventId },
          {
            $set: {
              coverImage: nextImage ? nextImage.url : "",
            },
          }
        );
      }
    }

    return NextResponse.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
