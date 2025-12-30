// app/api/news/update/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { sanitizeHTML } from "@/lib/sanitize";

export async function POST(req: Request) {
  try {
    const auth = requireAuth(req);
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await req.json();
    const { id, title, slug, excerpt, content, images } = payload;
    if (!id || !title || !content)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const safeContent = sanitizeHTML(content);

    const { db } = await connectToDatabase();
    const update = {
      $set: {
        title,
        slug:
          slug ||
          title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, ""),
        excerpt,
        content: safeContent,
        images: (images || []).map((i: string) => new ObjectId(i)),
        updatedAt: new Date(),
      },
    };

    await db.collection("news").updateOne({ _id: new ObjectId(id) }, update);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
