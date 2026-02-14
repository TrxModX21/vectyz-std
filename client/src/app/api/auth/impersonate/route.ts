import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const response = NextResponse.redirect(new URL(callbackUrl, req.url));

  // Set the session cookie manually
  // Note: Adjust cookie name if you use a secure prefix or different name in production
  response.cookies.set("better-auth.session_token", token, {
    path: "/",
    httpOnly: true,
    secure: true, // Set to true if using HTTPS (or localhost with secure config)
    sameSite: "none", // Matches server config
    maxAge: 60 * 20, // 20 minutes
  });

  return response;
}
