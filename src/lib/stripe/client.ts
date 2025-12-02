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

export async function redirectToCheckout(tier: 'standard' | 'pro', promoCode?: string) {
  try {
    // Get price ID based on tier
    const priceId = tier === 'standard'
      ? process.env.NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID;

    if (!priceId) {
      throw new Error(`Missing price ID for tier: ${tier}`);
    }

    // Create checkout session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, tier, promoCode }),
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
  id: 'free' | 'standard' | 'pro' | 'enterprise';
  name: string;
  price: number | 'contact';
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
      '5 AI analyses per month',
      'Basic paper discovery',
      'Bookmark papers',
      'Weekly digest email',
      '$0.99 per article analysis',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 4.99,
    interval: 'month',
    trial: false,
    features: [
      '25 AI analyses per month',
      'Marketing insights',
      'Advanced filters',
      'Weekly digest',
      '$0.99 per business plan',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    trial: true,
    popular: true,
    features: [
      'Unlimited AI analyses',
      'Unlimited business plans',
      'Marketing insights',
      'Priority support',
      'Early access to features',
      'Use promo: ARXIV4FREE',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'contact',
    interval: 'month',
    trial: false,
    features: [
      'Everything in Pro',
      'Personal consulting with Zentrex',
      'Custom business plan implementation',
      'Dedicated account manager',
      'Custom integrations',
      'Contact for pricing',
    ],
  },
];

export function getSubscriptionTier(tierId: string): SubscriptionTier | undefined {
  return SUBSCRIPTION_TIERS.find((tier) => tier.id === tierId);
}

export function canAccessFeature(
  userTier: 'free' | 'standard' | 'pro' | 'enterprise',
  requiredTier: 'free' | 'standard' | 'pro' | 'enterprise'
): boolean {
  const tierHierarchy = { free: 0, standard: 1, pro: 2, enterprise: 3 };
  return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
}
