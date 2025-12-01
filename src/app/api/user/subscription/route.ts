import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Get current user from session
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database to get subscription info
    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return subscription status
    return NextResponse.json({
      tier: user.subscription_tier || 'free',
      freeGenerationsRemaining: user.free_business_plans_remaining ?? 3,
      totalGenerated: user.business_plans_generated ?? 0,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
