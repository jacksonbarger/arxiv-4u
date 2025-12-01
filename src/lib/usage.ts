import type { User } from '@/types/database';
import {
  getUserById,
  decrementFreeBusinessPlans,
  incrementBusinessPlanCount,
  hasAccessToBusinessPlan,
  getBusinessPlansByUser,
} from '@/lib/db';

export interface UsageStatus {
  canGenerate: boolean;
  reason?: string;
  freeRemaining: number;
  totalGenerated: number;
  requiresPayment: boolean;
  requiresUpgrade: boolean;
}

/**
 * Check if a user can generate a business plan for a specific paper
 */
export async function checkBusinessPlanAccess(
  user: User,
  paperId: string
): Promise<UsageStatus> {
  const { subscription_tier, free_business_plans_remaining, business_plans_generated } = user;

  // Check if user already has access to this specific paper's plan
  const alreadyHasAccess = await hasAccessToBusinessPlan(user.id, paperId);
  if (alreadyHasAccess) {
    return {
      canGenerate: true,
      freeRemaining: free_business_plans_remaining,
      totalGenerated: business_plans_generated,
      requiresPayment: false,
      requiresUpgrade: false,
    };
  }

  // Premium users: unlimited access (with fair use policy)
  if (subscription_tier === 'premium') {
    // Check fair use policy (e.g., max 100 per month)
    const fairUseLimit = 100;
    const plansThisMonth = await getBusinessPlansThisMonth(user.id);

    if (plansThisMonth >= fairUseLimit) {
      return {
        canGenerate: false,
        reason: 'Fair use limit reached for this month. Please contact support if you need more.',
        freeRemaining: free_business_plans_remaining,
        totalGenerated: business_plans_generated,
        requiresPayment: false,
        requiresUpgrade: false,
      };
    }

    return {
      canGenerate: true,
      freeRemaining: free_business_plans_remaining,
      totalGenerated: business_plans_generated,
      requiresPayment: false,
      requiresUpgrade: false,
    };
  }

  // Basic users: need to pay $0.99 per plan
  if (subscription_tier === 'basic') {
    return {
      canGenerate: false,
      reason: 'Purchase this business plan for $0.99',
      freeRemaining: free_business_plans_remaining,
      totalGenerated: business_plans_generated,
      requiresPayment: true, // Can pay $0.99
      requiresUpgrade: false, // Or upgrade to Premium for unlimited
    };
  }

  // Free users: 3 free generations
  if (free_business_plans_remaining > 0) {
    return {
      canGenerate: true,
      freeRemaining: free_business_plans_remaining,
      totalGenerated: business_plans_generated,
      requiresPayment: false,
      requiresUpgrade: false,
    };
  }

  // Free users with no remaining free generations
  return {
    canGenerate: false,
    reason: `You've used all 3 free business plan generations`,
    freeRemaining: 0,
    totalGenerated: business_plans_generated,
    requiresPayment: true, // Can pay $0.99
    requiresUpgrade: true, // Or upgrade to subscription
  };
}

/**
 * Consume a free business plan generation
 */
export async function consumeFreeGeneration(userId: string): Promise<void> {
  await decrementFreeBusinessPlans(userId);
  await incrementBusinessPlanCount(userId);
}

/**
 * Record a paid business plan generation
 */
export async function recordPaidGeneration(userId: string): Promise<void> {
  await incrementBusinessPlanCount(userId);
}

/**
 * Get business plans generated this month
 */
async function getBusinessPlansThisMonth(userId: string): Promise<number> {
  const plans = await getBusinessPlansByUser(userId, 1000); // Get all plans
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return plans.filter(plan => {
    const createdAt = new Date(plan.created_at);
    return createdAt >= firstDayOfMonth;
  }).length;
}

/**
 * Check if user can access marketing insights
 */
export function canAccessMarketingInsights(user: User): boolean {
  return user.subscription_tier === 'basic' || user.subscription_tier === 'premium';
}

/**
 * Check if user can access business plans (excluding the 3 free)
 */
export function canAccessUnlimitedBusinessPlans(user: User): boolean {
  return user.subscription_tier === 'premium';
}

/**
 * Get upgrade CTA based on user's current tier
 */
export function getUpgradeCTA(user: User): {
  show: boolean;
  title: string;
  message: string;
  ctaText: string;
  tier: 'basic' | 'premium';
} {
  if (user.subscription_tier === 'premium') {
    return {
      show: false,
      title: '',
      message: '',
      ctaText: '',
      tier: 'premium',
    };
  }

  if (user.subscription_tier === 'basic') {
    return {
      show: true,
      title: 'Upgrade to Premium',
      message: 'Get unlimited business plan generations and advanced features',
      ctaText: 'Upgrade to Premium - $24.99/mo',
      tier: 'premium',
    };
  }

  // Free tier
  if (user.free_business_plans_remaining === 0) {
    return {
      show: true,
      title: 'Unlock More Business Plans',
      message: 'You\'ve used all 3 free generations. Upgrade for marketing insights and more!',
      ctaText: 'Start Free Trial - Basic $9.99/mo',
      tier: 'basic',
    };
  }

  return {
    show: true,
    title: 'Get More with Basic',
    message: `${user.free_business_plans_remaining} free generations left. Unlock unlimited bookmarks and marketing insights!`,
    ctaText: 'Start 7-Day Free Trial',
    tier: 'basic',
  };
}

/**
 * Get feature limits based on subscription tier
 */
export interface FeatureLimits {
  bookmarkLimit: number | null; // null = unlimited
  businessPlansPerMonth: number | null; // null = unlimited
  marketingInsights: boolean;
  commercialScores: boolean;
  businessPlans: 'free' | 'paid' | 'unlimited';
  pdfExport: boolean;
  prioritySupport: boolean;
}

export function getFeatureLimits(user: User): FeatureLimits {
  switch (user.subscription_tier) {
    case 'premium':
      return {
        bookmarkLimit: null, // unlimited
        businessPlansPerMonth: null, // unlimited (fair use)
        marketingInsights: true,
        commercialScores: true,
        businessPlans: 'unlimited',
        pdfExport: true,
        prioritySupport: true,
      };

    case 'basic':
      return {
        bookmarkLimit: null, // unlimited
        businessPlansPerMonth: null, // pay per plan
        marketingInsights: true,
        commercialScores: true,
        businessPlans: 'paid', // $0.99 each
        pdfExport: false,
        prioritySupport: false,
      };

    case 'free':
    default:
      return {
        bookmarkLimit: 10,
        businessPlansPerMonth: 3, // free generations
        marketingInsights: false,
        commercialScores: false,
        businessPlans: 'free', // 3 free total
        pdfExport: false,
        prioritySupport: false,
      };
  }
}

/**
 * Track usage event
 */
export async function trackUsageEvent(
  userId: string,
  eventType: string,
  eventData?: Record<string, unknown>
): Promise<void> {
  // Import trackEvent from db to avoid circular dependency
  const { trackEvent } = await import('@/lib/db');
  await trackEvent(userId, eventType, eventData);
}
