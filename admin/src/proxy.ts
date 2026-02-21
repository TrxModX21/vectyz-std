import { NextRequest, NextResponse } from "next/server";

// Define public routes
const publicRoutes = ["/", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes to pass through (Better Auth handles its own auth)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const sessionCookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-better-auth.session_token"
      : "better-auth.session_token";
  const domainConfig =
    process.env.NODE_ENV === "production" ? ".vectyz.com" : undefined;

  const sessionCookie =
    request.cookies.get(sessionCookieName) ||
    request.cookies.get("better-auth.session_token"); // Fallback
    
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
      response.cookies.delete({
        name: sessionCookieName,
        domain: domainConfig,
        path: "/",
      });
      // (Opsional/Best Practice) Sapu bersih juga versi lokal jaga-jaga status env bocor
      if (process.env.NODE_ENV === "production") {
        response.cookies.delete({
          name: "better-auth.session_token",
          domain: domainConfig,
          path: "/",
        });
      }
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
      response.cookies.delete({
        name: sessionCookieName,
        domain: domainConfig,
        path: "/",
      });
      // (Opsional/Best Practice) Sapu bersih juga versi lokal jaga-jaga status env bocor
      if (process.env.NODE_ENV === "production") {
        response.cookies.delete({
          name: "better-auth.session_token",
          domain: domainConfig,
          path: "/",
        });
      }
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
