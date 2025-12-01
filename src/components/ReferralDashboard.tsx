'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/Toast';

interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  successfulReferrals: number;
  totalRewardsEarned: number;
  pendingRewards: number;
  recentReferrals: Array<{
    email: string;
    status: string;
    createdAt: string;
  }>;
}

export function ReferralDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const fetchReferralStats = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch('/api/referrals/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch referral stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const copyReferralLink = async () => {
    if (!stats?.referralCode) return;

    const referralUrl = `${window.location.origin}?ref=${stats.referralCode}`;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      showToast('Referral link copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy link', 'error');
    }
  };

  const shareViaEmail = () => {
    if (!stats?.referralCode) return;

    const subject = 'Try Arxiv-4U - Get AI research insights';
    const body = `Hey! I've been using Arxiv-4U to discover and analyze AI research papers. It's amazing!

Use my referral code to get started: ${stats.referralCode}

Sign up here: ${window.location.origin}?ref=${stats.referralCode}

You'll get insights like commercial viability scores, business plans, and marketing strategies for any arXiv paper!`;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast('Opening email client...', 'info');
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-2 border-[#9EDCE1] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: '#718096' }}>Failed to load referral stats</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#2D3748' }}>
          Refer & Earn
        </h2>
        <p className="text-sm" style={{ color: '#718096' }}>
          Get <span className="font-semibold" style={{ color: '#9EDCE1' }}>1 free month</span> for every friend who subscribes!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #9EDCE1 0%, #C0E5E8 100%)',
            boxShadow: '0 4px 12px rgba(158, 220, 225, 0.2)',
          }}
        >
          <div className="text-3xl font-bold mb-1" style={{ color: '#FFFFFF' }}>
            {stats.totalReferrals}
          </div>
          <div className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Total Referrals
          </div>
        </div>

        <div
          className="p-4 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
          }}
        >
          <div className="text-3xl font-bold mb-1" style={{ color: '#FFFFFF' }}>
            {stats.successfulReferrals}
          </div>
          <div className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Successful
          </div>
        </div>

        <div
          className="p-4 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
          }}
        >
          <div className="text-3xl font-bold mb-1" style={{ color: '#FFFFFF' }}>
            {stats.totalRewardsEarned}
          </div>
          <div className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Months Earned
          </div>
        </div>

        <div
          className="p-4 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
          }}
        >
          <div className="text-3xl font-bold mb-1" style={{ color: '#FFFFFF' }}>
            {stats.pendingRewards}
          </div>
          <div className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Pending
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F7FAFC 100%)',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        }}
      >
        <h3 className="font-bold mb-4" style={{ color: '#2D3748' }}>
          Your Referral Code
        </h3>

        <div className="space-y-3">
          {/* Code Display */}
          <div
            className="flex items-center justify-between p-4 rounded-xl border-2"
            style={{
              backgroundColor: '#F7FAFC',
              borderColor: '#9EDCE1',
            }}
          >
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: '#718096' }}>
                Your unique code
              </p>
              <p className="text-2xl font-bold tracking-wider" style={{ color: '#2D3748' }}>
                {stats.referralCode}
              </p>
            </div>
            <button
              onClick={copyReferralLink}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: copied ? '#10B981' : '#9EDCE1',
                color: '#FFFFFF',
                boxShadow: copied ? '0 2px 8px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(158, 220, 225, 0.3)',
              }}
            >
              {copied ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </span>
              )}
            </button>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareViaEmail}
              className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#4A5568',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Share via Email
            </button>

            <button
              onClick={() => {
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out Arxiv-4U for AI research insights! Use my code ${stats.referralCode} to get started: ${window.location.origin}?ref=${stats.referralCode}`)}`;
                window.open(url, '_blank', 'width=550,height=420');
                showToast('Opening X...', 'info');
              }}
              className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
              }}
            >
              <span className="text-base font-bold">𝕏</span>
              Share on X
            </button>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div
        className="p-6 rounded-2xl"
        style={{
          backgroundColor: '#ECFDF5',
          border: '1px solid #D1FAE5',
        }}
      >
        <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#065F46' }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How It Works
        </h3>
        <ol className="space-y-2 text-sm" style={{ color: '#059669' }}>
          <li className="flex gap-2">
            <span className="font-bold">1.</span>
            <span>Share your unique referral code with friends</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">2.</span>
            <span>They sign up and subscribe using your code</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">3.</span>
            <span>You both get 1 free month added to your account!</span>
          </li>
        </ol>
      </div>

      {/* Recent Referrals */}
      {stats.recentReferrals && stats.recentReferrals.length > 0 && (
        <div
          className="p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F7FAFC 100%)',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          <h3 className="font-bold mb-4" style={{ color: '#2D3748' }}>
            Recent Referrals
          </h3>
          <div className="space-y-3">
            {stats.recentReferrals.map((referral, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: '#F7FAFC' }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2D3748' }}>
                    {referral.email}
                  </p>
                  <p className="text-xs" style={{ color: '#718096' }}>
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: referral.status === 'converted' ? '#D1FAE5' : '#FEF3C7',
                    color: referral.status === 'converted' ? '#065F46' : '#92400E',
                  }}
                >
                  {referral.status === 'converted' ? '✓ Subscribed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
