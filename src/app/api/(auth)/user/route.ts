import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/app/lib/commonError';
import { successResponse, withApiHandler } from '@/app/lib/commonHandlers';
import User from '@/app/models/user';
import dbConnect from '@/app/lib/dbConnect';

export interface XUser {
  userId: string;
  email?: string;
  name?: string;
}

export const GET = withApiHandler(async (request: NextRequest): Promise<NextResponse> => {
  const userHeader = request.headers.get('x-user');
  const user: XUser | null = userHeader ? JSON.parse(userHeader) : null;

  if (!user?.userId) {
    throw new ApiError('Unauthorized request', 401);
  }

  await dbConnect();

  const foundUser = await User.findById(user.userId).select('-password');

  if (!foundUser) {
    throw new ApiError('User not found', 404);
  }
  
  const response = successResponse(foundUser, 'User details fetched successfully', 200);

  return response;
});
