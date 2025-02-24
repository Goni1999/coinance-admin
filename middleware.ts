import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Example: Check if the user is authenticated using cookies or session
  const isAuthenticated = request.cookies.get("auth-token"); // Change this based on your auth setup

  // If not authenticated, redirect to the sign-in page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next(); // Continue to the requested page
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/dashboard/:path*"], // Protect all dashboard pages
};
