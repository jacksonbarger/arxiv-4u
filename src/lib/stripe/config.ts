import Stripe from 'stripe';

// Initialize Stripe with API key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Price IDs from environment variables
export const STRIPE_PRICES = {
  STANDARD_MONTHLY: process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID || 'price_standard_test',
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_test',
  PAY_PER_ARTICLE: process.env.STRIPE_PAY_PER_ARTICLE_PRICE_ID || 'price_article_test',
} as const;

// Subscription tier mapping (free tier has no Stripe price)
export const PRICE_TO_TIER: Record<string, 'free' | 'standard' | 'pro' | 'enterprise'> = {
  [STRIPE_PRICES.STANDARD_MONTHLY]: 'standard',
  [STRIPE_PRICES.PRO_MONTHLY]: 'pro',
};

// Price amounts in cents
export const PRICE_AMOUNTS = {
  FREE: 0, // Free tier
  STANDARD_MONTHLY: 499, // $4.99
  PRO_MONTHLY: 999, // $9.99
  PAY_PER_ARTICLE: 99, // $0.99
} as const;

// Tier features and limits
export const TIER_LIMITS = {
  free: {
    analysesPerMonth: 5,
    businessPlansIncluded: false,
    marketingInsights: false,
    weeklyDigest: true,
  },
  standard: {
    analysesPerMonth: 25,
    businessPlansIncluded: false,
    marketingInsights: true,
    weeklyDigest: true,
  },
  pro: {
    analysesPerMonth: -1, // Unlimited
    businessPlansIncluded: true,
    marketingInsights: true,
    weeklyDigest: true,
  },
  enterprise: {
    analysesPerMonth: -1, // Unlimited
    businessPlansIncluded: true,
    marketingInsights: true,
    weeklyDigest: true,
    customSupport: true,
    zentrexConsulting: true,
  },
} as const;

// Trial period in days
export const TRIAL_PERIOD_DAYS = 7;
