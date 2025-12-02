'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSubscription } from '@/hooks';
import { PromoCodeInput } from '@/components/PromoCodeInput';
import { EnterpriseContactForm } from '@/components/EnterpriseContactForm';
import { Modal, useDisclosure } from '@heroui/react';

interface PricingTier {
  id: 'free' | 'basic' | 'premium';
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
}

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Explorer',
    tagline: 'Discover AI research',
    price: { monthly: 0, annual: 0 },
    features: [
      {
        category: 'Discovery',
        items: [
          '50 papers per day',
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
          '3 business plans/month',
          'Marketing insights preview',
          '10 bookmarks maximum',
        ],
      },
    ],
    cta: 'Current Plan',
  },
  {
    id: 'basic',
    name: 'Professional',
    tagline: 'Turn research into revenue',
    price: { monthly: 12, annual: 120 },
    features: [
      {
        category: 'Unlimited Access',
        items: [
          'Unlimited papers',
          'Advanced filtering',
          'Smart semantic search',
          'Unlimited bookmarks + folders',
        ],
      },
      {
        category: 'Business Intelligence',
        items: [
          'Full marketing insights',
          'Unlimited business plans',
          'Commercial viability scoring',
          'Market size estimates',
        ],
      },
      {
        category: 'Productivity',
        items: [
          'Daily email digests',
          'Custom alerts',
          'Export to PDF/Markdown',
          'Reading history',
        ],
      },
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Enterprise',
    tagline: 'AI-powered research intelligence',
    price: { monthly: 39, annual: 390 },
    features: [
      {
        category: 'Advanced Intelligence',
        items: [
          'PDF deep analysis',
          'AI research assistant',
          'Trend analysis',
          'Patent potential scoring',
        ],
      },
      {
        category: 'Team Collaboration',
        items: [
          'Unlimited team members',
          'Team workspaces',
          'Slack/Discord integration',
          'White-label reports',
        ],
      },
      {
        category: 'Enterprise',
        items: [
          'API access (1000 req/mo)',
          'Bulk export (CSV/JSON)',
          'Priority support (4hr)',
          'Custom features',
        ],
      },
    ],
    cta: 'Start Free Trial',
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
            <PromoCodeInput onPromoApplied={setAppliedPromoCode} />
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {TIERS.map((tier) => {
            const isCurrentTier = currentTier === tier.id;
            const price = billingCycle === 'monthly' ? tier.price.monthly : tier.price.annual;
            const monthlyPrice = billingCycle === 'annual' ? tier.price.annual / 12 : price;

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-8 text-left transition-all ${
                  tier.highlighted ? 'shadow-2xl scale-105' : 'shadow-lg'
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

                <h3 className="text-2xl font-bold mb-2" style={{ color: '#4A5568' }}>
                  {tier.name}
                </h3>
                <p className="text-sm mb-6" style={{ color: '#718096' }}>
                  {tier.tagline}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold" style={{ color: '#4A5568' }}>
                      ${Math.floor(monthlyPrice)}
                    </span>
                    <span className="text-sm" style={{ color: '#718096' }}>
                      /month
                    </span>
                  </div>
                  {billingCycle === 'annual' && tier.price.annual > 0 && (
                    <p className="text-xs mt-1" style={{ color: '#718096' }}>
                      Billed ${tier.price.annual} annually
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(tier.id)}
                  disabled={isCurrentTier}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    !isCurrentTier && 'hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    backgroundColor: isCurrentTier ? '#E2E8F0' : tier.highlighted ? '#9EDCE1' : '#EFECE6',
                    color: isCurrentTier ? '#718096' : '#4A5568',
                    cursor: isCurrentTier ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isCurrentTier ? tier.cta : tier.id === 'free' ? 'Get Started' : tier.cta}
                </button>

                <div className="mt-8 space-y-6">
                  {tier.features.map((category, idx) => (
                    <div key={idx}>
                      <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9EDCE1' }}>
                        {category.category}
                      </h4>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2 text-sm" style={{ color: '#4A5568' }}>
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#9EDCE1' }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{item}</span>
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
            <h3 className="font-semibold mb-1" style={{ color: '#4A5568' }}>14-Day Free Trial</h3>
            <p className="text-sm" style={{ color: '#718096' }}>No credit card required</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold mb-1" style={{ color: '#4A5568' }}>Cancel Anytime</h3>
            <p className="text-sm" style={{ color: '#718096' }}>30-day money-back guarantee</p>
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
                q: 'Can I try Premium before paying?',
                a: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and PayPal through our secure Stripe integration.',
              },
              {
                q: 'Can I cancel my subscription?',
                a: 'Absolutely! You can cancel anytime from your account settings. You\'ll keep access until the end of your billing period.',
              },
              {
                q: 'What happens to my data if I downgrade?',
                a: 'All your bookmarks, searches, and history are preserved. You\'ll just lose access to premium features.',
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
