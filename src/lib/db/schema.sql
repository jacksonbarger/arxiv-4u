-- Arxiv-4U Database Schema for Vercel Postgres
-- This schema supports the full monetization model:
-- - User management
-- - Subscription tiers (Free, Basic, Premium)
-- - Usage tracking (3 free business plan generations)
-- - One-time purchases ($0.99 per plan)
-- - Generated business plans storage

-- ========================================
-- USERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Email verification
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_token_expiry TIMESTAMP WITH TIME ZONE,

  -- Subscription info
  subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'trialing', 'past_due', 'canceled', 'expired')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_period_end TIMESTAMP WITH TIME ZONE,

  -- Stripe integration
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,

  -- User preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  notification_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (notification_frequency IN ('daily', 'weekly')),
  notification_categories JSONB DEFAULT '[]'::jsonb,

  -- Usage tracking
  business_plans_generated INTEGER DEFAULT 0,
  free_business_plans_remaining INTEGER DEFAULT 3,
  last_business_plan_generated_at TIMESTAMP WITH TIME ZONE
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- ========================================
-- SUBSCRIPTIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_price_id VARCHAR(255) NOT NULL,

  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete')),
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('basic', 'premium')),

  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ========================================
-- BUSINESS PLANS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS business_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  paper_id VARCHAR(255) NOT NULL,
  paper_title TEXT NOT NULL,

  -- Plan content (stored as JSONB for flexibility)
  plan_data JSONB NOT NULL,

  -- Metadata
  category VARCHAR(50),
  strategy_title VARCHAR(255),

  -- Purchase tracking
  purchase_type VARCHAR(20) NOT NULL CHECK (purchase_type IN ('free', 'one_time', 'subscription')),
  amount_paid INTEGER DEFAULT 0, -- in cents ($0.99 = 99)
  stripe_payment_intent_id VARCHAR(255),

  -- Versioning
  version INTEGER DEFAULT 1,
  parent_plan_id UUID REFERENCES business_plans(id),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_viewed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_business_plans_user_id ON business_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_business_plans_paper_id ON business_plans(paper_id);
CREATE INDEX IF NOT EXISTS idx_business_plans_purchase_type ON business_plans(purchase_type);
CREATE INDEX IF NOT EXISTS idx_business_plans_created_at ON business_plans(created_at DESC);

-- ========================================
-- ONE-TIME PURCHASES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS one_time_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  paper_id VARCHAR(255) NOT NULL,

  product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('business_plan')),

  -- Stripe info
  stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),

  -- Related business plan
  business_plan_id UUID REFERENCES business_plans(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_one_time_purchases_user_id ON one_time_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_paper_id ON one_time_purchases(paper_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_stripe_payment_intent_id ON one_time_purchases(stripe_payment_intent_id);

-- ========================================
-- PAPER CACHE TABLE (for AI analysis results)
-- ========================================
CREATE TABLE IF NOT EXISTS paper_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id VARCHAR(255) UNIQUE NOT NULL,

  -- Cached AI analysis
  summary TEXT,
  marketing_insights JSONB,
  commercial_score INTEGER CHECK (commercial_score >= 0 AND commercial_score <= 100),
  key_findings JSONB,
  target_audience TEXT,
  implementation_difficulty VARCHAR(20) CHECK (implementation_difficulty IN ('low', 'medium', 'high')),

  -- Metadata
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
  analysis_version INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_paper_cache_paper_id ON paper_cache(paper_id);
CREATE INDEX IF NOT EXISTS idx_paper_cache_expires_at ON paper_cache(expires_at);

-- ========================================
-- BOOKMARKS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  paper_id VARCHAR(255) NOT NULL,

  -- Optional metadata
  notes TEXT,
  collection_name VARCHAR(100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, paper_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- ========================================
-- READING HISTORY TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  paper_id VARCHAR(255) NOT NULL,

  -- Tracking
  first_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  view_count INTEGER DEFAULT 1,
  read_duration_seconds INTEGER DEFAULT 0,

  UNIQUE(user_id, paper_id)
);

CREATE INDEX IF NOT EXISTS idx_reading_history_user_id ON reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_last_viewed_at ON reading_history(last_viewed_at DESC);

-- ========================================
-- NOTIFICATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  -- Optional data
  paper_id VARCHAR(255),
  action_url TEXT,

  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ========================================
-- USAGE ANALYTICS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_event_type ON usage_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_created_at ON usage_analytics(created_at DESC);

-- ========================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_plans_updated_at BEFORE UPDATE ON business_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_one_time_purchases_updated_at BEFORE UPDATE ON one_time_purchases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
