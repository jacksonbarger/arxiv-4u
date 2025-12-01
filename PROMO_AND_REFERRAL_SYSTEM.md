# 🎁 Promo Code & Referral System

## Overview

Complete promo code and referral system that drives user acquisition and retention through:
- **Promo Codes**: Discount codes with flexible configuration
- **Referral Program**: 1 free month for each successful referral
- **Automated Tracking**: Full lifecycle tracking from signup to conversion
- **Reward Management**: Automatic credit application

---

## 🎯 Features

### Promo Code System
- ✅ Percentage discounts (e.g., 50% off)
- ✅ Fixed amount discounts (e.g., $5 off)
- ✅ Free months (e.g., 1 month free)
- ✅ Usage limits (total and per-user)
- ✅ Tier restrictions (Basic/Premium)
- ✅ Time-based validity
- ✅ Minimum purchase requirements

### Referral System
- ✅ Unique referral codes per user
- ✅ 1 free month per successful referral
- ✅ Real-time tracking dashboard
- ✅ Social sharing (X, Email)
- ✅ Pending/converted status
- ✅ Automatic reward application
- ✅ Reward expiry (1 year)

---

## 📊 Database Schema

### Tables Created

**promo_codes**
- Stores all promo codes with discount configuration
- Tracks usage limits and validity periods

**promo_code_usage**
- Records each usage of a promo code
- Links to subscriptions/purchases

**user_referral_codes**
- One unique code per user
- Tracks referral stats

**referrals**
- Tracks each referral from signup to conversion
- Status: pending → signed_up → converted → rewarded

**referral_rewards**
- Manages reward credits
- Status: pending → applied → expired

### User Table Additions
- `referred_by_code`: Tracks which referral code they used
- `free_months_balance`: Available free months
- `referral_credits`: Bonus credits earned

---

## 🎨 UI Components

### 1. PromoCodeInput
**Location**: `src/components/PromoCodeInput.tsx`

**Features**:
- Real-time validation
- Toast notifications
- Beautiful success/error states
- Applied code display with remove option

**Usage**:
```tsx
import { PromoCodeInput } from '@/components/PromoCodeInput';

<PromoCodeInput
  tier="basic"
  onPromoApplied={(discount) => {
    // Handle discount: { type, value, code }
  }}
/>
```

### 2. ReferralDashboard
**Location**: `src/components/ReferralDashboard.tsx`

**Features**:
- Stats cards (total, successful, earned, pending)
- Copy referral link
- Share via X & Email
- Recent referrals list
- How it works guide

**Usage**:
```tsx
import { ReferralDashboard } from '@/components/ReferralDashboard';

<ReferralDashboard />
```

---

## 🔌 API Routes

### POST /api/promo-codes/validate
Validates a promo code

**Request**:
```json
{
  "code": "LAUNCH50",
  "tier": "basic"
}
```

**Response** (Success):
```json
{
  "valid": true,
  "code": "LAUNCH50",
  "discount_type": "percentage",
  "discount_value": 50,
  "min_purchase_amount": null
}
```

**Response** (Error):
```json
{
  "valid": false,
  "error": "Promo code has expired"
}
```

### GET /api/referrals/stats
Gets user's referral statistics

**Response**:
```json
{
  "referralCode": "ABC123DEF",
  "totalReferrals": 5,
  "successfulReferrals": 3,
  "totalRewardsEarned": 3,
  "pendingRewards": 2,
  "recentReferrals": [
    {
      "email": "friend@example.com",
      "status": "converted",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 🚀 Implementation Checklist

### Database Setup
- [ ] Run migration: `002_promo_and_referrals.sql`
- [ ] Verify all tables created
- [ ] Check seed promo codes inserted

### Frontend Integration

#### Pricing Page
```tsx
import { PromoCodeInput } from '@/components/PromoCodeInput';

// Add to pricing card
<PromoCodeInput
  tier={selectedTier}
  onPromoApplied={(discount) => {
    // Calculate new price
    // Store promo code for checkout
  }}
/>
```

#### Settings/Profile Page
```tsx
import { ReferralDashboard } from '@/components/ReferralDashboard';

