# Integration Guide: Wire Everything Together

This guide shows you exactly how to integrate all the components we've built into your existing app.

---

## 🎯 Overview

We need to connect:
1. Marketing Insights to Paper Detail view
2. Business Plan Generator to paper pages
3. Upgrade Modals throughout the app
4. User session data to all components
5. Payment flows to Stripe

---

## Step 1: Update PaperDetail Component

**File:** `src/components/PaperDetail.tsx`

Add the new components to your paper detail view:

```typescript
// Add these imports at the top
import { MarketingInsights, MarketingInsightsPaywall } from './MarketingInsights';
import { BusinessPlanGenerator } from './BusinessPlanGenerator';
import { UpgradeModal } from './UpgradeModal';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

// Inside your PaperDetail component, add state
const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'business-plan'>('overview');
const [showUpgradeModal, setShowUpgradeModal] = useState(false);
const [userTier, setUserTier] = useState<'free' | 'basic' | 'premium'>('free');
const [freeGensRemaining, setFreeGensRemaining] = useState(3);

// Fetch user subscription data
const { data: session } = useSession();

useEffect(() => {
  async function fetchUserData() {
    if (!session?.user) return;

    try {
      const response = await fetch('/api/user/subscription-status');
      if (response.ok) {
        const data = await response.json();
        setUserTier(data.tier);
        setFreeGensRemaining(data.freeGenerationsRemaining);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  fetchUserData();
}, [session]);

// In your JSX, add tabs
<div className="flex gap-2 mb-6 border-b" style={{ borderColor: '#E2E8F0' }}>
  <button
    onClick={() => setActiveTab('overview')}
    className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'border-b-2' : ''}`}
    style={{
      borderColor: activeTab === 'overview' ? '#2563EB' : 'transparent',
      color: activeTab === 'overview' ? '#2563EB' : '#64748B'
    }}
  >
    Overview
  </button>

  <button
    onClick={() => setActiveTab('insights')}
    className={`px-4 py-2 font-medium ${activeTab === 'insights' ? 'border-b-2' : ''}`}
    style={{
      borderColor: activeTab === 'insights' ? '#2563EB' : 'transparent',
      color: activeTab === 'insights' ? '#2563EB' : '#64748B'
    }}
  >
    💡 Marketing Insights
    {userTier === 'free' && <span className="ml-2 text-xs">🔒</span>}
  </button>

  <button
    onClick={() => setActiveTab('business-plan')}
    className={`px-4 py-2 font-medium ${activeTab === 'business-plan' ? 'border-b-2' : ''}`}
    style={{
      borderColor: activeTab === 'business-plan' ? '#2563EB' : 'transparent',
      color: activeTab === 'business-plan' ? '#2563EB' : '#64748B'
    }}
  >
    📊 Business Plan
    {freeGensRemaining === 0 && userTier === 'free' && <span className="ml-2 text-xs">🔒</span>}
  </button>
</div>

// Add tab content
{activeTab === 'overview' && (
  <div>
    {/* Your existing overview content */}
  </div>
)}

{activeTab === 'insights' && (
  <div>
    {userTier === 'free' ? (
      <MarketingInsightsPaywall />
    ) : (
      <MarketingInsights
        paper={paper}
        categoryMatches={categoryMatches}
      />
    )}
  </div>
)}

{activeTab === 'business-plan' && (
  <div>
    {categoryMatches && categoryMatches.length > 0 ? (
      <BusinessPlanGenerator
        paper={paper}
        categoryMatch={categoryMatches[0]}
        selectedStrategy={/* Get from profitInsights.ts */}
        userTier={userTier}
        freeGenerationsRemaining={freeGensRemaining}
      />
    ) : (
      <p>Select a monetization strategy to generate a business plan</p>
    )}
  </div>
)}

{/* Add upgrade modal */}
<UpgradeModal
  isOpen={showUpgradeModal}
  onClose={() => setShowUpgradeModal(false)}
  currentTier={userTier}
