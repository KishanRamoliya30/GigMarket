import { NextRequest } from 'next/server';
import { ApiError } from '@/app/lib/commonError';
import { successResponse } from '@/app/lib/commonHandlers';
import { stripe } from '@/app/lib/strip';
import { jwtVerify } from 'jose';
import User from '@/app/models/user';
import { generateToken } from '@/app/utils/jwt';

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);


export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const sessionId = (await params).sessionId
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const response = successResponse(session, 'Session fetched successfully', 200);
    const { payload } = await jwtVerify(
      request.cookies.get("token")?.value ?? "",
      getSecret()
    );

    const user = await User.findOne({ _id: payload.userId });
    if (payload.subscriptionCompleted !== user.subscriptionCompleted) {
      
      const token = generateToken({
        userId: user._id,
        email: user.email,
        role: payload.role,
        subscriptionCompleted: user.subscriptionCompleted,
        profileCompleted: user.profileCompleted
      });
      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    
    return response;
  } catch (error) {
    console.error('Failed to fetch session:', error);
    throw new ApiError('Session id is invalid', 500);
  }
}