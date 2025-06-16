import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    //need to write middleware logic here
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/:path"],
};
