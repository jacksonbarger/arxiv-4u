import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { analyzePaper } from '@/lib/ai/paper-analysis';
import { getUserByEmail } from '@/lib/db';
import { canAccessMarketingInsights } from '@/lib/usage';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user can access marketing insights
    if (!canAccessMarketingInsights(user)) {
      return NextResponse.json(
        {
          error: 'Upgrade required',
          message: 'Marketing insights are available for Basic and Premium subscribers',
          tier: user.subscription_tier,
        },
        { status: 403 }
      );
    }

    // Get request body
    const body = await req.json();
    const { paper } = body;

    if (!paper) {
      return NextResponse.json({ error: 'Missing paper data' }, { status: 400 });
    }

    // Analyze paper
    const analysis = await analyzePaper(paper);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing paper:', error);
    return NextResponse.json(
      { error: 'Failed to analyze paper' },
      { status: 500 }
    );
  }
}
