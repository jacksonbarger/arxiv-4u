'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks';

export function SubscriptionManager() {
  const { data: session } = useSession();
  const router = useRouter();
  const { subscription, isLoading } = useSubscription();
  const [canceling, setCanceling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!session) {
    return (
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#4A5568' }}>
          Subscription
        </h2>
        <p className="text-sm" style={{ color: '#718096' }}>
          Please sign in to manage your subscription.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#9EDCE1] border-t-transparent rounded-full animate-spin" />
          <span style={{ color: '#718096' }}>Loading subscription...</span>
        </div>
      </div>
    );
  }

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      alert('✅ Subscription canceled successfully! You&apos;ll have access until the end of your billing period.');
      window.location.reload();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('❌ Failed to cancel subscription. Please try again or contact support.');
    } finally {
      setCanceling(false);
      setShowCancelConfirm(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Failed to open billing portal');
    }
  };

  // Calculate days remaining in trial
  const getDaysUntilCharge = () => {
    if (!subscription?.trialEnd) return null;
    const now = new Date();
    const trialEnd = new Date(subscription.trialEnd);
    const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  const daysUntilCharge = getDaysUntilCharge();
  const isOnTrial = subscription?.status === 'trialing';
  const isActive = subscription?.status === 'active';
  const isCanceled = subscription?.status === 'canceled';

  return (
    <div className="rounded-2xl p-6 space-y-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
      <div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#4A5568' }}>
          Subscription
        </h2>
        <p className="text-sm" style={{ color: '#718096' }}>
          Manage your subscription and billing
        </p>
      </div>

      {/* Current Plan */}
      <div className="p-4 rounded-xl" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg" style={{ color: '#4A5568' }}>
              {subscription?.tier === 'premium' ? 'Premium' : subscription?.tier === 'basic' ? 'Professional' : 'Explorer'} Plan
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isOnTrial ? '#F59E0B' : isActive ? '#10B981' : isCanceled ? '#EF4444' : '#9CA3AF',
                }}
              />
              <span className="text-sm font-medium" style={{ color: '#718096' }}>
                {isOnTrial ? 'Free Trial' : isActive ? 'Active' : isCanceled ? 'Canceled' : subscription?.tier === 'free' ? 'Free Plan' : 'Unknown'}
              </span>
            </div>
          </div>
          {subscription?.tier !== 'free' && (
            <div className="text-right">
              <p className="text-2xl font-bold" style={{ color: '#4A5568' }}>
                ${subscription?.tier === 'premium' ? '39' : '12'}
              </p>
              <p className="text-xs" style={{ color: '#718096' }}>
                per month
              </p>
            </div>
          )}
        </div>

        {/* Trial Warning */}
        {isOnTrial && daysUntilCharge !== null && (
          <div
            className="p-4 rounded-lg border-l-4 mt-4"
            style={{
              backgroundColor: '#FEF3C7',
              borderColor: '#F59E0B',
            }}
          >
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: '#92400E' }}>
                  Trial ends in {daysUntilCharge} day{daysUntilCharge !== 1 ? 's' : ''}
                </p>
                <p className="text-sm mt-1" style={{ color: '#92400E', opacity: 0.8 }}>
                  You&apos;ll be charged ${subscription?.tier === 'premium' ? '39' : '12'}/month unless you cancel before {new Date(subscription.trialEnd).toLocaleDateString()}.
                  Cancel anytime to avoid charges.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Canceled Status */}
        {isCanceled && subscription?.currentPeriodEnd && (
          <div
            className="p-4 rounded-lg border-l-4 mt-4"
            style={{
              backgroundColor: '#FEE2E2',
              borderColor: '#EF4444',
            }}
          >
            <p className="text-sm font-medium" style={{ color: '#991B1B' }}>
              Subscription canceled. Access until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Next Billing Date */}
        {isActive && subscription?.currentPeriodEnd && (
          <p className="text-sm mt-4" style={{ color: '#718096' }}>
            Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {subscription?.tier === 'free' ? (
          <button
            onClick={() => router.push('/pricing')}
            className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#9EDCE1', color: '#FFFFFF' }}
          >
            Upgrade Plan
          </button>
        ) : (
          <>
            {!isCanceled && (
              <>
                <button
                  onClick={handleManageBilling}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#9EDCE1', color: '#FFFFFF' }}
                >
                  Manage Billing
                </button>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#EFECE6', color: '#EF4444' }}
                >
                  Cancel Subscription
                </button>
              </>
            )}
            {isCanceled && (
              <button
                onClick={() => router.push('/pricing')}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
              >
                Reactivate Subscription
              </button>
            )}
          </>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#4A5568' }}>
              Cancel Subscription?
            </h3>
            <p className="text-sm mb-6" style={{ color: '#718096' }}>
              {isOnTrial ? (
                <>
                  Your trial will end immediately and you won&apos;t be charged.
                  You can always upgrade again later.
                </>
              ) : (
                <>
                  You&apos;ll keep access until {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'the end of your billing period'}.
                  No refunds will be issued for the current period.
                </>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={canceling}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: '#EFECE6', color: '#4A5568' }}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
              >
                {canceling ? 'Canceling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