/>
```

---

## Step 2: Create User Subscription Status Endpoint

**File:** `src/app/api/user/subscription-status/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      tier: user.subscription_tier,
      status: user.subscription_status,
      freeGenerationsRemaining: user.free_business_plans_remaining,
      totalGenerated: user.business_plans_generated,
      subscriptionPeriodEnd: user.subscription_period_end,
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}
```

---

## Step 3: Add Upgrade CTAs Throughout App

**File:** `src/components/HomeFeed.tsx`

Add upgrade prompts in strategic locations:

```typescript
import { InlineUpgradePrompt } from './UpgradeModal';

// After showing first 10 papers for free users
{userTier === 'free' && filteredPapers.length > 10 && (
  <div className="my-6">
    <InlineUpgradePrompt
      feature="Unlock unlimited papers and marketing insights"
      tier="basic"
    />
  </div>
)}
```

---

## Step 4: Integrate Profit Insights Selection

**File:** `src/components/PaperDetail.tsx` (Business Plan Tab)

Show strategy selection before generating:

```typescript
import { generateProfitInsights } from '@/lib/profitInsights';
import { useState } from 'react';

// In component
const [selectedStrategy, setSelectedStrategy] = useState<ProfitStrategy | null>(null);
const profitInsights = generateProfitInsights(paper, categoryMatches);

