import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db';
import {
  getCustomerSubscriptions,
  getPaymentMethods,
  getInvoices,
  getUpcomingInvoice,
  PRICE_TO_TIER,
  TIER_LIMITS,
} from '@/lib/stripe';

export interface BillingData {
  // Subscription info
  subscription: {
    tier: 'free' | 'standard' | 'pro' | 'enterprise';
    status: string | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    trialEnd: string | null;
    priceId: string | null;
    interval: 'month' | 'year' | null;
    amount: number | null; // in cents
  } | null;

  // Usage stats
  usage: {
    analysesUsed: number;
    analysesLimit: number;
    businessPlansGenerated: number;
    freeBusinessPlansRemaining: number;
  };

  // Payment method
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;

  // Invoices
  invoices: Array<{
    id: string;
    number: string | null;
    status: string | null;
    amount: number;
    currency: string;
    created: string;
    hostedInvoiceUrl: string | null;
    pdfUrl: string | null;
  }>;

  // Upcoming invoice
  upcomingInvoice: {
    amount: number;
    currency: string;
    dueDate: string | null;
  } | null;

  // Has Stripe customer
  hasStripeCustomer: boolean;
}

export async function GET() {
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

    // Default billing data for free users
    const tier = user.subscription_tier || 'free';
    const tierLimits = TIER_LIMITS[tier];

    const defaultBillingData: BillingData = {
      subscription: {
        tier,
        status: user.subscription_status || null,
        currentPeriodStart: null,
        currentPeriodEnd: user.subscription_period_end || null,
        cancelAtPeriodEnd: false,
        trialEnd: user.trial_ends_at || null,
        priceId: null,
        interval: null,
        amount: null,
      },
      usage: {
        analysesUsed: 0, // TODO: Track this in DB
        analysesLimit: tierLimits.analysesPerMonth,
        businessPlansGenerated: user.business_plans_generated || 0,
        freeBusinessPlansRemaining: user.free_business_plans_remaining ?? 3,
      },
      paymentMethod: null,
      invoices: [],
      upcomingInvoice: null,
      hasStripeCustomer: !!user.stripe_customer_id,
    };

    // If no Stripe customer, return basic info
    if (!user.stripe_customer_id) {
      return NextResponse.json(defaultBillingData);
    }

    // Fetch data from Stripe
    const [subscriptions, paymentMethods, invoices, upcomingInvoice] =
      await Promise.all([
        getCustomerSubscriptions(user.stripe_customer_id),
        getPaymentMethods(user.stripe_customer_id),
        getInvoices(user.stripe_customer_id, 5),
        getUpcomingInvoice(user.stripe_customer_id),
      ]);

    // Get active or trialing subscription
    const activeSubscription = subscriptions.find(
      (sub) => sub.status === 'active' || sub.status === 'trialing'
    );

    // Build subscription info
    let subscriptionData: BillingData['subscription'] = null;

    if (activeSubscription) {
      const subscriptionItem = activeSubscription.items.data[0];
      const priceId = subscriptionItem?.price.id;
      const subscriptionTier = priceId ? PRICE_TO_TIER[priceId] : tier;
      const price = subscriptionItem?.price;

      subscriptionData = {
        tier: subscriptionTier || tier,
        status: activeSubscription.status,
        currentPeriodStart: subscriptionItem?.current_period_start
          ? new Date(subscriptionItem.current_period_start * 1000).toISOString()
          : null,
        currentPeriodEnd: subscriptionItem?.current_period_end
          ? new Date(subscriptionItem.current_period_end * 1000).toISOString()
          : null,
        cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
        trialEnd: activeSubscription.trial_end
          ? new Date(activeSubscription.trial_end * 1000).toISOString()
          : null,
        priceId: priceId || null,
        interval: (price?.recurring?.interval as 'month' | 'year') || null,
        amount: price?.unit_amount || null,
      };
    } else {
      subscriptionData = defaultBillingData.subscription;
    }

    // Build payment method info
    let paymentMethodData: BillingData['paymentMethod'] = null;
    if (paymentMethods.length > 0) {
      const defaultMethod = paymentMethods[0];
      if (defaultMethod.card) {
        paymentMethodData = {
          brand: defaultMethod.card.brand,
          last4: defaultMethod.card.last4,
          expMonth: defaultMethod.card.exp_month,
          expYear: defaultMethod.card.exp_year,
        };
      }
    }

    // Build invoices list
    const invoiceData = invoices.map((inv) => ({
      id: inv.id,
      number: inv.number,
      status: inv.status,
      amount: inv.amount_paid || inv.total,
      currency: inv.currency,
      created: new Date(inv.created * 1000).toISOString(),
      hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
      pdfUrl: inv.invoice_pdf ?? null,
    }));

    // Build upcoming invoice
    let upcomingInvoiceData: BillingData['upcomingInvoice'] = null;
    if (upcomingInvoice) {
      upcomingInvoiceData = {
        amount: upcomingInvoice.total,
        currency: upcomingInvoice.currency,
        dueDate: upcomingInvoice.due_date
          ? new Date(upcomingInvoice.due_date * 1000).toISOString()
          : subscriptionData?.currentPeriodEnd || null,
      };
    }

    // Calculate usage limits based on tier
    const subscriptionTierLimits =
      TIER_LIMITS[subscriptionData?.tier || 'free'];

    const billingData: BillingData = {
      subscription: subscriptionData,
      usage: {
        analysesUsed: 0, // TODO: Track this in DB
        analysesLimit: subscriptionTierLimits.analysesPerMonth,
        businessPlansGenerated: user.business_plans_generated || 0,
        freeBusinessPlansRemaining: user.free_business_plans_remaining ?? 3,
      },
      paymentMethod: paymentMethodData,
      invoices: invoiceData,
      upcomingInvoice: upcomingInvoiceData,
      hasStripeCustomer: true,
    };

    return NextResponse.json(billingData);
  } catch (error) {
    console.error('Error fetching billing data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing data' },
      { status: 500 }
    );
  }
}
