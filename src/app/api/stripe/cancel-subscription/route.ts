import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST() {
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

    if (!user.stripeCustomerId) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    // Get customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // Also check for trialing subscriptions
      const trialingSubscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'trialing',
        limit: 1,
      });

      if (trialingSubscriptions.data.length === 0) {
        return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
      }

      // Cancel trialing subscription immediately
      const subscription = trialingSubscriptions.data[0];
      await stripe.subscriptions.cancel(subscription.id);

      return NextResponse.json({
        success: true,
        message: 'Trial canceled successfully',
        canceledAt: new Date().toISOString(),
      });
    }

    // Cancel active subscription at period end
    const subscription = subscriptions.data[0];
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
