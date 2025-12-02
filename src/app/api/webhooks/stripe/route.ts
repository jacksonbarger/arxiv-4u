import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { constructWebhookEvent, PRICE_TO_TIER } from '@/lib/stripe';
import {
  getUserById,
  updateUserSubscription,
  createSubscription,
  updateSubscriptionStatus,
  cancelSubscription,
  createOneTimePurchase,
  updateOneTimePurchaseStatus,
  createNotification,
} from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  try {
    // Construct and verify webhook event
    const event = await constructWebhookEvent(body, signature);

    console.log(`[Webhook] Processing event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

// ========================================
// WEBHOOK HANDLERS
// ========================================

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    console.error('[Webhook] No userId in checkout session metadata');
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    console.error(`[Webhook] User not found: ${userId}`);
    return;
  }

  console.log(`[Webhook] Checkout completed for user: ${user.email}`);

  // Update user's Stripe customer ID
  if (session.customer && typeof session.customer === 'string') {
    await updateUserSubscription(userId, {
      subscriptionTier: user.subscription_tier,
      subscriptionStatus: user.subscription_status,
      stripeCustomerId: session.customer,
    });
  }

  // Send notification
  await createNotification({
    userId,
    type: 'subscription_started',
    title: 'Welcome to Arxiv-4U!',
    message: `Your ${session.subscription ? 'subscription' : 'purchase'} is now active. Enjoy your benefits!`,
  });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  if (!userId) {
    console.error('[Webhook] No userId in subscription metadata');
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    console.error(`[Webhook] User not found: ${userId}`);
    return;
  }

  // Determine tier from price ID
  const priceId = subscription.items.data[0]?.price.id;
  const tier = PRICE_TO_TIER[priceId] || 'basic';

  console.log(`[Webhook] Creating ${tier} subscription for user: ${user.email}`);

  // Create subscription record
  await createSubscription({
    userId,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: customerId,
    stripePriceId: priceId,
    status: subscription.status,
    tier,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trialStart: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000) : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trialEnd: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000) : undefined,
  });

  // Update user subscription status
  await updateUserSubscription(userId, {
    subscriptionTier: tier,
    subscriptionStatus: subscription.status === 'trialing' ? 'trialing' : 'active',
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscriptionPeriodEnd: new Date((subscription as any).current_period_end * 1000),
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('[Webhook] No userId in subscription metadata');
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    console.error(`[Webhook] User not found: ${userId}`);
    return;
  }

  // Determine tier from price ID
  const priceId = subscription.items.data[0]?.price.id;
  const tier = PRICE_TO_TIER[priceId] || 'basic';

  console.log(`[Webhook] Updating subscription for user: ${user.email}, status: ${subscription.status}`);

  // Update subscription record
  await updateSubscriptionStatus(
    subscription.id,
    subscription.status,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Date((subscription as any).current_period_end * 1000)
  );

  // Update user subscription status
  const subscriptionStatus =
    subscription.status === 'active' ? 'active' :
    subscription.status === 'trialing' ? 'trialing' :
    subscription.status === 'past_due' ? 'past_due' :
    subscription.cancel_at_period_end ? 'canceled' : 'active';

  await updateUserSubscription(userId, {
    subscriptionTier: tier,
    subscriptionStatus,
    stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id,
    stripeSubscriptionId: subscription.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscriptionPeriodEnd: new Date((subscription as any).current_period_end * 1000),
  });

  // Notify user if subscription was canceled
  if (subscription.cancel_at_period_end) {
    await createNotification({
      userId,
      type: 'subscription_canceled',
      title: 'Subscription Canceled',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: `Your subscription will remain active until ${new Date((subscription as any).current_period_end * 1000).toLocaleDateString()}.`,
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('[Webhook] No userId in subscription metadata');
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    console.error(`[Webhook] User not found: ${userId}`);
    return;
  }

  console.log(`[Webhook] Deleting subscription for user: ${user.email}`);

  // Update subscription record
  await cancelSubscription(subscription.id);

  // Downgrade user to free tier
  await updateUserSubscription(userId, {
    subscriptionTier: 'free',
    subscriptionStatus: 'expired',
    stripeCustomerId: user.stripe_customer_id || '',
    stripeSubscriptionId: undefined,
  });

  // Notify user
  await createNotification({
    userId,
    type: 'subscription_ended',
    title: 'Subscription Ended',
    message: 'Your subscription has ended. Upgrade anytime to regain access to premium features.',
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id;

  if (!customerId) {
    console.error('[Webhook] No customer in invoice');
    return;
  }

  console.log(`[Webhook] Payment succeeded for customer: ${customerId}`);

  // For subscription renewals, the subscription.updated event will handle this
  // Just log it here for now
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id;

  if (!customerId) {
    console.error('[Webhook] No customer in invoice');
    return;
  }

  console.log(`[Webhook] Payment failed for customer: ${customerId}`);

  // Find user by customer ID and notify them
  // Note: We'd need to add a query function for this
  // For now, the subscription.updated event will set status to 'past_due'
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { userId, paperId, product } = paymentIntent.metadata;

  if (!userId || !paperId || product !== 'business_plan') {
    console.log('[Webhook] Payment intent not for business plan, skipping');
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    console.error(`[Webhook] User not found: ${userId}`);
    return;
  }

  console.log(`[Webhook] Business plan payment succeeded for user: ${user.email}, paper: ${paperId}`);

  // Record one-time purchase
  await createOneTimePurchase({
    userId,
    paperId,
    stripePaymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: 'succeeded',
  });

  // Send notification
  await createNotification({
    userId,
    type: 'business_plan_purchased',
    title: 'Business Plan Ready!',
    message: 'Your business plan purchase was successful. Generate your plan now!',
    paperId,
  });
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { userId, paperId, product } = paymentIntent.metadata;

  if (!userId || !paperId || product !== 'business_plan') {
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    console.error(`[Webhook] User not found: ${userId}`);
    return;
  }

  console.log(`[Webhook] Business plan payment failed for user: ${user.email}, paper: ${paperId}`);

  // Record failed purchase
  await createOneTimePurchase({
    userId,
    paperId,
    stripePaymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: 'failed',
  });

  // Send notification
  await createNotification({
    userId,
    type: 'payment_failed',
    title: 'Payment Failed',
    message: 'Your payment could not be processed. Please try again or use a different payment method.',
    paperId,
  });
}
