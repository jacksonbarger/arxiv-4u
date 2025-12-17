/**
 * Security Headers Configuration
 * Following OWASP recommendations
 */

export const SECURITY_HEADERS = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS filter (legacy browsers)
  'X-XSS-Protection': '1; mode=block',

  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy (formerly Feature-Policy)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',

  // Strict Transport Security (HTTPS only)
  // Note: Only enable in production with HTTPS
  // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

/**
 * Content Security Policy
 * Restricts sources for scripts, styles, images, etc.
 */
export function getCSPHeader(nonce?: string): string {
  const directives = [
    // Default: only allow same-origin
    "default-src 'self'",

    // Scripts: self, inline with nonce, Stripe
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network ${nonce ? `'nonce-${nonce}'` : ''}`,

    // Styles: self, inline (needed for Tailwind/styled-components)
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

    // Images: self, data URIs, arxiv, blob
    "img-src 'self' data: blob: https://arxiv.org https://*.stripe.com",

    // Fonts: self, Google Fonts
    "font-src 'self' https://fonts.gstatic.com",

    // Connect: API calls
    "connect-src 'self' https://api.stripe.com https://m.stripe.network https://export.arxiv.org wss://*.vercel.app",

    // Frames: Stripe checkout
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",

    // Form actions
    "form-action 'self'",

    // Base URI
    "base-uri 'self'",

    // Object sources (Flash, etc.)
    "object-src 'none'",

    // Upgrade insecure requests in production
    // 'upgrade-insecure-requests',
  ];

  return directives.join('; ');
}

/**
 * Get all security headers including CSP
 */
export function getSecurityHeaders(nonce?: string): Record<string, string> {
  return {
    ...SECURITY_HEADERS,
    'Content-Security-Policy': getCSPHeader(nonce),
  };
}

/**
 * CORS configuration for API routes
 */
export const CORS_CONFIG = {
  // Allowed origins (add your domains)
  allowedOrigins: [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://arxiv-4u.vercel.app',
    // Add production domain
  ],

  // Allowed methods
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
  ],

  // Expose rate limit headers to client
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],

  // Allow credentials (cookies)
  credentials: true,

  // Preflight cache duration (24 hours)
  maxAge: 86400,
};

/**
 * Get CORS headers for a request
 */
export function getCORSHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': CORS_CONFIG.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': CORS_CONFIG.allowedHeaders.join(', '),
    'Access-Control-Expose-Headers': CORS_CONFIG.exposedHeaders.join(', '),
    'Access-Control-Max-Age': CORS_CONFIG.maxAge.toString(),
  };

  // Check if origin is allowed
  if (origin && CORS_CONFIG.allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return headers;
}
