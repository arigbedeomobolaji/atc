/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 5);
    const skip = (page - 1) * limit;

    const q = searchParams.get("q") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const { db } = await connectToDatabase();

    /** SEARCH FILTER */
    const filter: any = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } },
            { createdAt: { $regex: q } }, // optional date text search
          ],
        }
      : {};

    const [news, total] = await Promise.all([
      db
        .collection("news")
        .find(filter)
        .sort({ [sortBy]: sortOrder })
        .project({ content: 0 })
        .skip(skip)
        .limit(limit)
        .toArray(),

      db.collection("news").countDocuments(filter),
    ]);

    return NextResponse.json({
      news,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      news: [],
      page: 1,
      total: 0,
      totalPages: 1,
    });
  }
}
