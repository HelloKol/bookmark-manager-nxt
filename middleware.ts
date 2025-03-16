import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    // Redirect logged-out users away from protected pages
    const protectedPaths = ["/dashboard"];
    const { pathname } = request.nextUrl;

    if (protectedPaths.includes(pathname)) {
      const redirectResponse = NextResponse.redirect(
        new URL("/login", request.url)
      );
      redirectResponse.headers.set("x-middleware-cache", "no-cache"); // <- Check this
      return redirectResponse;
    }

    const responseNext = NextResponse.next();
    responseNext.headers.set("x-middleware-cache", "no-cache"); // <- Check this
    return responseNext;
  }

  // Verify session cookie by calling the API route
  const response = await fetch(`${request.nextUrl.origin}/api/verify-session`, {
    headers: {
      Cookie: `session=${sessionCookie}`,
    },
  });

  const { user } = await response.json();

  // Paths to protect
  const protectedPaths = ["/dashboard"];
  const authPaths = ["/login", "/register"];

  const { pathname } = request.nextUrl;

  // Redirect logged-in users away from auth pages
  if (user && authPaths.includes(pathname)) {
    const redirectResponse = NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
    redirectResponse.headers.set("x-middleware-cache", "no-cache"); // <- Check this
    return redirectResponse;
  }

  // Redirect logged-out users away from protected pages
  if (!user && protectedPaths.includes(pathname)) {
    const redirectResponse = NextResponse.redirect(
      new URL("/login", request.url)
    );
    redirectResponse.headers.set("x-middleware-cache", "no-cache"); // <- Check this
    return redirectResponse;
  }

  const responseNext = NextResponse.next();
  responseNext.headers.set("x-middleware-cache", "no-cache"); // <- Check this
  return responseNext;
}
