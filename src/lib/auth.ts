// lib/auth.ts
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return { message: "Error has occured", error: e };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAuthResponse(data: any) {
  const res = NextResponse.json(data);
  return res;
}

export function requireAuth(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const tokenCookie = cookie
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith("atc_admin_token="));
  if (!tokenCookie) return null;
  const token = tokenCookie.split("=")[1];
  return verifyToken(token);
}
