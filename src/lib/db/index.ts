import { sql } from '@vercel/postgres';
import type { User, Subscription, BusinessPlan, OneTimePurchase, PaperCache, Bookmark, ReadingHistory, Notification } from '@/types/database';

// ========================================
// USER QUERIES
// ========================================

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql<User>`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `;
  return result.rows[0] || null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const result = await sql<User>`
    SELECT * FROM users WHERE username = ${username} LIMIT 1
  `;
  return result.rows[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql<User>`
    SELECT * FROM users WHERE id = ${id} LIMIT 1
  `;
  return result.rows[0] || null;
}

export async function createUser(data: {
  email: string;
  username: string;
  passwordHash: string;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
}): Promise<User> {
  const result = await sql<User>`
    INSERT INTO users (
      email,
      username,
      password_hash,
      verification_token,
      verification_token_expiry
    )
    VALUES (
      ${data.email},
      ${data.username},
      ${data.passwordHash},
      ${data.verificationToken || null},
      ${data.verificationTokenExpiry || null}
    )
    RETURNING *
  `;
  return result.rows[0];
}

export async function updateUserSubscription(
  userId: string,
  data: {
    subscriptionTier: string;
    subscriptionStatus: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionPeriodEnd?: Date;
  }
): Promise<User> {
  const result = await sql<User>`
    UPDATE users
    SET
      subscription_tier = ${data.subscriptionTier},
      subscription_status = ${data.subscriptionStatus},
      stripe_customer_id = ${data.stripeCustomerId || null},
      stripe_subscription_id = ${data.stripeSubscriptionId || null},
      subscription_period_end = ${data.subscriptionPeriodEnd || null}
    WHERE id = ${userId}
    RETURNING *
  `;
  return result.rows[0];
}

export async function incrementBusinessPlanCount(userId: string): Promise<void> {
  await sql`
    UPDATE users
    SET
      business_plans_generated = business_plans_generated + 1,
      last_business_plan_generated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `;
}

export async function decrementFreeBusinessPlans(userId: string): Promise<void> {
  await sql`
    UPDATE users
    SET free_business_plans_remaining = GREATEST(free_business_plans_remaining - 1, 0)
    WHERE id = ${userId}
  `;
}

export async function verifyUserEmail(token: string): Promise<User | null> {
  const result = await sql<User>`
    UPDATE users
    SET
      email_verified = TRUE,
      verification_token = NULL,
      verification_token_expiry = NULL
    WHERE verification_token = ${token}
      AND verification_token_expiry > CURRENT_TIMESTAMP
    RETURNING *
  `;
  return result.rows[0] || null;
}

// ========================================
// SUBSCRIPTION QUERIES
// ========================================

export async function getActiveSubscription(userId: string): Promise<Subscription | null> {
  const result = await sql<Subscription>`
    SELECT * FROM subscriptions
    WHERE user_id = ${userId}
      AND status IN ('active', 'trialing')
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return result.rows[0] || null;
}

export async function createSubscription(data: {
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  status: string;
  tier: 'free' | 'standard' | 'pro' | 'enterprise';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialStart?: Date;
  trialEnd?: Date;
}): Promise<Subscription> {
  const result = await sql<Subscription>`
    INSERT INTO subscriptions (
      user_id,
      stripe_subscription_id,
      stripe_customer_id,
      stripe_price_id,
      status,
      tier,
      current_period_start,
      current_period_end,
      trial_start,
      trial_end
    )
    VALUES (
      ${data.userId},
      ${data.stripeSubscriptionId},
      ${data.stripeCustomerId},
      ${data.stripePriceId},
      ${data.status},
      ${data.tier},
      ${data.currentPeriodStart},
      ${data.currentPeriodEnd},
      ${data.trialStart || null},
      ${data.trialEnd || null}
    )
    RETURNING *
  `;
  return result.rows[0];
}

export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: string,
  currentPeriodEnd?: Date
): Promise<Subscription> {
  const result = await sql<Subscription>`
    UPDATE subscriptions
    SET
      status = ${status},
      current_period_end = ${currentPeriodEnd || sql`current_period_end`}
    WHERE stripe_subscription_id = ${stripeSubscriptionId}
    RETURNING *
  `;
  return result.rows[0];
}

export async function cancelSubscription(stripeSubscriptionId: string): Promise<Subscription> {
  const result = await sql<Subscription>`
    UPDATE subscriptions
    SET
      status = 'canceled',
      canceled_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ${stripeSubscriptionId}
    RETURNING *
  `;
  return result.rows[0];
}

// ========================================
// BUSINESS PLAN QUERIES
// ========================================

export async function createBusinessPlan(data: {
  userId: string;
  paperId: string;
  paperTitle: string;
  planData: unknown;
  category?: string;
  strategyTitle?: string;
  purchaseType: 'free' | 'one_time' | 'subscription';
  amountPaid?: number;
  stripePaymentIntentId?: string;
}): Promise<BusinessPlan> {
  const result = await sql<BusinessPlan>`
    INSERT INTO business_plans (
      user_id,
      paper_id,
      paper_title,
      plan_data,
      category,
      strategy_title,
      purchase_type,
      amount_paid,
      stripe_payment_intent_id
    )
    VALUES (
      ${data.userId},
      ${data.paperId},
      ${data.paperTitle},
      ${JSON.stringify(data.planData)},
      ${data.category || null},
      ${data.strategyTitle || null},
      ${data.purchaseType},
      ${data.amountPaid || 0},
      ${data.stripePaymentIntentId || null}
    )
    RETURNING *
  `;
  return result.rows[0];
}

export async function getBusinessPlansByUser(userId: string, limit = 50): Promise<BusinessPlan[]> {
  const result = await sql<BusinessPlan>`
    SELECT * FROM business_plans
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return result.rows;
}

