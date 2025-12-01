'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!key) {
      console.warn('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(key);
  }

  return stripePromise;
}

// ========================================
// SUBSCRIPTION CHECKOUT
// ========================================

export async function redirectToCheckout(tier: 'basic' | 'premium') {
  try {
    // Get price ID based on tier
    const priceId = tier === 'basic'
      ? process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID;

    if (!priceId) {
      throw new Error(`Missing price ID for tier: ${tier}`);
    }

    // Create checkout session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, tier }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();

    // Redirect to Stripe Checkout
    if (url) {
      window.location.href = url;
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}

// ========================================
// ONE-TIME PAYMENT (Business Plan)
// ========================================

export async function createBusinessPlanPayment(paperId: string): Promise<string> {
  try {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paperId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment intent');
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Error creating business plan payment:', error);
    throw error;
  }
}

// ========================================
// CUSTOMER PORTAL
// ========================================

export async function redirectToCustomerPortal() {
  try {
    const response = await fetch('/api/stripe/customer-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create portal session');
    }

    const { url } = await response.json();

    // Redirect to Stripe Customer Portal
    if (url) {
      window.location.href = url;
    }
  } catch (error) {
    console.error('Error redirecting to customer portal:', error);
    throw error;
  }
}

// ========================================
// SUBSCRIPTION HELPERS
// ========================================

export interface SubscriptionTier {
  id: 'free' | 'basic' | 'premium';
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  trial: boolean;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    trial: false,
    features: [
      'Browse papers',
      'Basic filtering',
      '10 bookmarks',
      '3 free business plans',
      'Email notifications',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    trial: true,
    features: [
      'Everything in Free',
      'Unlimited bookmarks',
      'Marketing insights',
      'Commercial scores',
      'Detailed summaries',
      '$0.99 per business plan',
      '7-day free trial',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 24.99,
    interval: 'month',
    trial: true,
    popular: true,
    features: [
      'Everything in Basic',
      'Unlimited business plans',
      'Market analysis',
      'Revenue projections',
      'Competitor analysis',
      'PDF export',
      'Priority support',
      '7-day free trial',
    ],
  },
];

export function getSubscriptionTier(tierId: string): SubscriptionTier | undefined {
  return SUBSCRIPTION_TIERS.find((tier) => tier.id === tierId);
}

export function canAccessFeature(
  userTier: 'free' | 'basic' | 'premium',
  requiredTier: 'free' | 'basic' | 'premium'
): boolean {
  const tierHierarchy = { free: 0, basic: 1, premium: 2 };
  return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
}
