/* eslint-disable @typescript-eslint/no-explicit-any */

import { getPaginatedNews } from "@/lib/services/news.services";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const skip = (page - 1) * limit;
  const q = searchParams.get("q") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const isAdmin = searchParams.get("admin") === "true";
 
  const data = await getPaginatedNews({
    page,
    limit,
    q,
    sortBy,
    sortOrder,
    isAdmin,
  });
  return NextResponse.json(data);
}