export async function getBusinessPlanByPaper(userId: string, paperId: string): Promise<BusinessPlan | null> {
  const result = await sql<BusinessPlan>`
    SELECT * FROM business_plans
    WHERE user_id = ${userId} AND paper_id = ${paperId}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return result.rows[0] || null;
}

export async function hasAccessToBusinessPlan(userId: string, paperId: string): Promise<boolean> {
  // Check if user has an existing plan (free, purchased, or via subscription)
  const result = await sql<{ count: number }>`
    SELECT COUNT(*) as count
    FROM business_plans
    WHERE user_id = ${userId} AND paper_id = ${paperId}
  `;
  return (result.rows[0]?.count || 0) > 0;
}

export async function updateBusinessPlanLastViewed(planId: string): Promise<void> {
  await sql`
    UPDATE business_plans
    SET last_viewed_at = CURRENT_TIMESTAMP
    WHERE id = ${planId}
  `;
}

// ========================================
// ONE-TIME PURCHASE QUERIES
// ========================================

export async function createOneTimePurchase(data: {
  userId: string;
  paperId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency?: string;
  status: string;
}): Promise<OneTimePurchase> {
  const result = await sql<OneTimePurchase>`
    INSERT INTO one_time_purchases (
      user_id,
      paper_id,
      product_type,
      stripe_payment_intent_id,
      amount,
      currency,
      status
    )
    VALUES (
      ${data.userId},
      ${data.paperId},
      'business_plan',
      ${data.stripePaymentIntentId},
      ${data.amount},
      ${data.currency || 'usd'},
      ${data.status}
    )
    RETURNING *
  `;
  return result.rows[0];
}

export async function updateOneTimePurchaseStatus(
  paymentIntentId: string,
  status: string,
  businessPlanId?: string
): Promise<OneTimePurchase> {
  const result = await sql<OneTimePurchase>`
    UPDATE one_time_purchases
    SET
      status = ${status},
      business_plan_id = ${businessPlanId || sql`business_plan_id`}
    WHERE stripe_payment_intent_id = ${paymentIntentId}
    RETURNING *
  `;
  return result.rows[0];
}

// ========================================
// PAPER CACHE QUERIES
// ========================================

export async function getCachedPaperAnalysis(paperId: string): Promise<PaperCache | null> {
  const result = await sql<PaperCache>`
    SELECT * FROM paper_cache
    WHERE paper_id = ${paperId}
      AND expires_at > CURRENT_TIMESTAMP
    LIMIT 1
  `;
  return result.rows[0] || null;
}

export async function cachePaperAnalysis(data: {
  paperId: string;
  summary?: string;
  marketingInsights?: unknown;
  commercialScore?: number;
  keyFindings?: string[];
  targetAudience?: string;
  implementationDifficulty?: string;
}): Promise<PaperCache> {
  const result = await sql<PaperCache>`
    INSERT INTO paper_cache (
      paper_id,
      summary,
      marketing_insights,
      commercial_score,
      key_findings,
      target_audience,
      implementation_difficulty
    )
    VALUES (
      ${data.paperId},
      ${data.summary || null},
      ${data.marketingInsights ? JSON.stringify(data.marketingInsights) : null},
      ${data.commercialScore || null},
      ${data.keyFindings ? JSON.stringify(data.keyFindings) : null},
      ${data.targetAudience || null},
      ${data.implementationDifficulty || null}
    )
    ON CONFLICT (paper_id)
    DO UPDATE SET
      summary = EXCLUDED.summary,
      marketing_insights = EXCLUDED.marketing_insights,
      commercial_score = EXCLUDED.commercial_score,
      key_findings = EXCLUDED.key_findings,
      target_audience = EXCLUDED.target_audience,
      implementation_difficulty = EXCLUDED.implementation_difficulty,
      analyzed_at = CURRENT_TIMESTAMP,
      expires_at = CURRENT_TIMESTAMP + INTERVAL '7 days'
    RETURNING *
  `;
  return result.rows[0];
}

// ========================================
// BOOKMARK QUERIES
// ========================================

export async function getBookmarksByUser(userId: string): Promise<Bookmark[]> {
  const result = await sql<Bookmark>`
    SELECT * FROM bookmarks
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return result.rows;
}