// UI
{!selectedStrategy && profitInsights && (
  <div>
    <h3 className="text-lg font-semibold mb-4">Select a Strategy:</h3>
    <div className="space-y-3">
      {profitInsights.strategies.map((strategy, index) => (
        <button
          key={index}
          onClick={() => setSelectedStrategy(strategy)}
          className="w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md"
          style={{ borderColor: '#E2E8F0' }}
        >
          <h4 className="font-semibold mb-1">{strategy.title}</h4>
          <p className="text-sm mb-2" style={{ color: '#64748B' }}>
            {strategy.description}
          </p>
          <div className="flex gap-4 text-xs">
            <span style={{ color: '#10B981' }}>💰 {strategy.estimatedRevenue}</span>
            <span style={{ color: '#6366F1' }}>⏱️ {strategy.timeToMarket}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
)}

{selectedStrategy && (
  <BusinessPlanGenerator
    paper={paper}
    categoryMatch={categoryMatches[0]}
    selectedStrategy={selectedStrategy}
    userTier={userTier}
    freeGenerationsRemaining={freeGensRemaining}
    onComplete={(plan) => {
      // Handle completion
      console.log('Plan generated:', plan);
    }}
  />
)}
```

---

## Step 5: Add $0.99 Payment Flow

**File:** `src/components/BusinessPlanGenerator.tsx`

Update the payment handling:

```typescript
import { getStripe } from '@/lib/stripe/client';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Payment Modal Component
function PaymentModal({ paperId, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Purchase Business Plan</h3>
        <p className="mb-4" style={{ color: '#64748B' }}>
          One-time payment of <strong>$0.99</strong> for a comprehensive business plan
        </p>

        <form onSubmit={handleSubmit}>
          <PaymentElement />

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E2E8F0' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || loading}
              className="flex-1 px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
            >
              {loading ? 'Processing...' : 'Pay $0.99'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## Step 6: Update Environment Variables

**File:** `.env.local`

Make sure you have:

```bash
# Required for full functionality
POSTGRES_URL=your_postgres_url
STRIPE_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
ANTHROPIC_API_KEY=sk-ant-your_key

# Stripe Price IDs (from your Stripe dashboard)
STRIPE_BASIC_MONTHLY_PRICE_ID=price_xxxxx
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxxxx
STRIPE_ONE_TIME_BUSINESS_PLAN_PRICE_ID=price_xxxxx
```

---

## Step 7: Create Billing Dashboard Page

**File:** `src/app/dashboard/billing/page.tsx`

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { redirectToCustomerPortal } from '@/lib/stripe/client';

export default function BillingPage() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch('/api/user/subscription-status');
        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchSubscription();
    }
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

      {/* Current Plan */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold capitalize">{subscription?.tier || 'Free'}</p>
            {subscription?.tier !== 'free' && (
              <p className="text-sm" style={{ color: '#64748B' }}>
                Status: <span className="capitalize">{subscription?.status}</span>
              </p>
            )}
          </div>

          {subscription?.tier !== 'free' && (
            <button
              onClick={() => redirectToCustomerPortal()}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
            >
              Manage Subscription
            </button>
          )}
        </div>

        {subscription?.subscriptionPeriodEnd && (
          <p className="text-sm" style={{ color: '#64748B' }}>
            {subscription.status === 'active' ? 'Renews' : 'Expires'} on:{' '}
            {new Date(subscription.subscriptionPeriodEnd).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Usage Stats */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <h2 className="text-xl font-semibold mb-4">Usage This Month</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC' }}>
            <p className="text-sm mb-1" style={{ color: '#64748B' }}>Business Plans Generated</p>
            <p className="text-2xl font-bold">{subscription?.totalGenerated || 0}</p>
          </div>

          <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC' }}>
            <p className="text-sm mb-1" style={{ color: '#64748B' }}>Free Generations Left</p>
            <p className="text-2xl font-bold">{subscription?.freeGenerationsRemaining || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Step 8: Test the Complete Flow

### Testing Checklist:

**Free User Flow:**
- [ ] Sign up
- [ ] Browse papers
- [ ] Try to view marketing insights → see paywall
- [ ] Click "Start Free Trial"
- [ ] Complete Stripe checkout (use test card: 4242 4242 4242 4242)
- [ ] Return to app, verify Basic subscription
- [ ] View marketing insights ✓
- [ ] Generate 1 business plan using free generation
- [ ] Try to generate another → see $0.99 prompt

**Basic User Flow:**
- [ ] View marketing insights
- [ ] Pay $0.99 for business plan
- [ ] Generate business plan
- [ ] View complete plan
- [ ] Try to upgrade to Premium

**Premium User Flow:**
- [ ] Generate unlimited business plans
- [ ] Export to PDF (when implemented)
- [ ] Manage subscription in billing dashboard

---

## Step 9: Deploy to Vercel

```bash
# 1. Commit your changes
git add .
git commit -m "Add monetization features"

# 2. Deploy to Vercel
vercel --prod

# 3. Set environment variables in Vercel dashboard
# Go to: Project Settings → Environment Variables
# Add all variables from .env.local

# 4. Set up Stripe webhook in production
# Stripe Dashboard → Webhooks → Add endpoint
# URL: https://your-domain.vercel.app/api/webhooks/stripe
# Add webhook secret to Vercel env vars
```

---

## Step 10: Launch Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Stripe products created and Price IDs added
- [ ] Stripe webhook configured
- [ ] Database initialized (`npm run db:init`)
- [ ] Test all payment flows with Stripe test mode
- [ ] Switch to Stripe live mode
- [ ] Test with real payment (yourself)
- [ ] Set up monitoring (Sentry recommended)
- [ ] Create terms of service & privacy policy
- [ ] Prepare launch announcement
- [ ] Set up customer support email

---

## Quick Reference: Key Files

| Feature | File |
|---------|------|
| Marketing Insights | `src/components/MarketingInsights.tsx` |
| Business Plan Gen | `src/components/BusinessPlanGenerator.tsx` |
| Upgrade Modal | `src/components/UpgradeModal.tsx` |
| Paper Detail | `src/components/PaperDetail.tsx` |
| Billing Dashboard | `src/app/dashboard/billing/page.tsx` |
| Subscription API | `src/app/api/user/subscription-status/route.ts` |
| Stripe Config | `src/lib/stripe/` |
| Database Queries | `src/lib/db/index.ts` |

---

## Need Help?

**Common Issues:**

1. **"Unauthorized" errors** → Check NextAuth session is working
2. **Stripe checkout not working** → Verify API keys are set
3. **Database errors** → Run `npm run db:init`
4. **AI features not working** → Add ANTHROPIC_API_KEY

**Next Steps:**
1. Follow this guide step by step
2. Test each feature as you integrate it
3. Deploy to Vercel when ready
4. Start getting paying customers!

---

You're ready to launch! 🚀
