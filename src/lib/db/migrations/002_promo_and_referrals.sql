-- Add Promo Codes and Referral System
-- This migration adds:
-- - Promo codes table
-- - Referral tracking
-- - User referral codes
-- - Referral rewards

-- ========================================
-- PROMO CODES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,

  -- Discount configuration
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_months')),
  discount_value INTEGER NOT NULL, -- percentage (0-100), cents, or months

  -- Limits
  max_uses INTEGER, -- NULL = unlimited
  uses_count INTEGER DEFAULT 0,
  max_uses_per_user INTEGER DEFAULT 1,

  -- Applicability
  applicable_tiers JSONB DEFAULT '["basic", "premium"]'::jsonb,
  min_purchase_amount INTEGER, -- minimum purchase in cents

  -- Duration
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  valid_until TIMESTAMP WITH TIME ZONE,

  -- Metadata
  description TEXT,
  created_by_user_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_codes_valid_until ON promo_codes(valid_until);

-- ========================================
-- PROMO CODE USAGE TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS promo_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Usage details
  discount_applied INTEGER NOT NULL, -- in cents or months
  original_amount INTEGER, -- in cents
  final_amount INTEGER, -- in cents

  -- Related records
  subscription_id UUID REFERENCES subscriptions(id),
  one_time_purchase_id UUID REFERENCES one_time_purchases(id),

  used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(promo_code_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_promo_code_usage_promo_code_id ON promo_code_usage(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_user_id ON promo_code_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_used_at ON promo_code_usage(used_at DESC);

-- ========================================
-- USER REFERRAL CODES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS user_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Unique referral code for this user
  referral_code VARCHAR(50) UNIQUE NOT NULL,

  -- Stats
  total_referrals INTEGER DEFAULT 0,
  successful_referrals INTEGER DEFAULT 0, -- referrals that resulted in purchases
  total_rewards_earned INTEGER DEFAULT 0, -- in months

  -- Settings
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_referral_codes_user_id ON user_referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referral_codes_referral_code ON user_referral_codes(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_referral_codes_is_active ON user_referral_codes(is_active);

-- ========================================
-- REFERRALS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Referrer (person who shared the code)
  referrer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referrer_code_id UUID NOT NULL REFERENCES user_referral_codes(id) ON DELETE CASCADE,

  -- Referee (person who used the code)
  referee_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referee_email VARCHAR(255),

  -- Status tracking
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted', 'rewarded', 'expired')),

  -- Conversion tracking
  converted_at TIMESTAMP WITH TIME ZONE, -- when they made their first purchase
  subscription_id UUID REFERENCES subscriptions(id),
  one_time_purchase_id UUID REFERENCES one_time_purchases(id),

  -- Reward tracking
  reward_amount INTEGER DEFAULT 1, -- months of free subscription
  reward_granted_at TIMESTAMP WITH TIME ZONE,
  reward_expires_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_user_id ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_user_id ON referrals(referee_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at DESC);

-- ========================================
-- REFERRAL REWARDS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,

  -- Reward details
  reward_type VARCHAR(20) NOT NULL CHECK (reward_type IN ('free_month', 'discount', 'credits')),
  reward_value INTEGER NOT NULL, -- months, percentage, or credits

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'expired', 'forfeited')),
  applied_to_subscription_id UUID REFERENCES subscriptions(id),

  -- Expiry
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 year'),
  applied_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON referral_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referral_id ON referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON referral_rewards(status);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_expires_at ON referral_rewards(expires_at);

-- ========================================
-- ADD REFERRAL COLUMNS TO USERS TABLE
-- ========================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by_code VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS free_months_balance INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_credits INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_users_referred_by_code ON users(referred_by_code);

-- ========================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_referral_codes_updated_at BEFORE UPDATE ON user_referral_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_rewards_updated_at BEFORE UPDATE ON referral_rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SEED SOME PROMO CODES
-- ========================================
INSERT INTO promo_codes (code, discount_type, discount_value, description, is_active)
VALUES
  ('LAUNCH50', 'percentage', 50, '50% off first month for launch users', TRUE),
  ('FREEMONTH', 'free_months', 1, 'One free month', TRUE),
  ('EARLYBIRD', 'percentage', 30, '30% off for early adopters', TRUE)
ON CONFLICT (code) DO NOTHING;
