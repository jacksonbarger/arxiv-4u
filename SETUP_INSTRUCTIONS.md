# Arxiv-4U Setup Instructions

## 🚀 Complete Setup Guide for Production-Ready Launch

This guide will walk you through setting up Arxiv-4U with full monetization capabilities.

---

## Phase 1: Database Setup (Week 1)

### Step 1.1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Select your `arxiv-4u` project
   - Navigate to **Storage** tab
   - Click **Create Database**
   - Choose **Postgres**
   - Name it `arxiv-4u-production`
   - Select region closest to your users
   - Click **Create**

2. **Pull Environment Variables:**
   ```bash
   cd /path/to/arxiv-4u
   vercel env pull .env.local
   ```

   This automatically adds:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - All other Postgres connection strings

3. **Initialize Database Schema:**
   ```bash
   npm run db:init
   ```

   Expected output: ✅ 9 tables created successfully

4. **Migrate Existing Users (if any):**
   ```bash
   npm run db:migrate
   ```

### Step 1.2: Verify Database

1. Open Vercel Dashboard → Storage → Postgres → Data tab
2. Verify tables exist: `users`, `subscriptions`, `business_plans`, etc.
3. Check that `users` table has `free_business_plans_remaining = 3`

✅ **Checkpoint:** Database is ready!

---

## Phase 2: Stripe Setup (Week 1)

### Step 2.1: Create Stripe Account

1. **Sign up for Stripe:**
   - Go to https://dashboard.stripe.com/register
   - Use your business email
   - Complete verification

2. **Get API Keys:**
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy **Publishable key** (starts with `pk_test_`)
   - Copy **Secret key** (starts with `sk_test_`)
   - Add to `.env.local`:
     ```
     STRIPE_SECRET_KEY=sk_test_xxxxx
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
     ```

### Step 2.2: Create Products in Stripe

1. **Basic Subscription ($9.99/month):**
   - Go to https://dashboard.stripe.com/test/products
   - Click **+ Add product**
   - Name: `Arxiv-4U Basic`
   - Description: `Marketing insights and unlimited bookmarks`
   - **Pricing:**
     - Recurring: Monthly
     - Price: $9.99 USD
     - Trial period: 7 days
   - Click **Save product**
   - **Copy the Price ID** (starts with `price_`)
   - Add to `.env.local`:
     ```
     STRIPE_BASIC_MONTHLY_PRICE_ID=price_xxxxx
     ```

2. **Premium Subscription ($24.99/month):**
   - Click **+ Add product**
   - Name: `Arxiv-4U Premium`
   - Description: `Everything in Basic + AI Business Plan Generator`
   - **Pricing:**
     - Recurring: Monthly
     - Price: $24.99 USD
     - Trial period: 7 days
   - Click **Save product**
   - **Copy the Price ID**
   - Add to `.env.local`:
     ```
     STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxxxx
     ```

3. **One-Time Business Plan ($0.99):**
   - Click **+ Add product**
   - Name: `Business Plan (Single Paper)`
   - Description: `AI-generated business plan for one research paper`
   - **Pricing:**
     - One-time
     - Price: $0.99 USD
   - Click **Save product**
   - **Copy the Price ID**
   - Add to `.env.local`:
     ```
     STRIPE_ONE_TIME_BUSINESS_PLAN_PRICE_ID=price_xxxxx
     ```

### Step 2.3: Configure Webhooks

1. **Create Webhook Endpoint:**
   - Go to https://dashboard.stripe.com/test/webhooks
   - Click **+ Add endpoint**
   - Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
     *(Replace with your actual Vercel domain)*
   - **Select events to listen to:**
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Click **Add endpoint**
   - **Copy the Signing secret** (starts with `whsec_`)
   - Add to `.env.local`:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_xxxxx
     ```

2. **Add to Vercel Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all Stripe keys (Secret, Publishable, Webhook Secret, Price IDs)
   - Select environments: Production, Preview, Development

✅ **Checkpoint:** Stripe is configured!

---

## Phase 3: AI Integration (Week 2)

### Step 3.1: Get Anthropic API Key

1. **Sign up for Anthropic:**
   - Go to https://console.anthropic.com/
   - Sign up or log in
   - Navigate to **API Keys**
   - Click **Create Key**
   - Name it `Arxiv-4U Production`
   - **Copy the API key** (starts with `sk-ant-`)
   - Add to `.env.local`:
     ```
     ANTHROPIC_API_KEY=sk-ant-xxxxx
     ```

2. **Add to Vercel:**
   - Vercel Dashboard → Settings → Environment Variables
   - Add `ANTHROPIC_API_KEY`
   - Apply to all environments

3. **Set up Billing:**
   - Go to https://console.anthropic.com/settings/billing
   - Add payment method
   - Set usage limits (recommended: $100/month to start)
   - Enable auto-reload

### Step 3.2: Optional - Web Search API

For enhanced market research in business plans:

**Option A: Brave Search (Recommended)**
1. Go to https://brave.com/search/api/
2. Sign up for API access
3. Get API key
4. Add to `.env.local`:
   ```
   BRAVE_SEARCH_API_KEY=BSAxxxxx
   ```

**Option B: Serper**
1. Go to https://serper.dev/
2. Sign up
3. Get API key
4. Add to `.env.local`:
   ```
   SERPER_API_KEY=xxxxx
   ```

✅ **Checkpoint:** AI services configured!

---

## Phase 4: Email CRM (Week 2)

### Step 4.1: Choose Email Platform

**Recommended: Loops.so (Best for startups)**

1. **Sign up:**
   - Go to https://loops.so/
   - Sign up for account
   - Free up to 2,000 contacts

2. **Get API Key:**
   - Dashboard → Settings → API
   - Create new key
   - Add to `.env.local`:
     ```
     LOOPS_API_KEY=xxxxx
     ```

3. **Create Email Sequences:**
   - Dashboard → Loops (sequences)
   - Create sequences for:
     - Welcome/Onboarding (5 emails over 7 days)
     - Trial Nurture (3 emails during trial)
     - Engagement (weekly digest)

**Alternative: Customer.io (More features)**

1. Sign up at https://customer.io/
2. Get API credentials
3. Add to `.env.local`:
   ```
   CUSTOMERIO_API_KEY=xxxxx
   CUSTOMERIO_SITE_ID=xxxxx
   ```

✅ **Checkpoint:** Email automation ready!

---

## Phase 5: Deploy to Production (Week 3)

### Step 5.1: Test Locally

```bash
# Install dependencies
npm install

