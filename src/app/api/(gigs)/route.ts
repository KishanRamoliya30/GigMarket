import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Gig from '@/app/models/gig';
import { ApiError } from '@/app/lib/commonError';
import { successResponse } from '@/app/lib/commonHandlers';

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();

  const {
    title,
    description,
    tier,
    price,
    keywords,
    provider,
  } = body;

  if (!title || !description || !price || !provider?.userId || !provider?.name) {
    throw new ApiError('Missing required fields', 400);
  }

  const gig = await Gig.create({
    title,
    description,
    tier,
    price,
    keywords,
    provider,
  });

  return successResponse(gig, 'Gig created successfully', 201);
}
