// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("atc_admin_token="));
    if (!match)
      return NextResponse.json({ authenticated: false }, { status: 401 });

    const token = match.split("=")[1];
    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ authenticated: false }, { status: 401 });

    return NextResponse.json(
      { authenticated: true, user: payload },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
