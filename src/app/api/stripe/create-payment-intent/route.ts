import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createPaymentIntent, getOrCreateStripeCustomer, PRICE_AMOUNTS } from '@/lib/stripe';
import { getUserByEmail, hasAccessToBusinessPlan } from '@/lib/db';
import {
  applyRateLimit,
  createPaymentIntentSchema,
  validateRequestBody,
  logPaymentEvent,
} from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting (10 requests per minute for payment endpoints)
    const session = await auth();
    const rateLimitResponse = await applyRateLimit(
      req,
      'stripe:payment-intent',
      session?.user?.id
    );
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Check authentication
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate request body
    const validation = await validateRequestBody(req.clone(), createPaymentIntentSchema);
    if (!validation.success) {
      return validation.response;
    }

    const { paperId } = validation.data;

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

    // Audit log payment intent creation
    await logPaymentEvent(
      req,
      'payment:intent_created',
      user.id,
      {
        paperId,
        paymentIntentId: paymentIntent.id,
        amount: PRICE_AMOUNTS.PAY_PER_ARTICLE,
        customerId,
      },
      true
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);

    // Audit log failed payment intent
    try {
      const session = await auth();
      if (session?.user?.id) {
        await logPaymentEvent(
          req,
          'payment:failed',
          session.user.id,
          { error: error instanceof Error ? error.message : 'Unknown error' },
          false,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    } catch {
      // Ignore audit log errors
    }

    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
