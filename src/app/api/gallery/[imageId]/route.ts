import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await context.params;

    if (!ObjectId.isValid(imageId)) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const image = await db.collection("galleries").findOne({
      _id: new ObjectId(imageId),
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // 🔥 DELETE FROM CLOUDINARY
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    // Check if this image is used as coverImage
    const eventUsingImage = await db.collection("events").findOne({
      coverImage: image.imageUrl,
    });

    if (eventUsingImage) {
      // Option 1 (simple): remove cover image
      await db
        .collection("events")
        .updateOne(
          { _id: eventUsingImage._id },
          { $unset: { coverImage: "" } }
        );

      // ✅ OPTIONAL (better UX): auto-set next image as cover
      const nextImage = await db.collection("galleries").findOne({
        eventId: image.eventId,
        _id: { $ne: image._id },
      });

      if (nextImage) {
        await db
          .collection("events")
          .updateOne(
            { _id: eventUsingImage._id },
            { $set: { coverImage: nextImage.imageUrl } }
          );
      }
    }

    // 🔥 DELETE FROM DB
    await db.collection("galleries").deleteOne({
      _id: new ObjectId(imageId),
    });

    return NextResponse.json({ message: "Image deleted" });
  } catch (error) {
    console.error("DELETE IMAGE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
