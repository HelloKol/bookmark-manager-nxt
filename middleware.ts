import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory cache for session verification
const sessionCache = new Map<string, { user: any; timestamp: number }>();

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;

  // Skip session verification for non-protected routes
  const protectedPaths = ["/dashboard"];
  const authPaths = ["/login", "/register"];
  const { pathname } = request.nextUrl;

  if (!protectedPaths.includes(pathname) && !authPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if session is cached
  if (sessionCookie && sessionCache.has(sessionCookie)) {
    const cachedSession = sessionCache.get(sessionCookie);
    if (cachedSession && Date.now() - cachedSession.timestamp < 60 * 1000) {
      // Use cached session data if it's less than 1 minute old
      const { user } = cachedSession;

      // Redirect logged-in users away from auth pages
      if (user && authPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Redirect logged-out users away from protected pages
      if (!user && protectedPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      return NextResponse.next();
    }
  }

  // Verify session cookie by calling the API route
  if (sessionCookie) {
    const response = await fetch(
      `${request.nextUrl.origin}/api/verify-session`,
      {
        headers: {
          Cookie: `session=${sessionCookie}`,
        },
      }
    );

    if (response.ok) {
      const { user } = await response.json();

      // Cache the session verification result
      sessionCache.set(sessionCookie, { user, timestamp: Date.now() });

      // Redirect logged-in users away from auth pages
      if (user && authPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Redirect logged-out users away from protected pages
      if (!user && protectedPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  } else if (protectedPaths.includes(pathname)) {
    // Redirect logged-out users away from protected pages
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
