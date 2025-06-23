import { NextRequest, NextResponse } from 'next/server';
const PUBLIC_PATHS = ['/login', '/signup','/api/login','/api/signup'];


export function middleware(request: NextRequest) {
  
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    if (token && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }  

  if (!token) {

    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
    matcher: [
      '/api/:path*',
      '/:path',
    ],
  };
  
