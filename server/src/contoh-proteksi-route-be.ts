import { auth } from "./lib/auth";
import { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";

const authenticatedRoute = async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    return res.json({ error: "Unauthorized" });
  }
  // Business logic di sini
  res.json({ user: session.user });
};

// PROTEKSI ROUTE DI NEXTJS
// Proxy.ts

// import { NextRequest, NextResponse } from "next/server";
// import { headers } from "next/headers";
// import { auth } from "@/lib/auth";
// export async function proxy(request: NextRequest) {
//     const session = await auth.api.getSession({
//         headers: await headers()
//     })
//     // THIS IS NOT SECURE!
//     // This is the recommended approach to optimistically redirect users
//     // We recommend handling auth checks in each page/route
//     if(!session) {
//         return NextResponse.redirect(new URL("/sign-in", request.url));
//     }
//     return NextResponse.next();
// }
// export const config = {
//   matcher: ["/dashboard"], // Specify the routes the middleware applies to
// };
