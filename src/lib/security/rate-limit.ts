import { kv } from '@vercel/kv';

interface RateLimitConfig {
  interval: number; // Time window in seconds
  limit: number; // Max requests per interval
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when limit resets
}

// Rate limit configurations for different endpoints
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Auth endpoints - strict limits to prevent brute force
  'auth:login': { interval: 60, limit: 5 },
  'auth:signup': { interval: 60, limit: 3 },
  'auth:password-reset': { interval: 300, limit: 3 },

  // AI endpoints - expensive operations
  'ai:analyze': { interval: 60, limit: 10 },
  'ai:business-plan': { interval: 60, limit: 5 },

  // Payment endpoints
  'stripe:payment-intent': { interval: 60, limit: 10 },
  'stripe:checkout': { interval: 60, limit: 5 },

  // General API - more lenient
  'api:general': { interval: 60, limit: 100 },
  'api:papers': { interval: 60, limit: 60 },

  // Default fallback
  'default': { interval: 60, limit: 30 },
};

/**
 * Check rate limit for a given identifier and endpoint
 * Uses sliding window algorithm with Redis/KV
 */
export async function checkRateLimit(
  identifier: string, // IP address or user ID
  endpoint: string = 'default'
): Promise<RateLimitResult> {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS['default'];
  const key = `ratelimit:${endpoint}:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - config.interval;

  try {
    // Use Redis sorted set for sliding window
    // Remove old entries outside the window
    await kv.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    const requestCount = await kv.zcard(key);

    if (requestCount >= config.limit) {
      // Get the oldest request timestamp to calculate reset time
      const oldestRequests = await kv.zrange(key, 0, 0, { withScores: true }) as Array<{ member: string; score: number }>;
      const resetTime = oldestRequests.length > 0
        ? Math.ceil(Number(oldestRequests[0].score) + config.interval)
        : now + config.interval;

      return {
        success: false,
        limit: config.limit,
        remaining: 0,
        reset: resetTime,
      };
    }

    // Add current request with timestamp as score
    await kv.zadd(key, { score: now, member: `${now}:${Math.random()}` });

    // Set expiry on the key (cleanup)
    await kv.expire(key, config.interval + 10);

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - requestCount - 1,
      reset: now + config.interval,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open - allow request if rate limiting fails
    // In production, you might want to fail closed for security
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit,
      reset: now + config.interval,
    };
  }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
    'Retry-After': result.success ? '' : (result.reset - Math.floor(Date.now() / 1000)).toString(),
  };
}

/**
 * Simple in-memory rate limiter for development/fallback
 * Note: This doesn't work across multiple instances
 */
const memoryStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimitMemory(
  identifier: string,
  endpoint: string = 'default'
): RateLimitResult {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS['default'];
  const key = `${endpoint}:${identifier}`;
  const now = Math.floor(Date.now() / 1000);

  const entry = memoryStore.get(key);

  if (!entry || entry.resetTime <= now) {
    // New window
    memoryStore.set(key, { count: 1, resetTime: now + config.interval });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: now + config.interval,
    };
  }

  if (entry.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  entry.count++;
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    reset: entry.resetTime,
  };
}

// Cleanup old entries periodically (for memory store)
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);
  for (const [key, entry] of memoryStore.entries()) {
    if (entry.resetTime <= now) {
      memoryStore.delete(key);
    }
  }
}, 60000); // Clean up every minute
