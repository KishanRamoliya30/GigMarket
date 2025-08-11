import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { LoginUser } from "./app/utils/interfaces";

// JWT Secret
const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

// Public Routes
const STARTS_WITH_PUBLIC_PATHS = new Set([
  "/verify-email",
  "/gigs",
  "/api/webhooks/stripe",
  "/api/webhooks/stripeConnect",
  "/api/forgot-password",
  "/api/reset-password",
  "/api/login",
  "/api/signup",
  "/api/verify-email",
  "/api/verify-otp",
  "/api/terms",
  "/api/gigs/list",
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
  "/admin/verify-otp",
  "/api/profile/userProfile",
  "/api/profile/allProfile",
  "/api/admin/login",
  "/publicGigs",
  "/publicGigs/provider/",
  "/publicProfile/",
]);

const EXACT_PUBLIC_PATHS = new Set([
  "/",
  "/dashboard",
  "/login",
  "/signup",
  "/terms",
  "/privacy",
  "/myProfile",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/providers",
]);

const COMMON_PATHS = ["/dashboard", "/gigs", "/api/gigs", "/"];

// Utility: Check if path is public
const isPublicRoute = (pathname: string) => {
  if (EXACT_PUBLIC_PATHS.has(pathname)) return true;

  for (const route of STARTS_WITH_PUBLIC_PATHS) {
    if (pathname.startsWith(route)) {
      if (pathname === "/gigs/create") return false;
      return true;
    }
  }

  // Special case: /api/gigs/[id]
  if (pathname.startsWith("/api/gigs")) {
    const segments = pathname.split("/").filter(Boolean);
    return segments.length === 3;
  }

  return false;
};

// Utility: Decode and validate JWT
const decodeUserFromToken = async (token: string): Promise<LoginUser | null> => {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      _id: payload.userId as string,
      email: payload.email as string,
      isAdmin: payload.role === "Admin",
      role: payload.role?.toString() ?? "",
      subscriptionCompleted: payload.subscriptionCompleted as boolean,
      profileCompleted: payload.profileCompleted as boolean,
    };
  } catch {
    return null;
  }
};

// Main Middleware Function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    /\.(\w+)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const email = request.cookies.get("email")?.value;
  const isVerified = request.cookies.get("isVerified")?.value === "true";
  const isApi = pathname.startsWith("/api");
  const isPublicPath = isPublicRoute(pathname);

  const userData = token ? await decodeUserFromToken(token) : null;

  // ----- API Routes -----
  if (isApi) {
    if (userData?._id) {
      const response = NextResponse.next();
      response.headers.set("x-user", JSON.stringify(userData));
      return response;
    }

    if (!isPublicPath) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  // ----- Public-Only Conditions -----
  if (pathname.startsWith("/verify-email") && !isVerified) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    ["/verify-otp", "/reset-password"].some((path) =>
      pathname.startsWith(path)
    ) && !email
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ----- Authenticated Users -----
  if (userData?._id) {
    const { isAdmin, role, subscriptionCompleted, profileCompleted } = userData;

    // Subscription flow
    if (
      !isAdmin &&
      !subscriptionCompleted &&
      !pathname.startsWith("/subscription") &&
      !pathname.startsWith("/subscriptionSuccess")
    ) {
      return NextResponse.redirect(new URL("/subscription", request.url));
    }

    // Profile flow
    if (
      !isAdmin &&
      subscriptionCompleted &&
      !profileCompleted &&
      !pathname.startsWith("/add-profile") &&
      !pathname.startsWith("/subscription")
    ) {
      return NextResponse.redirect(new URL("/add-profile", request.url));
    }

    // Admin restrictions
    if (isAdmin && !pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (!isAdmin && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Role-based access
    if (pathname.startsWith("/user") && role !== "User") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/provider") && role !== "Provider") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Public page while logged in
    if (isPublicPath && !COMMON_PATHS.some((p) => pathname.startsWith(p))) {
      const redirectTo = isAdmin ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  } else {
    // ----- Unauthenticated Users -----
    if (!isPublicPath) {
      const loginRoute = pathname.startsWith("/admin") ? "/admin/login" : "/login";
      return NextResponse.redirect(new URL(loginRoute, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/:path*"],
};
