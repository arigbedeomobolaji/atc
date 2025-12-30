// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { comparePassword } from "@/lib/hash";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const admin = await db.collection("admins").findOne({ username });
    if (!admin)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const valid = await comparePassword(password, admin.password);
    if (!valid)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const token = signToken({ id: admin._id.toString(), username });

    const res = NextResponse.json({ success: true, username });
    res.cookies.set({
      name: "atc_admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
