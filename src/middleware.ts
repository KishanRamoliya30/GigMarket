import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/dashboard",
  "/login",
  "/signup",
  "/terms",
  "/privacy",
  "/admin/login",
  "/api/login",
  "/api/signup",
  "/api/admin/login",
  "/api/terms",
  "/forgot-password",
  "/api/forgot-password",
  "/reset-password",
  "/api/reset-password",
  "/verify-otp",
  "/api/verify-otp",
  "/verify-email",
  "/forgot-password",
  "/api/verify-email",
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
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
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

  if (isAdmin && !pathname.includes("/admin") && !pathname.includes("/plans")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  } else if (!isAdmin && pathname.includes("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/:path",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|mp4)).*)",
  ],
};
