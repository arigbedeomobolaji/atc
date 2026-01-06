// app/api/news/image/[id]/route.ts

import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();

    const bucket = new (await import("mongodb")).GridFSBucket(db, {
      bucketName: "news_images",
    });

    const _id = new ObjectId(id);

    // Check file exists
    const file = await db.collection("news_images.files").findOne({ _id });
    if (!file) return new Response("Not found", { status: 404 });

    const downloadStream = bucket.openDownloadStream(_id);

    // Convert Node.js ReadableStream → Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        downloadStream.on("data", (chunk) => controller.enqueue(chunk));
        downloadStream.on("end", () => controller.close());
        downloadStream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(webStream, {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
}
