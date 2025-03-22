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

  console.log("Subdomain:", subdomain);

  // Session cookie and protected/auth paths
  const sessionCookie = request.cookies.get("session")?.value;
  const authPaths = [
    "/login",
    "/register",
    "/reset-password",
    "/change-password",
  ];
  const { pathname } = url;

  // URL rewriting based on subdomain
  if (subdomain === "app") {
    if (pathname === "/") {
      url.pathname = "/app";
    } else if (!pathname.startsWith("/app")) {
      url.pathname = `/app${pathname}`;
    }
  } else {
    if (pathname === "/") {
      url.pathname = "/marketing";
    } else if (!pathname.startsWith("/marketing")) {
      url.pathname = `/marketing${pathname}`;
    }
  }

  // Skip session verification for non-app subdomains
  if (subdomain !== "app") {
    return NextResponse.rewrite(url);
  }

  // Check if session is cached
  let user: UserInfo | null = null;
  if (sessionCookie && sessionCache.has(sessionCookie)) {
    const cachedSession = sessionCache.get(sessionCookie);
    if (cachedSession && Date.now() - cachedSession.timestamp < 60 * 1000) {
      user = cachedSession.user;
    }
  }

  // If session is not cached, verify it via the API
  if (!user && sessionCookie) {
    const response = await fetch(
      `${request.nextUrl.origin}/api/verify-session`,
      {
        headers: {
          Cookie: `session=${sessionCookie}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      user = data.user;

      // Cache the session verification result
      sessionCache.set(sessionCookie, { user, timestamp: Date.now() });
    }
  }

  // Redirect logic for authenticated users
  if (user) {
    // If user is logged in and tries to access auth pages, redirect to home
    if (authPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // If user is not logged in and tries to access protected pages, redirect to login
    if (!authPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Rewrite the URL for non-protected routes or after authentication checks
  return NextResponse.rewrite(url);
}

// Exclude static files and Next.js internals from rewriting.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|static/|images/|fonts/).*)",
  ],
};
