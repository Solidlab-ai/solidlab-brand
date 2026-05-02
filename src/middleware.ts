import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "solidlab-fallback-secret-change-in-prod"
);

const PUBLIC_PATHS = [
  "/login",
  "/api/otp",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Tillat statiske assets og public paths
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    isPublicPath(pathname)
  ) {
    return NextResponse.next();
  }

  // Sjekk session-cookie
  const sessionToken = request.cookies.get("solidlab_session")?.value;
  
  if (!sessionToken) {
    // Redirect til login for sider; returner 401 for API
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(sessionToken, SESSION_SECRET);
    return NextResponse.next();
  } catch {
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Sesjon utløpt" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("solidlab_session");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
