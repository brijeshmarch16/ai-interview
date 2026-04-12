import { headers } from "next/dist/server/request/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default async function proxy(request: NextRequest) {
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("[proxy] Failed to retrieve session:", error);
  }

  const { pathname } = request.nextUrl;
  const publicRoutes = ["/sign-in", "/sign-up", "/"];
  const isAuthRoute = publicRoutes.some((route) => pathname === route);

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/interviews", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/interviews", "/interviews/:path*"],
};