// Add as new tab or section
<ReferralDashboard />
```

#### URL Handling
```tsx
// On app load, check for referral code
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');

  if (refCode) {
    // Store in localStorage for signup
    localStorage.setItem('referralCode', refCode);
    // Show toast: "You're signing up with referral code {refCode}!"
  }
}, []);
```

### Backend Integration

#### Stripe Checkout
```typescript
// Apply promo code discount
if (promoCode) {
  const validation = await validatePromoCode(promoCode, tier);
  if (validation.valid) {
    // Apply discount to Stripe session
    if (validation.discount_type === 'percentage') {
      // Apply percentage discount
    } else if (validation.discount_type === 'free_months') {
      // Extend trial or add credits
    }
  }
}
```

#### Track Referral Conversion
```typescript
// When user completes first purchase
async function onFirstPurchase(userId: string, subscriptionId: string) {
  // Get user's referrer
  const user = await getUserById(userId);

  if (user.referred_by_code) {
    // Mark referral as converted
    await sql`
      UPDATE referrals
      SET status = 'converted',
          converted_at = NOW(),
          subscription_id = ${subscriptionId}
      WHERE referee_user_id = ${userId}
      AND status = 'signed_up'
    `;

    // Create reward for referrer
    await sql`
      INSERT INTO referral_rewards (user_id, referral_id, reward_type, reward_value)
      VALUES (
        (SELECT referrer_user_id FROM referrals WHERE referee_user_id = ${userId}),
        (SELECT id FROM referrals WHERE referee_user_id = ${userId}),
        'free_month',
        1
      )
    `;

    // Update referrer's balance
    await sql`
      UPDATE users
      SET free_months_balance = free_months_balance + 1
      WHERE id = (SELECT referrer_user_id FROM referrals WHERE referee_user_id = ${userId})
    `;

    // Send notification to referrer
    await sendReferralSuccessEmail(referrerId);
  }
}
```

---

## 💰 Business Model

### Promo Code Strategy
- **LAUNCH50**: 50% off first month (early users)
- **EARLYBIRD**: 30% off (limited time)
- **FREEMONTH**: 1 free month (special promotions)
- **AFFILIATE_XXX**: Partner-specific codes

### Referral Economics
- **Cost**: 1 month (~$12-39) per successful referral
- **Value**: Lifetime customer ($144-468/year)
- **ROI**: 300-1000% depending on retention
- **Viral Coefficient**: Target 1.2+ (each user brings 1.2 more)

---

## 📈 Analytics Tracking

### Key Metrics to Track
1. **Promo Code Performance**
   - Usage rate by code
   - Conversion rate
   - Revenue impact

2. **Referral Funnel**
   - Link shares
   - Signups with code
   - First purchase rate
   - Reward redemption

3. **User Behavior**
   - Average referrals per user
   - Time to first referral
   - Referral network depth

### SQL Queries

**Top Performing Promo Codes**:
```sql
SELECT
  pc.code,
  pc.discount_value,
  COUNT(pcu.id) as uses,
  SUM(pcu.discount_applied) as total_discount_given
FROM promo_codes pc
LEFT JOIN promo_code_usage pcu ON pc.id = pcu.promo_code_id
GROUP BY pc.id
ORDER BY uses DESC
LIMIT 10;
```

**Referral Leaderboard**:
```sql
SELECT
  u.email,
  urc.referral_code,
  urc.total_referrals,
  urc.successful_referrals,
  urc.total_rewards_earned
FROM user_referral_codes urc
JOIN users u ON urc.user_id = u.id
WHERE urc.is_active = TRUE
ORDER BY urc.successful_referrals DESC
LIMIT 20;
```

---

## ✅ Testing Checklist

### Promo Codes
- [ ] Apply valid code → discount shown
- [ ] Apply expired code → error message
- [ ] Apply code twice → error on second use
- [ ] Apply wrong tier code → error message
- [ ] Remove applied code → discount removed

### Referrals
- [ ] Visit with ref code → code stored
- [ ] Sign up → referral created as 'pending'
- [ ] First purchase → referral marked 'converted'
- [ ] Referrer balance updated → +1 month
- [ ] Dashboard shows correct stats
- [ ] Copy link → clipboard contains full URL
- [ ] Share via email → mailto opens
- [ ] Share via X → tweet window opens

---

## 🎨 Design Highlights

### PromoCodeInput
- ✨ Smooth slide-in animation when code applied
- 🟢 Green success state with checkmark
- 🔴 Red error shake animation
- 📋 One-click remove functionality

### ReferralDashboard
- 📊 Gradient stat cards (turquoise, green, orange, blue)
- 🔗 Large, prominent referral code display
- 📱 Mobile-optimized sharing
- 📈 Real-time stats updates
- 🎉 Celebration animation on new referral

---

## 🔒 Security Considerations

1. **Rate Limiting**: Prevent promo code brute force
2. **User Validation**: Ensure authenticated for rewards
3. **Fraud Detection**: Monitor suspicious referral patterns
4. **Expiry Enforcement**: Auto-expire old rewards
5. **Audit Trail**: Log all promo/referral transactions

---

## 🚀 Future Enhancements

1. **Multi-tier Rewards**: Different rewards for Basic vs Premium referrals
2. **Referral Contests**: Leaderboards with prizes
3. **Partner Programs**: Special codes for influencers
4. **Gift Cards**: Allow users to gift subscriptions
5. **Team Referrals**: Bulk rewards for workspace invites
6. **Promo Code Generator**: Admin panel for creating codes
7. **A/B Testing**: Test different reward amounts
8. **Email Automation**: Drip campaigns for referrers

---

## 📞 Support

For questions or issues:
- Database: Check migration logs
- API: Check server logs for validation errors
- UI: Check console for component errors
- Tracking: Query database tables directly

---

**Built with** ❤️ **for Arxiv-4U**
