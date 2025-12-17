import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSecurityHeaders, getCORSHeaders, CORS_CONFIG } from '@/lib/security/headers';

/**
 * Security Middleware
 *
 * Applies security headers, CORS, and rate limiting to all requests.
 * Rate limiting is handled separately in API routes due to Edge Runtime limitations.
 */

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/api/user',
  '/api/notifications',
  '/api/ai/business-plan',
];

// API routes that need CORS headers
const API_ROUTES = ['/api/'];

// Static assets that don't need security processing
const STATIC_ROUTES = ['/_next/', '/favicon.ico', '/images/', '/fonts/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets for performance
  if (STATIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get origin for CORS
  const origin = request.headers.get('origin');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const preflightHeaders = getCORSHeaders(origin);
    return new NextResponse(null, {
      status: 204,
      headers: preflightHeaders,
    });
  }

  // Create response
  const response = NextResponse.next();

  // Apply security headers to all responses
  const securityHeaders = getSecurityHeaders();
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Apply CORS headers for API routes
  if (API_ROUTES.some((route) => pathname.startsWith(route))) {
    const corsHeaders = getCORSHeaders(origin);
    for (const [key, value] of Object.entries(corsHeaders)) {
      if (value) {
        response.headers.set(key, value);
      }
    }
  }

  // Add request ID for tracing (correlation ID pattern)
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);

  // Add timing header for performance monitoring
  response.headers.set('X-Response-Time', Date.now().toString());

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
