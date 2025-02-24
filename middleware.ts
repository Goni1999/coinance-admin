import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware triggered! Path:", request.nextUrl.pathname);

  const authToken = request.cookies.get("auth-token")?.value; // Check if user has a token

  // If the user is NOT authenticated and visiting "/" (root), redirect to /signin
  if (!authToken && request.nextUrl.pathname === "/") {
    console.log("🚨 User not signed in! Redirecting to /signin");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If the user is NOT authenticated and visiting "/dashboard/*", redirect to /signin
  if (!authToken && request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("🚨 User not signed in! Redirecting to /signin");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  console.log("✅ User is authenticated, allowing access.");
  return NextResponse.next();
}

// Apply middleware to both "/" and "/dashboard/*"
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
