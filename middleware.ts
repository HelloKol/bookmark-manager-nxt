import { NextRequest, NextResponse } from "next/server";
import { UserInfo } from "firebase-admin/auth";

// In-memory cache for session verification
const sessionCache = new Map<
  string,
  { user: UserInfo | null; timestamp: number }
>();

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const subdomain = host.split(".")[0];

  const sessionCookie = request.cookies.get("session")?.value;
  const authPaths = [
    "/login",
    "/register",
    "/reset-password",
    "/change-password",
  ];
  const { pathname } = url;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Handle subdomains
  if (subdomain === "app") {
    if (pathname === "/") {
      url.pathname = "/app";
    } else if (!pathname.startsWith("/app")) {
      url.pathname = `/app${pathname}`;
    }
  } else if (subdomain !== "vercel" && subdomain !== "localhost") {
    if (pathname === "/") {
      url.pathname = "/marketing";
    } else if (!pathname.startsWith("/marketing")) {
      url.pathname = `/marketing${pathname}`;
    }
  }

  // Skip session check for non-app subdomains
  if (subdomain !== "app") {
    return NextResponse.rewrite(url);
  }

  // Check session cache
  let user: UserInfo | null = null;
  if (sessionCookie && sessionCache.has(sessionCookie)) {
    const cachedSession = sessionCache.get(sessionCookie);
    if (cachedSession && Date.now() - cachedSession.timestamp < 60 * 1000) {
      user = cachedSession.user;
    }
  }

  // Verify session if not cached
  if (!user && sessionCookie) {
    const response = await fetch(
      `${request.nextUrl.origin}/api/verify-session`,
      {
        headers: { Cookie: `session=${sessionCookie}` },
      }
    );

    if (response.ok) {
      const data = await response.json();
      user = data.user;
      sessionCache.set(sessionCookie, { user, timestamp: Date.now() });
    }
  }

  // Redirect based on authentication status
  if (user) {
    if (authPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (!authPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.rewrite(url);
}

// Exclude static files, API routes, and PWA assets from rewriting
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|static/|images/|fonts/|manifest.json).*)",
  ],
};
