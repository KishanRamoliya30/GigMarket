import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { LoginUser } from "./app/utils/interfaces";
const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

const START_WITH_PUBLIC_PATHS = [
  "/verify-email",
  "/gigs",

  "/api/webhooks/stripe",
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
];

const FIX_PUBLIC_PATHS = [
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
  "/forgot-password",
  "/providers",
];

const COMMON_PATHS = ["/dashboard", "/gigs", "/api/gigs", "/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  let userData: LoginUser = {
    _id: "",
    email: "",
    isAdmin: false,
    role: "",
    subscriptionCompleted: false,
    profileCompleted: false,
  };

  if (token) {
    const { payload } = await jwtVerify(token, getSecret());
    userData = {
      _id: payload.userId as string,
      email: payload.email as string,
      isAdmin: payload.role == "Admin",
      role: payload.role?.toString() ?? "",
      subscriptionCompleted: payload.subscriptionCompleted as boolean,
      profileCompleted: payload.profileCompleted as boolean,
    };
  }
  const email = request.cookies.get("email")?.value;
  const isVerified = request.cookies.get("isVerified")?.value === "true";
  let isPublicPath =
    FIX_PUBLIC_PATHS.includes(pathname) ||
    (START_WITH_PUBLIC_PATHS.some((route) => pathname.startsWith(route)) &&
      pathname !== "/gigs/create");

  // if (pathname === "/") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  //allow gigs/[id] path
  if (pathname.startsWith("/api/gigs")) {
    const segments = pathname.split("/").filter(Boolean);
    isPublicPath = segments.length === 3;
  }
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

  if (pathname.startsWith("/api")) {
    if (token && !!userData._id) {
      try {
        const response = NextResponse.next();
        response.headers.set("x-user", JSON.stringify(userData));
        return response;
      } catch {
        return NextResponse.next();
      }
    }
    //protected apis will return 401
    else if (!isPublicPath && userData._id == "") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    if (!userData.isAdmin && !!userData._id) {
      const isSubscriptionPage = pathname === "/subscription";
      const isSubscriptionSuccessPage = pathname.startsWith(
        "/subscriptionSuccess"
      );
      const isProfilePage = pathname === "/add-profile";

      if (
        !userData.subscriptionCompleted &&
        !isSubscriptionPage &&
        !isSubscriptionSuccessPage
      ) {
        return NextResponse.redirect(new URL("/subscription", request.url));
      } else if (
        userData.subscriptionCompleted &&
        !userData.profileCompleted &&
        !isProfilePage &&
        !isSubscriptionPage &&
        !isSubscriptionSuccessPage
      ) {
        return NextResponse.redirect(new URL("/add-profile", request.url));
      }
    } else if (!isPublicPath && userData._id != "") {
      //REDIRECTS BASED ON SUBSCRIPTION / PROFILE FLOW

      //admin can only access pages with path admin
      if (userData.isAdmin && !pathname.includes("/admin")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      //normal user can't access admin paths
      else if (!userData.isAdmin && pathname.includes("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      //pages with path in user can only be accessed by user role
      else if (pathname.startsWith("/user") && userData.role != "User") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      //pages with path in provider can only be accessed by provider role
      else if (
        pathname.startsWith("/provider") &&
        userData.role != "Provider"
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    // if logged in and try to access public page redirect to respective dashboard
    else if (isPublicPath && userData._id != "") {
      if (!COMMON_PATHS.some((path) => pathname.startsWith(path))) {
        const redirectPath = userData.isAdmin ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }
    // if not public path redirect to login page
    else if (!isPublicPath && userData._id == "") {
      const loginPath = pathname.startsWith("/admin")
        ? "/admin/login"
        : "/login";
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/profile/:path*",
    "/api/:path*",
    "/admin/:path*",
    // "/((?!_next/static|_next/image|favicon.ico|images|uploads|.*\\.[a-zA-Z0-9]+$).*)",
    "/:path",
  ],
};
