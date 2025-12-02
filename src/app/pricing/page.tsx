'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSubscription } from '@/hooks';
import { PromoCodeInput } from '@/components/PromoCodeInput';

interface PricingTier {
  id: 'free' | 'standard' | 'pro' | 'enterprise';
  name: string;
  tagline: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: {
    category: string;
    items: string[];
  }[];
  cta: string;
  highlighted?: boolean;
  contactSales?: boolean;
}

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Discover AI research',
    price: { monthly: 0, annual: 0 },
    features: [
      {
        category: 'Discovery',
        items: [
          '5 AI analyses per month',
          'Basic category filtering',
          'Reading time estimates',
          'TL;DR summaries',
        ],
      },
      {
        category: 'Productivity',
        items: [
          'Dark mode',
          'Reader mode',
          'Social sharing',
          'Weekly digest',
        ],
      },
      {
        category: 'Business',
        items: [
          '3 business plans (one-time)',
          'Marketing insights preview',
          '10 bookmarks maximum',
        ],
      },
    ],
    cta: 'Current Plan',
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Turn research into revenue',
    price: { monthly: 4.99, annual: 49.99 },
    features: [
      {
        category: 'Analyses',
        items: [
          '25 AI analyses per month',
          'Advanced filtering',
          'Smart semantic search',
          'Unlimited bookmarks',
        ],
      },
      {
        category: 'Business Intelligence',
        items: [
          'Full marketing insights',
          'Pay-per-plan ($0.99 each)',
          'Commercial viability scoring',
          'Market size estimates',
        ],
      },
      {
        category: 'Productivity',
        items: [
          'Weekly email digests',
          'Reading history',
          'Export to PDF/Markdown',
          'Priority support',
        ],
      },
    ],
    cta: 'Start 7-Day Trial',
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Unlimited research power',
    price: { monthly: 9.99, annual: 99.99 },
    features: [
      {
        category: 'Unlimited Access',
        items: [
          'Unlimited AI analyses',
          'PDF deep analysis',
          'AI research assistant',
          'Trend analysis',
        ],
      },
      {
        category: 'Business Intelligence',
        items: [
          'Unlimited business plans',
          'Full marketing insights',
          'Patent potential scoring',
          'Custom reports',
        ],
      },
      {
        category: 'Premium Features',
        items: [
          'Daily email digests',
          'Custom alerts',
          'Bulk export (CSV/JSON)',
          'Priority support (24hr)',
        ],
      },
    ],
    cta: 'Start 7-Day Trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For teams and organizations',
    price: { monthly: 0, annual: 0 },
    features: [
      {
        category: 'Team Features',
        items: [
          'Unlimited team members',
          'Team workspaces',
          'Shared bookmarks & folders',
          'Admin dashboard',
        ],
      },
      {
        category: 'Integrations',
        items: [
          'Slack/Discord integration',
          'API access (custom limits)',
          'White-label reports',
          'SSO/SAML support',
        ],
      },
      {
        category: 'Support',
        items: [
          'Dedicated account manager',
          'Priority support (4hr)',
          'Custom onboarding',
          'SLA guarantee',
        ],
      },
    ],
    cta: 'Contact Sales',
    contactSales: true,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { subscription } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

  const currentTier = subscription?.tier || 'free';

  const handleSelectPlan = (tierId: string) => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/pricing');
      return;
    }

    if (tierId === 'free') {
      return; // Already on free plan
    }

    // Redirect to Stripe checkout with promo code if applied
    const params = new URLSearchParams({
      tier: tierId,
      billing: billingCycle,
    });

    if (appliedPromoCode) {
      params.set('promoCode', appliedPromoCode);
    }

    window.location.href = `/api/stripe/create-checkout-session?${params.toString()}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F3EF' }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'transparent', color: '#4A5568' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-bold" style={{ color: '#4A5568' }}>
            Pricing
          </h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#4A5568' }}>
          Choose Your Research Superpower
        </h2>
        <p className="text-lg mb-8" style={{ color: '#718096' }}>
          Turn AI research papers into profitable products and businesses
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span
            className={`text-sm font-medium ${billingCycle === 'monthly' ? '' : 'opacity-50'}`}
            style={{ color: '#4A5568' }}
          >
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="relative w-16 h-8 rounded-full transition-colors"
            style={{
              backgroundColor: billingCycle === 'annual' ? '#9EDCE1' : '#CBD5E0',
            }}
          >
            <div
              className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300"
              style={{
                left: billingCycle === 'annual' ? 'calc(100% - 28px)' : '4px',
              }}
            />
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${billingCycle === 'annual' ? '' : 'opacity-50'}`}
              style={{ color: '#4A5568' }}
            >
              Annual
            </span>
            <span
              className="px-2 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: '#DAF4EF', color: '#065F46' }}
            >
              Save 17%
            </span>
          </div>
        </div>

        {/* Promo Code Input */}
        {session && (
          <div className="max-w-md mx-auto mb-8">
            <PromoCodeInput onPromoApplied={(discount) => setAppliedPromoCode(discount.code)} />
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {TIERS.map((tier) => {
            const isCurrentTier = currentTier === tier.id;
            const isEnterprise = tier.contactSales;
            const monthlyPrice = billingCycle === 'annual' && tier.price.annual > 0
              ? tier.price.annual / 12
              : tier.price.monthly;

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-6 text-left transition-all ${
                  tier.highlighted ? 'shadow-2xl scale-105 z-10' : 'shadow-lg'
                }`}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: tier.highlighted ? '2px solid #9EDCE1' : '1px solid #E2E8F0',
                }}
              >
                {tier.highlighted && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#9EDCE1', color: '#FFFFFF' }}
                  >
                    Most Popular
                  </div>
                )}

                {isCurrentTier && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#DAF4EF', color: '#065F46' }}
                  >
                    Current
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2" style={{ color: '#4A5568' }}>
                  {tier.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: '#718096' }}>
                  {tier.tagline}
                </p>

                <div className="mb-4">
                  {isEnterprise ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold" style={{ color: '#4A5568' }}>
                        Custom
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold" style={{ color: '#4A5568' }}>
                          ${monthlyPrice.toFixed(monthlyPrice % 1 === 0 ? 0 : 2)}
                        </span>
                        <span className="text-sm" style={{ color: '#718096' }}>
                          /mo
                        </span>
                      </div>
                      {billingCycle === 'annual' && tier.price.annual > 0 && (
                        <p className="text-xs mt-1" style={{ color: '#718096' }}>
                          ${tier.price.annual.toFixed(2)}/year
                        </p>
                      )}
                    </>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(tier.id)}
                  disabled={isCurrentTier && tier.id === 'free'}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    !(isCurrentTier && tier.id === 'free') && 'hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    backgroundColor: isCurrentTier && tier.id === 'free' ? '#E2E8F0' : tier.highlighted ? '#9EDCE1' : '#EFECE6',
                    color: isCurrentTier && tier.id === 'free' ? '#718096' : '#4A5568',
                    cursor: isCurrentTier && tier.id === 'free' ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isCurrentTier && tier.id === 'free' ? 'Current Plan' : tier.cta}
                </button>

                <div className="mt-6 space-y-4">
                  {tier.features.map((category, idx) => (
                    <div key={idx}>
                      <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9EDCE1' }}>
                        {category.category}
                      </h4>
                      <ul className="space-y-1.5">
                        {category.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2 text-sm" style={{ color: '#4A5568' }}>
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#9EDCE1' }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Signals */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="text-center">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-semibold mb-1" style={{ color: '#4A5568' }}>7-Day Free Trial</h3>
            <p className="text-sm" style={{ color: '#718096' }}>Try all features risk-free</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold mb-1" style={{ color: '#4A5568' }}>Cancel Anytime</h3>
            <p className="text-sm" style={{ color: '#718096' }}>No long-term commitment</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1" style={{ color: '#4A5568' }}>Instant Access</h3>
            <p className="text-sm" style={{ color: '#718096' }}>Upgrade or downgrade anytime</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto text-left">
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#4A5568' }}>
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {[
              {
                q: 'Can I try paid plans before committing?',
                a: 'Yes! Standard and Pro plans include a 7-day free trial. You can cancel anytime during the trial.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards and debit cards through our secure Stripe integration.',
              },
              {
                q: 'Can I cancel my subscription?',
                a: 'Absolutely! You can cancel anytime from your account settings. You\'ll keep access until the end of your billing period.',
              },
              {
                q: 'What happens to my data if I downgrade?',
                a: 'All your bookmarks, searches, and history are preserved. You\'ll just lose access to premium features.',
              },
              {
                q: 'What\'s the difference between Standard and Pro?',
                a: 'Standard gives you 25 analyses/month and marketing insights. Pro gives you unlimited analyses and business plan generation.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="rounded-xl p-4 cursor-pointer group"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
              >
                <summary className="font-semibold flex items-center justify-between" style={{ color: '#4A5568' }}>
                  {faq.q}
                  <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm" style={{ color: '#718096' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
