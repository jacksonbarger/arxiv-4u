import { stripe, STRIPE_PRICES, TRIAL_PERIOD_DAYS } from './config';
import type { User } from '@/types/database';

export * from './config';

// ========================================
// CUSTOMER MANAGEMENT
// ========================================

export async function getOrCreateStripeCustomer(user: User): Promise<string> {
  // Return existing customer ID if available
  if (user.stripe_customer_id) {
    return user.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      userId: user.id,
      username: user.username,
    },
  });

  return customer.id;
}

export async function getStripeCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId);
}

// ========================================
// SUBSCRIPTION CHECKOUT
// ========================================

interface CreateCheckoutSessionParams {
  userId: string;
  userEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
}

export async function createCheckoutSession({
  userId,
  userEmail,
  priceId,
  successUrl,
  cancelUrl,
  customerId,
}: CreateCheckoutSessionParams) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_email: customerId ? undefined : userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      trial_period_days: TRIAL_PERIOD_DAYS,
      metadata: {
        userId,
      },
    },
    metadata: {
      userId,
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  });

  return session;
}

// ========================================
// ONE-TIME PAYMENT (Business Plan)
// ========================================

interface CreatePaymentIntentParams {
  userId: string;
  paperId: string;
  amount: number; // in cents
  customerId?: string;
}

export async function createPaymentIntent({
  userId,
  paperId,
  amount,
  customerId,
}: CreatePaymentIntentParams) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: customerId,
    metadata: {
      userId,
      paperId,
      product: 'business_plan',
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

// ========================================
// SUBSCRIPTION MANAGEMENT
// ========================================

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true) {
  if (cancelAtPeriodEnd) {
    // Cancel at end of billing period
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } else {
    // Cancel immediately
    return await stripe.subscriptions.cancel(subscriptionId);
  }
}

export async function resumeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'always_invoice',
  });
}

// ========================================
// CUSTOMER PORTAL
// ========================================

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// ========================================
// PAYMENT METHOD MANAGEMENT
// ========================================

export async function getPaymentMethods(customerId: string) {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  return paymentMethods.data;
}

export async function getDefaultPaymentMethod(customerId: string) {
  const customer = await stripe.customers.retrieve(customerId);

  if (customer.deleted) {
    return null;
  }

  const defaultPaymentMethodId = customer.invoice_settings.default_payment_method;

  if (!defaultPaymentMethodId || typeof defaultPaymentMethodId === 'string') {
    if (!defaultPaymentMethodId) return null;
    return await stripe.paymentMethods.retrieve(defaultPaymentMethodId);
  }

  return defaultPaymentMethodId;
}

// ========================================
// INVOICE MANAGEMENT
// ========================================

export async function getUpcomingInvoice(customerId: string) {
  try {
    return await stripe.invoices.retrieveUpcoming({
      customer: customerId,
    });
  } catch (error) {
    // No upcoming invoice
    return null;
  }
}

export async function getInvoices(customerId: string, limit = 10) {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  });

  return invoices.data;
}

// ========================================
// USAGE & LIMITS
// ========================================

export async function getCustomerSubscriptions(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    limit: 10,
  });

  return subscriptions.data;
}

// ========================================
// WEBHOOKS
// ========================================

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }
}
