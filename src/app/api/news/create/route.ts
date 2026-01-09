/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/news/create/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { sanitizeHTML } from "@/lib/sanitize";
import { extractImagesFromHTML } from "@/lib/extractimagefromhtml";

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export function excerptify(text: string, length: number) {
  return text.replace(/<\/?[^>]+(>|$)/g, "").slice(0, length);
}

export async function POST(req: Request) {
  try {
    const auth = requireAuth(req);
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await req.json();
    const { title, content, coverImage } = payload;

    if (!title || !content)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // SANITIZE HTML
    const safeContent = sanitizeHTML(content);

    // Extract images from HTML
    const extractedImages = extractImagesFromHTML(safeContent);

    // Pick cover image
    const finalCoverImage = coverImage || extractedImages[0] || null;

    const { db } = await connectToDatabase();
    const doc = {
      title,
      slug: slugify(title),
      excerpt: excerptify(safeContent, 150),
      content: safeContent,

      images: extractedImages, // ✅ auto
      coverImage: finalCoverImage, // ✅ explicit fallback

      author: (auth as any).username || "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("news").insertOne(doc);

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      slug: doc.slug,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
