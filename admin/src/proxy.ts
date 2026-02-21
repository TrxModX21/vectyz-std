import { NextRequest, NextResponse } from "next/server";

// Define public routes
const publicRoutes = ["/", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes to pass through (Better Auth handles its own auth)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("better-auth.session_token");

  // Helper to verify session
  const verifySession = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/get-session`,
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        },
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data; // Request returns session object or null
    } catch (error) {
      console.error("Middleware Auth Verification Error:", error);
      return null;
    }
  };

  // 1. If user is trying to access a protected route (not in publicRoutes)
  if (!publicRoutes.includes(pathname)) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const session = await verifySession();

    // Check if session is explicitly null (invalid/expired)
    if (!session) {
      // Invalid session -> Redirect to login AND Clear Cookie loops
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("better-auth.session_token");
      return response;
    }

    // Valid session -> Proceed
    return NextResponse.next();
  }

  // 2. If user is trying to access a public route (like Login) BUT has a cookie
  if (publicRoutes.includes(pathname) && sessionCookie) {
    const session = await verifySession();

    if (session) {
      // Valid session -> Redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      // Invalid cookie -> Clear it and let them view the login page
      const response = NextResponse.next();
      response.cookies.delete("better-auth.session_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files (including .svg)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
