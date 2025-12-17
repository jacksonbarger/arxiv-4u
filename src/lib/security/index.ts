/**
 * Security Module - Central Exports
 *
 * This module provides comprehensive security features:
 * - Input validation with Zod schemas
 * - Rate limiting (Redis + in-memory fallback)
 * - Security headers (CSP, CORS, etc.)
 * - Audit logging for sensitive actions
 * - API route protection patterns
 * - Environment validation
 */

// Validation schemas and helpers
export {
  loginSchema,
  signupSchema,
  paperIdSchema,
  searchQuerySchema,
  paginationSchema,
  businessPlanInputSchema,
  createCheckoutSchema,
  createPaymentIntentSchema,
  sanitizeString,
  escapeHtml,
  validateBody,
  validateQuery,
} from './validation';

// Rate limiting
export {
  RATE_LIMITS,
  checkRateLimit,
  checkRateLimitMemory,
  getRateLimitHeaders,
} from './rate-limit';

// Security headers
export {
  SECURITY_HEADERS,
  getCSPHeader,
  getSecurityHeaders,
  CORS_CONFIG,
  getCORSHeaders,
} from './headers';

// Audit logging
export {
  auditLog,
  getClientInfo,
  logAuthSuccess,
  logAuthFailure,
  logPaymentEvent,
  logRateLimitHit,
  logUnauthorized,
  type AuditAction,
  type AuditLogEntry,
} from './audit-log';

// API protection helpers
export {
  apiError,
  requireAuth,
  applyRateLimit,
  validateRequestBody,
  validateQueryParams,
  protectedRoute,
  publicRoute,
  type ApiContext,
} from './api-protection';

// Environment validation
export {
  validateServerEnv,
  validateClientEnv,
  getRequiredEnv,
  getOptionalEnv,
  isFeatureEnabled,
  getEnvSummary,
} from './env-validation';
