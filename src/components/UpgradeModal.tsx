'use client';

import { useState } from 'react';
import { redirectToCheckout, SUBSCRIPTION_TIERS } from '@/lib/stripe/client';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: 'free' | 'basic' | 'premium';
  reason?: string;
  highlightTier?: 'basic' | 'premium';
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentTier = 'free',
  reason,
  highlightTier = 'basic',
}: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (tier: 'basic' | 'premium') => {
    try {
      setLoading(true);
      setError(null);
      await redirectToCheckout(tier);
    } catch (err) {
      console.error('Error starting checkout:', err);
      setError('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  const basicTier = SUBSCRIPTION_TIERS.find((t) => t.id === 'basic')!;
  const premiumTier = SUBSCRIPTION_TIERS.find((t) => t.id === 'premium')!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-gray-100"
          aria-label="Close"
        >
          <svg className="w-6 h-6" style={{ color: '#64748B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-8 text-center border-b" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#1E293B' }}>
            Unlock Your Full Potential
          </h2>
          {reason && (
            <p className="text-lg" style={{ color: '#64748B' }}>
              {reason}
            </p>
          )}
          <p className="mt-2" style={{ color: '#64748B' }}>
            Start your <strong>7-day free trial</strong> - cancel anytime
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Tier */}
            <div
              className={`rounded-2xl p-6 transition-all ${
                highlightTier === 'basic' ? 'ring-2 shadow-lg' : ''
              }`}
              style={{
                borderColor: highlightTier === 'basic' ? '#3B82F6' : '#E2E8F0',
                border: highlightTier === 'basic' ? 'none' : '1px solid #E2E8F0',
                ringColor: '#3B82F6',
              }}
            >
              {highlightTier === 'basic' && (
                <div className="mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}
                  >
                    RECOMMENDED
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2" style={{ color: '#1E293B' }}>
                {basicTier.name}
              </h3>

              <div className="mb-4">
                <span className="text-4xl font-bold" style={{ color: '#1E293B' }}>
                  ${basicTier.price}
                </span>
                <span style={{ color: '#64748B' }}>/month</span>
              </div>

              <p className="mb-6" style={{ color: '#64748B' }}>
                Perfect for individual researchers and developers
              </p>

              <button
                onClick={() => handleUpgrade('basic')}
                disabled={loading || currentTier === 'basic'}
                className="w-full px-6 py-3 rounded-lg font-semibold mb-6 transition-all disabled:opacity-50"
                style={{
                  backgroundColor: highlightTier === 'basic' ? '#2563EB' : '#F1F5F9',
                  color: highlightTier === 'basic' ? '#FFFFFF' : '#475569',
                }}
              >
                {currentTier === 'basic' ? 'Current Plan' : 'Start Free Trial'}
              </button>

              <ul className="space-y-3">
                {basicTier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: '#475569', fontSize: '14px' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium Tier */}
            <div
              className={`rounded-2xl p-6 transition-all ${
                highlightTier === 'premium' ? 'ring-2 shadow-lg' : ''
              }`}
              style={{
                borderColor: highlightTier === 'premium' ? '#7C3AED' : '#E2E8F0',
                border: highlightTier === 'premium' ? 'none' : '1px solid #E2E8F0',
                ringColor: '#7C3AED',
                background: highlightTier === 'premium' ? 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' : '#FFFFFF',
              }}
            >
              {highlightTier === 'premium' && (
                <div className="mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#FFFFFF', color: '#7C3AED' }}
                  >
                    BEST VALUE
                  </span>
                </div>
              )}

              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: highlightTier === 'premium' ? '#FFFFFF' : '#1E293B' }}
              >
                {premiumTier.name}
              </h3>

              <div className="mb-4">
                <span
                  className="text-4xl font-bold"
                  style={{ color: highlightTier === 'premium' ? '#FFFFFF' : '#1E293B' }}
                >
                  ${premiumTier.price}
                </span>
                <span style={{ color: highlightTier === 'premium' ? '#E0E7FF' : '#64748B' }}>
                  /month
                </span>
              </div>

              <p
                className="mb-6"
                style={{ color: highlightTier === 'premium' ? '#E0E7FF' : '#64748B' }}
              >
                For serious entrepreneurs and businesses
              </p>

              <button
                onClick={() => handleUpgrade('premium')}
                disabled={loading || currentTier === 'premium'}
                className="w-full px-6 py-3 rounded-lg font-semibold mb-6 transition-all disabled:opacity-50"
                style={{
                  backgroundColor: highlightTier === 'premium' ? '#FFFFFF' : '#F1F5F9',
                  color: highlightTier === 'premium' ? '#7C3AED' : '#475569',
                }}
              >
                {currentTier === 'premium' ? 'Current Plan' : 'Start Free Trial'}
              </button>

              <ul className="space-y-3">
                {premiumTier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: highlightTier === 'premium' ? '#FFFFFF' : '#10B981' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span
                      style={{
                        color: highlightTier === 'premium' ? '#FFFFFF' : '#475569',
                        fontSize: '14px',
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
              <p style={{ color: '#991B1B' }}>{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 text-center border-t" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm" style={{ color: '#64748B' }}>
              ✓ Cancel anytime &nbsp;&nbsp; ✓ No long-term contracts &nbsp;&nbsp; ✓ Money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick inline upgrade prompts for throughout the app
export function InlineUpgradePrompt({ feature, tier = 'basic' }: { feature: string; tier?: 'basic' | 'premium' }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="rounded-xl p-4" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FCD34D' }}>
            <svg className="w-5 h-5" style={{ color: '#92400E' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1" style={{ color: '#92400E' }}>
              {tier === 'premium' ? 'Premium Feature' : 'Unlock This Feature'}
            </h4>
            <p className="text-sm mb-3" style={{ color: '#78350F' }}>
              {feature}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ backgroundColor: '#92400E', color: '#FFFFFF' }}
            >
              Upgrade to {tier === 'premium' ? 'Premium' : 'Basic'}
            </button>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        highlightTier={tier}
        reason={`Unlock ${feature}`}
      />
    </>
  );
}
