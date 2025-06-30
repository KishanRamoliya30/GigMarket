import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({message:"Logout successfull"})
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}
