import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createPaymentIntent, getOrCreateStripeCustomer, PRICE_AMOUNTS } from '@/lib/stripe';
import { getUserByEmail, hasAccessToBusinessPlan } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await req.json();
    const { paperId } = body;

    if (!paperId) {
      return NextResponse.json({ error: 'Missing paperId' }, { status: 400 });
    }

    // Get user from database
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has access to this business plan
    const hasAccess = await hasAccessToBusinessPlan(user.id, paperId);
    if (hasAccess) {
      return NextResponse.json(
        { error: 'You already have access to this business plan' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(user);

    // Create payment intent for $0.99
    const paymentIntent = await createPaymentIntent({
      userId: user.id,
      paperId,
      amount: PRICE_AMOUNTS.PAY_PER_ARTICLE,
      customerId,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