# Initialize database
npm run db:init

# Start dev server
npm run dev
```

Visit http://localhost:3001 and test:
- [ ] User signup
- [ ] Email verification
- [ ] Browse papers
- [ ] Bookmark papers
- [ ] View marketing insights (after integrating UI)

### Step 5.2: Deploy to Vercel

```bash
# Build production version
npm run build

# Deploy
vercel --prod
```

### Step 5.3: Configure Production Domain

1. Vercel Dashboard → Settings → Domains
2. Add custom domain (e.g., `arxiv-4u.com`)
3. Configure DNS records
4. Wait for SSL certificate

### Step 5.4: Update Environment Variables

Update these in Vercel for production:
- `NEXTAUTH_URL` → `https://your-domain.com`
- `NEXT_PUBLIC_APP_URL` → `https://your-domain.com`
- Stripe webhook URL → `https://your-domain.com/api/webhooks/stripe`

✅ **Checkpoint:** App is live!

---

## Phase 6: Testing & Launch (Week 4)

### Step 6.1: Test Payment Flows

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

Test scenarios:
- [ ] Free user signs up
- [ ] User starts Basic trial
- [ ] User starts Premium trial
- [ ] User purchases $0.99 business plan
- [ ] Trial converts to paid
- [ ] User cancels subscription
- [ ] Payment fails

### Step 6.2: Verify Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Check webhook events are being received
3. Verify events return 200 OK
4. Test subscription lifecycle

### Step 6.3: Load Testing

1. Use 3 free business plan generations
2. Verify paywall appears
3. Purchase $0.99 plan
4. Verify plan is accessible
5. Subscribe to Premium
6. Generate multiple plans
7. Verify fair use policy

✅ **Checkpoint:** Ready for beta users!

---

## Post-Launch Checklist

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Enable Vercel Analytics
- [ ] Monitor Stripe Dashboard daily
- [ ] Track email open rates
- [ ] Monitor AI API costs

### Support

- [ ] Set up support email (support@your-domain.com)
- [ ] Create help documentation
- [ ] Set up chat support (Intercom or similar)

### Marketing

- [ ] Prepare Product Hunt launch
- [ ] Write launch blog post
- [ ] Create social media content
- [ ] Reach out to beta users
- [ ] Set up referral program

### Legal

- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie Policy
- [ ] GDPR compliance (if EU users)

---

## Troubleshooting

### Database Connection Errors

```bash
# Re-pull environment variables
vercel env pull .env.local --force

# Restart dev server
npm run dev
```

### Stripe Webhook Not Working

1. Check webhook URL is correct
2. Verify endpoint is deployed
3. Check Stripe Dashboard → Webhooks for errors
4. Ensure `STRIPE_WEBHOOK_SECRET` is set

### AI API Errors

1. Verify `ANTHROPIC_API_KEY` is set
2. Check API key has sufficient credits
3. Monitor usage at https://console.anthropic.com/

---

## Cost Estimates

**Monthly Operating Costs (100 paid users):**

| Service | Cost |
|---------|------|
| Vercel Pro | $20 |
| Vercel Postgres | $10-50 |
| Stripe fees (2.9% + $0.30) | ~$40 |
| Anthropic API | $100-300 |
| Email CRM (Loops) | $0-50 |
| Total | **$170-460/month** |

**Revenue (100 paid users):**
- 50 Basic ($9.99) = $499.50
- 50 Premium ($24.99) = $1,249.50
- **Total: $1,749/month**

**Profit: ~$1,300/month** 🎉

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Anthropic Docs:** https://docs.anthropic.com/
- **Next.js Docs:** https://nextjs.org/docs

Need help? Create an issue on GitHub or contact support.

---

**Last Updated:** December 2024
**Version:** 1.0.0
