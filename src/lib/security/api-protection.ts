import { NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { auth } from '@/lib/auth';
import { checkRateLimit, checkRateLimitMemory, getRateLimitHeaders } from './rate-limit';
import { getClientInfo, logRateLimitHit, logUnauthorized } from './audit-log';
import { z } from 'zod';

/**
 * API Route Protection Utilities
 *
 * Provides helpers for securing API routes with:
 * - Authentication checks
 * - Rate limiting
 * - Input validation
 * - Standardized error responses
 */

export interface ApiContext {
  userId?: string;
  email?: string;
  ip: string;
  requestId: string;
}

/**
 * Standard API error response
 */
export function apiError(
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse {
  const body: { error: string; details?: unknown } = { error: message };
  if (details !== undefined) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}

/**
 * Check if user is authenticated
 * Returns session or null
 */
export async function requireAuth(request: Request) {
  const session = await auth();

  if (!session?.user) {
    await logUnauthorized(request, new URL(request.url).pathname);
    return null;
  }

  return session;
}

/**
 * Apply rate limiting to an API route
 * Returns error response if rate limited, null otherwise
 */
export async function applyRateLimit(
  request: Request,
  endpoint: string,
  userId?: string
): Promise<NextResponse | null> {
  const { ip } = getClientInfo(request);
  const identifier = userId || ip;

  // Try Redis first, fall back to in-memory
  let result;
  try {
    result = await checkRateLimit(identifier, endpoint);
  } catch {
    // Fall back to in-memory rate limiting
    result = checkRateLimitMemory(identifier, endpoint);
  }

  if (!result.success) {
    await logRateLimitHit(request, endpoint, userId);

    const headers = getRateLimitHeaders(result);
    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: result.reset - Math.floor(Date.now() / 1000),
      },
      {
        status: 429,
        headers,
      }
    );
  }

  return null;
}

/**
 * Validate request body with Zod schema
 * Returns parsed data or error response
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));

      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Validation failed',
            details: errors,
          },
          { status: 400 }
        ),
      };
    }

    return { success: true, data: result.data };
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate query parameters with Zod schema
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
  const params = Object.fromEntries(searchParams.entries());
  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));

    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: errors,
        },
        { status: 400 }
      ),
    };
  }

  return { success: true, data: result.data };
}

/**
 * Create a protected API handler with auth, rate limiting, and validation
 *
 * Usage:
 * ```typescript
 * export const POST = protectedRoute({
 *   rateLimit: 'ai:analyze',
 *   bodySchema: mySchema,
 *   handler: async (request, { session, body, context }) => {
 *     // Your handler logic
 *     return NextResponse.json({ success: true });
 *   },
 * });
 * ```
 */
export function protectedRoute<TBody = unknown, TQuery = unknown>({
  rateLimit,
  bodySchema,
  querySchema,
  requireAuthentication = true,
  handler,
}: {
  rateLimit?: string;
  bodySchema?: z.ZodSchema<TBody>;
  querySchema?: z.ZodSchema<TQuery>;
  requireAuthentication?: boolean;
  handler: (
    request: Request,
    context: {
      session: Session | null;
      body?: TBody;
      query?: TQuery;
      apiContext: ApiContext;
    }
  ) => Promise<NextResponse>;
}) {
  return async (request: Request) => {
    const { ip, requestId } = getClientInfo(request);

    // 1. Check authentication if required
    const session: Session | null = await auth();
    if (requireAuthentication && !session?.user) {
      await logUnauthorized(request, new URL(request.url).pathname);
      return apiError('Unauthorized', 401);
    }

    const apiContext: ApiContext = {
      userId: session?.user?.id,
      email: session?.user?.email || undefined,
      ip,
      requestId,
    };

    // 2. Apply rate limiting
    if (rateLimit) {
      const rateLimitResponse = await applyRateLimit(
        request,
        rateLimit,
        session?.user?.id
      );
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }

    // 3. Validate body if schema provided
    let body: TBody | undefined;
    if (bodySchema) {
      const validation = await validateRequestBody(request, bodySchema);
      if (!validation.success) {
        return validation.response;
      }
      body = validation.data;
    }

    // 4. Validate query params if schema provided
    let query: TQuery | undefined;
    if (querySchema) {
      const url = new URL(request.url);
      const validation = validateQueryParams(url.searchParams, querySchema);
      if (!validation.success) {
        return validation.response;
      }
      query = validation.data;
    }

    // 5. Call the actual handler
    return handler(request, { session, body, query, apiContext });
  };
}

/**
 * Create a public API handler with optional rate limiting
 */
export function publicRoute<TBody = unknown, TQuery = unknown>(config: {
  rateLimit?: string;
  bodySchema?: z.ZodSchema<TBody>;
  querySchema?: z.ZodSchema<TQuery>;
  handler: (
    request: Request,
    context: {
      session: Session | null;
      body?: TBody;
      query?: TQuery;
      apiContext: ApiContext;
    }
  ) => Promise<NextResponse>;
}) {
  return protectedRoute({
    ...config,
    requireAuthentication: false,
  });
}
