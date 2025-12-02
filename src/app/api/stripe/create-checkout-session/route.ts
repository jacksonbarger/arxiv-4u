import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createCheckoutSession, getOrCreateStripeCustomer } from '@/lib/stripe';
import { TIER_TO_PRICE } from '@/lib/stripe/config';
import { getUserByEmail } from '@/lib/db';

// GET handler for redirect-based checkout (from pricing page)
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
      return NextResponse.redirect(new URL('/login?callbackUrl=/pricing', baseUrl));
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const tier = searchParams.get('tier');
    const billing = searchParams.get('billing') || 'monthly';
    // Note: promoCode from query param is not used - Stripe handles promo codes in checkout

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

    // Handle free tier or missing tier
    if (!tier || tier === 'free') {
      return NextResponse.redirect(new URL('/', baseUrl));
    }

    // Handle enterprise tier (contact sales)
    if (tier === 'enterprise') {
      return NextResponse.redirect(new URL('/pricing?contact=enterprise', baseUrl));
    }

    // Map tier and billing cycle to price ID
    const priceId = TIER_TO_PRICE[tier]?.[billing];
    if (!priceId) {
      return NextResponse.redirect(new URL('/pricing?error=invalid_tier', baseUrl));
    }

    // Get user from database
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.redirect(new URL('/pricing?error=user_not_found', baseUrl));
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(user);

    // Create checkout session
    // Note: promoCode is handled via Stripe's allow_promotion_codes setting
    const checkoutSession = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      priceId,
      customerId,
      successUrl: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing?checkout=canceled`,
    });

    // Redirect to Stripe Checkout
    if (checkoutSession.url) {
      return NextResponse.redirect(checkoutSession.url);
    }

    return NextResponse.redirect(new URL('/pricing?error=checkout_failed', baseUrl));
  } catch (error) {
    console.error('Error creating checkout session (GET):', error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    return NextResponse.redirect(new URL('/pricing?error=checkout_error', baseUrl));
  }
}

// POST handler for API-based checkout (programmatic)
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await req.json();
    const { priceId, tier, billing } = body;

    // Support both direct priceId and tier+billing combination
    let resolvedPriceId = priceId;
    if (!resolvedPriceId && tier && billing) {
      resolvedPriceId = TIER_TO_PRICE[tier]?.[billing];
    }

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: 'Missing priceId or tier/billing combination' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(user);

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const checkoutSession = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      priceId: resolvedPriceId,
      customerId,
      successUrl: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing?checkout=canceled`,
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session (POST):', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
