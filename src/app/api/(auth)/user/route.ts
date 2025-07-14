import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/app/lib/commonError';
import { successResponse, withApiHandler } from '@/app/lib/commonHandlers';
import User from '@/app/models/user';
import dbConnect from '@/app/lib/dbConnect';
import { LoginUser } from '@/app/utils/interfaces';

export const GET = withApiHandler(async (request: NextRequest): Promise<NextResponse> => {
  const userHeader = request.headers.get('x-user');
  const user: LoginUser | null = userHeader ? JSON.parse(userHeader) : null;

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

  return successResponse(userWithRole, 'User details fetched successfully', 200);
});
