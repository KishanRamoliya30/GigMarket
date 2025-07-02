import { NextRequest } from 'next/server';
import { ApiError } from '@/app/lib/commonError';
import { successResponse } from '@/app/lib/commonHandlers';
import { stripe } from '@/app/lib/strip';

type Params = { sessionId: string };

export async function GET(request: NextRequest, context: { params: Params }) {
  const { sessionId } = context.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return successResponse(session, 'Session fetched successfully', 200);
  } catch (error) {
    console.error('Failed to fetch session:', error);
    throw new ApiError('Session id is invalid', 500);
  }
}