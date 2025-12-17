import { z } from 'zod';

/**
 * Input Validation Schemas using Zod
 * Centralized validation for all API inputs
 */

// Topic categories matching TopicCategory type
const topicCategories = [
  'agentic-coding',
  'image-generation',
  'video-generation',
  'ai-content-creators',
  'comfyui',
  'runpod',
  'market-opportunity',
  'nlp',
  'llm',
  'rag',
  'multimodal',
  'robotics',
  'rl',
  'transformers',
  'safety',
  'science',
  'efficiency',
  'other',
] as const;

// ========================================
// AUTH SCHEMAS
// ========================================

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password too long'),
});

export const signupSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .toLowerCase()
    .trim(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password too long'),
});

// ========================================
// API SCHEMAS
// ========================================

export const paperIdSchema = z.string()
  .min(1, 'Paper ID required')
  .max(50, 'Paper ID too long')
  .regex(/^[\w.-]+$/, 'Invalid paper ID format');

export const searchQuerySchema = z.string()
  .max(500, 'Search query too long')
  .trim()
  .optional();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ========================================
// BUSINESS PLAN SCHEMAS
// ========================================

export const businessPlanInputSchema = z.object({
  paper: z.object({
    id: paperIdSchema,
    title: z.string().max(1000),
    abstract: z.string().max(10000),
    authors: z.array(z.object({
      name: z.string().max(200),
      affiliation: z.string().max(500).optional(),
    })),
    categories: z.array(z.string().max(50)),
    primaryCategory: z.string().max(50),
    publishedDate: z.string(),
    updatedDate: z.string(),
    pdfUrl: z.string().url(),
    arxivUrl: z.string().url(),
  }),
  categoryMatch: z.object({
    category: z.enum(topicCategories),
    score: z.number().min(0).max(100),
    matchedKeywords: z.array(z.string()),
  }),
  selectedStrategy: z.object({
    title: z.string().max(200),
    description: z.string().max(2000),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedRevenue: z.string().max(100),
    timeToMarket: z.string().max(100),
    steps: z.array(z.string().max(500)),
    resources: z.array(z.string().max(200)).optional(),
    quickWins: z.array(z.string().max(500)).optional(),
  }),
  userInputs: z.object({
    budget: z.string().max(100).optional(),
    timeline: z.string().max(100).optional(),
    experienceLevel: z.enum(['beginner', 'intermediate', 'expert']).optional(),
    targetMarket: z.string().max(200).optional(),
    teamSize: z.string().max(100).optional(),
  }).optional(),
  paymentIntentId: z.string().max(100).optional(),
});

// ========================================
// STRIPE SCHEMAS
// ========================================

export const createCheckoutSchema = z.object({
  priceId: z.string()
    .regex(/^price_/, 'Invalid price ID format'),
  tier: z.enum(['standard', 'pro']),
  promoCode: z.string().max(50).optional(),
});

export const createPaymentIntentSchema = z.object({
  paperId: paperIdSchema,
});

// ========================================
// SANITIZATION HELPERS
// ========================================

/**
 * Sanitize string input - remove potential XSS vectors
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize HTML - escape special characters
 */
export function escapeHtml(input: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return input.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

/**
 * Validate and parse request body with schema
 */
export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message).join(', ');
      return { success: false, error: errors };
    }

    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Invalid JSON body' };
  }
}

/**
 * Validate query parameters with schema
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const params = Object.fromEntries(searchParams.entries());
    const result = schema.safeParse(params);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message).join(', ');
      return { success: false, error: errors };
    }

    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Invalid query parameters' };
  }
}
