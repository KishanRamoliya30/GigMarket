import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { LoginUser } from "./app/utils/interfaces";
const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

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

  "/api/forgot-password",
  "/api/reset-password",
  "/api/login",
  "/api/signup",
  "/api/verify-email",
  "/api/verify-otp",
  "/api/terms",

  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
  "/admin/verify-otp",

  "/api/admin/login",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  let userData: LoginUser = {
    _id: "",
    email: "",
    isAdmin: false,
    role: "",
    hasSubscription: false,
    hasProfile: false
  };


  if (token) {
    const { payload } = await jwtVerify(token, getSecret());
    userData = {
      _id: payload.userId as string,
      email: payload.email as string,
      isAdmin: payload.role == "Admin",
      role: payload.role?.toString() ?? "",
      hasSubscription: payload.subscriptionCompleted as boolean,
      hasProfile: payload.profileCompleted as boolean
    };
  }
  const email = request.cookies.get("email")?.value;
  const isVerified = request.cookies.get("isVerified")?.value === "true";
  const isPublicPath = PUBLIC_PATHS.some((route) => pathname.startsWith(route));

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
   if (
        userData.hasProfile &&
        pathname === "/add-profile"
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
   }

  if (pathname.startsWith("/api")) {
    if (!isPublicPath && userData._id != "") {
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
    if (!isPublicPath && userData._id != "") {
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
      const redirectPath = userData.isAdmin ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
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
  matcher: ["/api/:path*", "/admin/:path*", "/:path"],
};