export async function createBookmark(userId: string, paperId: string): Promise<Bookmark> {
  const result = await sql<Bookmark>`
    INSERT INTO bookmarks (user_id, paper_id)
    VALUES (${userId}, ${paperId})
    ON CONFLICT (user_id, paper_id) DO NOTHING
    RETURNING *
  `;
  return result.rows[0];
}

export async function deleteBookmark(userId: string, paperId: string): Promise<void> {
  await sql`
    DELETE FROM bookmarks
    WHERE user_id = ${userId} AND paper_id = ${paperId}
  `;
}

export async function getBookmarkCount(userId: string): Promise<number> {
  const result = await sql<{ count: number }>`
    SELECT COUNT(*) as count FROM bookmarks WHERE user_id = ${userId}
  `;
  return result.rows[0]?.count || 0;
}

// ========================================
// READING HISTORY QUERIES
// ========================================

export async function trackPaperView(userId: string, paperId: string): Promise<void> {
  await sql`
    INSERT INTO reading_history (user_id, paper_id)
    VALUES (${userId}, ${paperId})
    ON CONFLICT (user_id, paper_id)
    DO UPDATE SET
      last_viewed_at = CURRENT_TIMESTAMP,
      view_count = reading_history.view_count + 1
  `;
}

export async function getReadingHistory(userId: string, limit = 50): Promise<ReadingHistory[]> {
  const result = await sql<ReadingHistory>`
    SELECT * FROM reading_history
    WHERE user_id = ${userId}
    ORDER BY last_viewed_at DESC
    LIMIT ${limit}
  `;
  return result.rows;
}

// ========================================
// NOTIFICATION QUERIES
// ========================================

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  paperId?: string;
  actionUrl?: string;
}): Promise<Notification> {
  const result = await sql<Notification>`
    INSERT INTO notifications (user_id, type, title, message, paper_id, action_url)
    VALUES (
      ${data.userId},
      ${data.type},
      ${data.title},
      ${data.message},
      ${data.paperId || null},
      ${data.actionUrl || null}
    )
    RETURNING *
  `;
  return result.rows[0];
}

export async function getNotificationsByUser(userId: string, limit = 50): Promise<Notification[]> {
  const result = await sql<Notification>`
    SELECT * FROM notifications
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return result.rows;
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await sql`
    UPDATE notifications
    SET read = TRUE
    WHERE id = ${notificationId}
  `;
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  await sql`
    UPDATE notifications
    SET read = TRUE
    WHERE user_id = ${userId} AND read = FALSE
  `;
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await sql`
    DELETE FROM notifications WHERE id = ${notificationId}
  `;
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const result = await sql<{ count: number }>`
    SELECT COUNT(*) as count
    FROM notifications
    WHERE user_id = ${userId} AND read = FALSE
  `;
  return result.rows[0]?.count || 0;
}

// ========================================
// USAGE ANALYTICS
// ========================================

export async function trackEvent(
  userId: string,
  eventType: string,
  eventData?: Record<string, unknown>
): Promise<void> {
  await sql`
    INSERT INTO usage_analytics (user_id, event_type, event_data)
    VALUES (
      ${userId},
      ${eventType},
      ${eventData ? JSON.stringify(eventData) : null}
    )
  `;
}
