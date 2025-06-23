import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/models/user';
import Terms from '@/app/models/terms';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const terms = await Terms.findOne({});
    if (!terms) {
      return NextResponse.json({ error: 'Terms not found' }, { status: 404 });
    }

    const userAcceptedAt = user.termsAcceptedAt;
    const termsUpdatedAt = terms.updatedAt;

    const hasUserAcceptedLatestTerms =
      userAcceptedAt && new Date(userAcceptedAt) >= new Date(termsUpdatedAt);

    return NextResponse.json({
      accepted: !!hasUserAcceptedLatestTerms,
      termsUpdatedAt,
      termsAcceptedAt: userAcceptedAt,
      content: !hasUserAcceptedLatestTerms ? terms.content : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
