import { sql } from '@vercel/postgres';

/**
 * Audit Logging System
 *
 * Logs sensitive actions for security monitoring and compliance.
 * Uses structured JSON logging for easy parsing by log aggregators
 * (Datadog, Splunk, CloudWatch, etc.)
 */

export type AuditAction =
  | 'auth:login'
  | 'auth:login_failed'
  | 'auth:logout'
  | 'auth:signup'
  | 'auth:password_reset'
  | 'subscription:created'
  | 'subscription:updated'
  | 'subscription:cancelled'
  | 'payment:intent_created'
  | 'payment:succeeded'
  | 'payment:failed'
  | 'business_plan:generated'
  | 'business_plan:purchased'
  | 'api:rate_limited'
  | 'api:unauthorized'
  | 'api:forbidden';

export interface AuditLogEntry {
  action: AuditAction;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
  success: boolean;
  errorMessage?: string;
}

/**
 * Log an audit event
 * Writes to both console (structured JSON) and database
 */
export async function auditLog(entry: AuditLogEntry): Promise<void> {
  const timestamp = new Date().toISOString();

  const logEntry = {
    timestamp,
    level: entry.success ? 'info' : 'warn',
    service: 'arxiv-4u',
    ...entry,
  };

  // Structured JSON logging for log aggregators
  console.log(JSON.stringify(logEntry));

  // Persist to database for compliance/audit trail
  try {
    await sql`
      INSERT INTO audit_logs (
        action,
        user_id,
        email,
        ip_address,
        user_agent,
        request_id,
        metadata,
        success,
        error_message,
        created_at
      ) VALUES (
        ${entry.action},
        ${entry.userId || null},
        ${entry.email || null},
        ${entry.ip || null},
        ${entry.userAgent || null},
        ${entry.requestId || null},
        ${JSON.stringify(entry.metadata || {})},
        ${entry.success},
        ${entry.errorMessage || null},
        NOW()
      )
    `;
  } catch (error) {
    // Don't fail the request if audit logging fails
    console.error('Audit log write failed:', error);
  }
}

/**
 * Extract client info from request for audit logging
 */
export function getClientInfo(request: Request): {
  ip: string;
  userAgent: string;
  requestId: string;
} {
  const headers = request.headers;

  // Get IP from various headers (Vercel, Cloudflare, etc.)
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown';

  const userAgent = headers.get('user-agent') || 'unknown';
  const requestId = headers.get('x-request-id') || crypto.randomUUID();

  return { ip, userAgent, requestId };
}

/**
 * Log a successful auth event
 */
export async function logAuthSuccess(
  request: Request,
  action: 'auth:login' | 'auth:signup' | 'auth:logout',
  userId: string,
  email: string
): Promise<void> {
  const { ip, userAgent, requestId } = getClientInfo(request);

  await auditLog({
    action,
    userId,
    email,
    ip,
    userAgent,
    requestId,
    success: true,
  });
}

/**
 * Log a failed auth event
 */
export async function logAuthFailure(
  request: Request,
  action: 'auth:login_failed' | 'auth:signup',
  email: string,
  errorMessage: string
): Promise<void> {
  const { ip, userAgent, requestId } = getClientInfo(request);

  await auditLog({
    action,
    email,
    ip,
    userAgent,
    requestId,
    success: false,
    errorMessage,
  });
}

/**
 * Log a payment event
 */
export async function logPaymentEvent(
  request: Request,
  action: 'payment:intent_created' | 'payment:succeeded' | 'payment:failed',
  userId: string,
  metadata: Record<string, unknown>,
  success: boolean = true,
  errorMessage?: string
): Promise<void> {
  const { ip, userAgent, requestId } = getClientInfo(request);

  await auditLog({
    action,
    userId,
    ip,
    userAgent,
    requestId,
    metadata,
    success,
    errorMessage,
  });
}

/**
 * Log a rate limit hit
 */
export async function logRateLimitHit(
  request: Request,
  endpoint: string,
  userId?: string
): Promise<void> {
  const { ip, userAgent, requestId } = getClientInfo(request);

  await auditLog({
    action: 'api:rate_limited',
    userId,
    ip,
    userAgent,
    requestId,
    metadata: { endpoint },
    success: false,
    errorMessage: 'Rate limit exceeded',
  });
}

/**
 * Log an unauthorized access attempt
 */
export async function logUnauthorized(
  request: Request,
  endpoint: string
): Promise<void> {
  const { ip, userAgent, requestId } = getClientInfo(request);

  await auditLog({
    action: 'api:unauthorized',
    ip,
    userAgent,
    requestId,
    metadata: { endpoint, url: request.url },
    success: false,
    errorMessage: 'Unauthorized access attempt',
  });
}
