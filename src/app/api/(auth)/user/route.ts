import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/app/lib/commonError';
import { successResponse, withApiHandler } from '@/app/lib/commonHandlers';
import User from '@/app/models/user';
import dbConnect from '@/app/lib/dbConnect';
import { generateToken, verifyToken } from '@/app/utils/jwt';
import { expiryTime } from '../../../../../utils/constants';

export const GET = withApiHandler(async (request: NextRequest): Promise<NextResponse> => {
  await dbConnect();

  const tokenUser = await verifyToken(request);

  if (!tokenUser?.userId) {
    throw new ApiError('Unauthorized request', 401);
  }
  const [foundUser] = await Promise.all([
    User.findById(tokenUser.userId)
      .select('-password')
      .populate({ path: 'profile', model: 'profiles' })
  ]);

  if (!foundUser) {
    throw new ApiError('User not found', 404);
  }

  const userWithRole = {
    ...foundUser.toObject(),
    role: tokenUser.role,
  };

  const response = successResponse(userWithRole, 'User details fetched successfully', 200);
  if (tokenUser) {
    if ((tokenUser.subscriptionCompleted !== foundUser.subscriptionCompleted) || (tokenUser.profileCompleted !== foundUser.profileCompleted)) {
      const token = generateToken({
        userId: foundUser._id,
        email: foundUser.email,
        role: tokenUser.role ?? "User",
        subscriptionCompleted: foundUser.subscriptionCompleted,
        profileCompleted: foundUser.profileCompleted
      });
      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: expiryTime,
      });
    }
  }

  return response;
});
