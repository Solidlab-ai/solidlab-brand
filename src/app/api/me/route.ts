// /api/me — returnerer info om innlogget bruker (eller 401)
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const runtime = "nodejs";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "solidlab-fallback-secret-change-in-prod"
);

export async function GET(req: NextRequest) {
  const token = req.cookies.get("solidlab_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return NextResponse.json({
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      access: payload.access || [],
      isAdmin: !!payload.isAdmin,
    });
  } catch {
    return NextResponse.json({ error: "invalid session" }, { status: 401 });
  }
}
