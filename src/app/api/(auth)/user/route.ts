import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/app/lib/commonError';
import { successResponse, withApiHandler } from '@/app/lib/commonHandlers';
import User from '@/app/models/user';
import dbConnect from '@/app/lib/dbConnect';
import { LoginUser } from '@/app/utils/interfaces';
import { jwtVerify } from 'jose';
import { generateToken } from '@/app/utils/jwt';
const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export const GET = withApiHandler(async (request: NextRequest): Promise<NextResponse> => {
  const userHeader = request.headers.get('x-user');
  console.log("#####61", userHeader)
  const user: LoginUser | null = userHeader ? JSON.parse(userHeader) : null;
  console.log("#####62", user)
  if (!user?._id) {
    throw new ApiError('Unauthorized request', 401);
  }

  await dbConnect();

  const [foundUser] = await Promise.all([
    User.findById(user._id)
      .select('-password')
      .populate({ path: 'profile', model: 'profiles' })
  ]);

  if (!foundUser) {
    throw new ApiError('User not found', 404);
  }

  const userWithRole = {
    ...foundUser.toObject(),
    role: user.role,
  };

  const response = successResponse(userWithRole, 'User details fetched successfully', 200);
  console.log("#####63", request.cookies.get("token")?.value)
  if (request.cookies.get("token")?.value) {
    const { payload } = await jwtVerify(
      request.cookies.get("token")?.value ?? "",
      getSecret()
    );
    console.log("#####64", payload)

    if ((payload.subscriptionCompleted !== user.subscriptionCompleted) || (payload.profileCompleted !== user.profileCompleted)) {
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
  }

  return response;
});
