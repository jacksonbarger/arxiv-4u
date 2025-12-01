import Stripe from 'stripe';

// Initialize Stripe with API key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Price IDs from environment variables
export const STRIPE_PRICES = {
  BASIC_MONTHLY: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID || 'price_basic_test',
  PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_premium_test',
  ONE_TIME_BUSINESS_PLAN: process.env.STRIPE_ONE_TIME_BUSINESS_PLAN_PRICE_ID || 'price_plan_test',
} as const;

// Subscription tier mapping
export const PRICE_TO_TIER: Record<string, 'basic' | 'premium'> = {
  [STRIPE_PRICES.BASIC_MONTHLY]: 'basic',
  [STRIPE_PRICES.PREMIUM_MONTHLY]: 'premium',
};

// Price amounts in cents
export const PRICE_AMOUNTS = {
  BASIC_MONTHLY: 999, // $9.99
  PREMIUM_MONTHLY: 2499, // $24.99
  ONE_TIME_BUSINESS_PLAN: 99, // $0.99
} as const;

// Trial period in days
export const TRIAL_PERIOD_DAYS = 7;
