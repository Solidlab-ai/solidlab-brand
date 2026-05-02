import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Sletter session-cookie og signaliserer til klienten at logout er OK.
// Klienten redirecter til /login etter dette kallet.
export async function POST(_req: NextRequest) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("solidlab_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
