// // app/api/news/create/route.ts
// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/db";
// import { verifyToken } from "@/lib/auth";
// import { ObjectId } from "mongodb";

// export async function POST(req: Request) {
//   try {
//     // check auth cookie
//     const cookie = req.headers.get("cookie") || "";
//     const match = cookie
//       .split(";")
//       .map((s) => s.trim())
//       .find((s) => s.startsWith("atc_admin_token="));
//     if (!match)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     const token = match.split("=")[1];
//     const user = verifyToken(token);
//     if (!user)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const payload = await req.json();
//     const { title, slug, excerpt, content, images } = payload;
//     if (!title || !content)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     const { db } = await connectToDatabase();
//     const news = {
//       title,
//       slug:
//         slug ||
//         title
//           .toLowerCase()
//           .replace(/\s+/g, "-")
//           .replace(/[^\w-]/g, ""),
//       excerpt: excerpt || content.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160),
//       content,
//       images: (images || []).map((id: string) => new ObjectId(id)),
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       author: (user as any).username || "admin",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
//     const result = await db.collection("news").insertOne(news);

//     return NextResponse.json({
//       success: true,
//       id: result.insertedId.toString(),
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

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
    const { title, slug, excerpt, content, images } = payload;
    if (!title || !content)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // SANITIZE HTML
    const safeContent = sanitizeHTML(content);

    const { db } = await connectToDatabase();
    const doc = {
      title,
      slug:
        slug ||
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, ""),
      excerpt: excerpt || content.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160),
      content: safeContent,
      images: (images || []).map((id: string) => new ObjectId(id)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      author: (auth as any).username || "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("news").insertOne(doc);
    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
