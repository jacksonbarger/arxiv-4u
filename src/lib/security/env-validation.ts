import { z } from 'zod';

/**
 * Environment Variable Validation
 *
 * Validates required environment variables at startup.
 * Fail fast principle - better to fail immediately with a clear error
 * than to fail later with a cryptic message.
 */

// Server-side environment variables (not exposed to client)
const serverEnvSchema = z.object({
  // Database
  POSTGRES_URL: z.string().min(1, 'POSTGRES_URL is required'),

  // Vercel KV (Redis)
  KV_URL: z.string().optional(),
  KV_REST_API_URL: z.string().optional(),
  KV_REST_API_TOKEN: z.string().optional(),
  KV_REST_API_READ_ONLY_TOKEN: z.string().optional(),

  // Authentication
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  NEXTAUTH_URL: z.string().url().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'Invalid Stripe secret key'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_', 'Invalid Stripe webhook secret'),

  // AI Provider (PredictionGuard)
  PREDICTIONGUARD_API_KEY: z.string().min(1, 'PREDICTIONGUARD_API_KEY is required'),
  PREDICTIONGUARD_URL: z.string().url().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Client-side environment variables (exposed to browser)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_', 'Invalid Stripe publishable key'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

// Combined schema for validation
const envSchema = serverEnvSchema.merge(clientEnvSchema);

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type Env = z.infer<typeof envSchema>;

/**
 * Validates server environment variables
 * Call this in server-side code to ensure all required vars are present
 */
export function validateServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues.map((e) => `  - ${e.path.join('.')}: ${e.message}`).join('\n');
    console.error('❌ Invalid server environment variables:\n' + errors);

    // In production, fail fast
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment configuration. Check server logs.');
    }

    // In development, warn but continue (allows partial setup)
    console.warn('⚠️  Running with invalid environment - some features may not work');
    return process.env as unknown as ServerEnv;
  }

  return result.data;
}

/**
 * Validates client environment variables
 * Call this in client-side code
 */
export function validateClientEnv(): ClientEnv {
  const clientEnvVars = {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };

  const result = clientEnvSchema.safeParse(clientEnvVars);

  if (!result.success) {
    const errors = result.error.issues.map((e) => `  - ${e.path.join('.')}: ${e.message}`).join('\n');
    console.error('❌ Invalid client environment variables:\n' + errors);
    throw new Error('Invalid client environment configuration');
  }

  return result.data;
}

/**
 * Get a single required environment variable
 * Throws if not set
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get an optional environment variable with a default
 */
export function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Check if a feature is enabled based on environment variables
 */
export function isFeatureEnabled(featureKey: string): boolean {
  const value = process.env[featureKey];
  return value === 'true' || value === '1';
}

/**
 * Environment summary for debugging (redacted)
 */
export function getEnvSummary(): Record<string, string> {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE: process.env.POSTGRES_URL ? '✓ Configured' : '✗ Missing',
    REDIS: process.env.KV_URL ? '✓ Configured' : '✗ Missing',
    AUTH: process.env.NEXTAUTH_SECRET ? '✓ Configured' : '✗ Missing',
    STRIPE: process.env.STRIPE_SECRET_KEY ? '✓ Configured' : '✗ Missing',
    AI: process.env.PREDICTIONGUARD_API_KEY ? '✓ Configured' : '✗ Missing',
    EMAIL: process.env.RESEND_API_KEY ? '✓ Configured' : '✗ Missing',
  };
}
