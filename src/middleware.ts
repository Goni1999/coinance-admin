import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("🛠️ Middleware Triggered! Path:", request.nextUrl.pathname);

  // Get authentication token (from cookies or headers)
  const authToken = request.cookies.get("auth-token")?.value;

  console.log("🔍 Auth Token:", authToken ? "Exists ✅" : "Not Found ❌");

  // Redirect if no token and trying to access protected routes
  if (!authToken && request.nextUrl.pathname !== "/signin") {
    console.log("🚨 Not Authenticated! Redirecting to /signin");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
