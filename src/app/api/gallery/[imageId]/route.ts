/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";
import { GalleryDoc } from "../upload/route";

export async function DELETE(req: Request) {
  try {
    const { db } = await connectToDatabase();
    const { galleryId, publicId } = await req.json();

    if (!ObjectId.isValid(galleryId)) {
      return NextResponse.json(
        { error: "Invalid gallery ID" },
        { status: 400 }
      );
    }

    const gallery = await db.collection("galleries").findOne({
      _id: new ObjectId(galleryId),
    });

    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    //  delete from cloudinary
    await cloudinary.uploader.destroy(publicId);

    //  remove from images array
    await db.collection<GalleryDoc>("galleries").updateOne(
      { _id: new ObjectId(galleryId) },
      {
        $pull: {
          images: { publicId },
        },
      }
    );

    //  OPTIONAL: fix event cover
    const isCover = await db.collection("events").findOne({
      coverImage: { $in: gallery.images.map((img: any) => img.url) },
    });

    if (isCover) {
      await db
        .collection("events")
        .updateOne({ _id: isCover._id }, { $unset: { coverImage: "" } });
    }

    return NextResponse.json({ message: "Image deleted ✅" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
