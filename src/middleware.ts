import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/terms",
  "/privacy",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/verify-email",
  "/forgot-password",  
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isAdmin = request.cookies.get("role")?.value === "Main";
  const email = request.cookies.get("email")?.value;
  const isVerified = request.cookies.get("isVerified")?.value === "true";
  if (pathname.startsWith("/verify-email") && !isVerified) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (
    ["/verify-otp", "/reset-password"].some((path) => pathname.startsWith(path))
  ) {
    if (!email) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (PUBLIC_PATHS.some((path) => pathname.includes(path))) {
    if (token && !pathname.startsWith("/api")) {
      try {
        const redirectPath = isAdmin ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(redirectPath, request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginPath = pathname.startsWith("/admin") ? "/admin/login" : "/login";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  if (
    isAdmin &&
    !pathname.includes("/admin") &&
    ["/api/plans", "/api/logout","/api/verify-otp","/api/reset-password","/api/forgot-password","/api/verify-email"].every((path) => !pathname.includes(path))
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  } else if (!isAdmin && pathname.includes("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/:path"],
};
