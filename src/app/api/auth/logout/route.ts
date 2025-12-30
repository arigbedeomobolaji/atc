// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: "atc_admin_token",
    value: "",
    maxAge: 0,
    path: "/",
  });
  return res;
}
