'use client';

import { useRouter } from 'next/navigation';

interface UsageMeterProps {
  current: number;
  limit: number;
  type: 'business-plans' | 'bookmarks' | 'searches';
  tier: 'free' | 'basic' | 'premium';
}

const TYPE_LABELS = {
  'business-plans': 'Business Plans',
  'bookmarks': 'Bookmarks',
  'searches': 'Saved Searches',
};

const TYPE_ICONS = {
  'business-plans': '📊',
  'bookmarks': '🔖',
  'searches': '🔍',
};

const UPGRADE_BENEFITS = {
  'business-plans': {
    basic: 'Unlimited business plans',
    premium: 'Unlimited + AI templates',
  },
  'bookmarks': {
    basic: 'Unlimited bookmarks + folders',
    premium: 'Unlimited + team sharing',
  },
  'searches': {
    basic: '50 saved searches',
    premium: 'Unlimited searches + alerts',
  },
};

export function UsageMeter({ current, limit, type, tier }: UsageMeterProps) {
  const router = useRouter();
  const percentage = (current / limit) * 100;
  const remaining = limit - current;
  const isNearLimit = percentage >= 70;
  const isAtLimit = current >= limit;

  // Premium users don't see meters (unlimited)
  if (tier === 'premium') return null;

  // Basic users only see meters for features they don't have unlimited access to
  if (tier === 'basic' && (type === 'business-plans' || type === 'bookmarks')) return null;

  const getColor = () => {
    if (isAtLimit) return {
      bg: '#FEE2E2',
      bar: '#EF4444',
      text: '#991B1B',
    };
    if (isNearLimit) return {
      bg: '#FEF3C7',
      bar: '#F59E0B',
      text: '#92400E',
    };
    return {
      bg: '#DBEAFE',
      bar: '#3B82F6',
      text: '#1E40AF',
    };
  };

  const colors = getColor();
  const nextTier = tier === 'free' ? 'basic' : 'premium';
  const benefit = UPGRADE_BENEFITS[type][nextTier];

  if (isAtLimit) {
    return (
      <div
        className="p-6 rounded-2xl mb-6 border-2"
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.bar,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <span className="text-2xl">{TYPE_ICONS[type]}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text }}>
              {TYPE_LABELS[type]} Limit Reached
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.text, opacity: 0.8 }}>
              You&apos;ve used all {limit} {TYPE_LABELS[type].toLowerCase()} this month.
              Upgrade to get {benefit.toLowerCase()}.
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{
                backgroundColor: '#9EDCE1',
                color: '#4A5568',
              }}
            >
              Upgrade to {nextTier === 'basic' ? 'Basic' : 'Premium'} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-xl mb-4"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{TYPE_ICONS[type]}</span>
          <span className="font-medium text-sm" style={{ color: colors.text }}>
            {TYPE_LABELS[type]}
          </span>
        </div>
        <span className="text-xs font-semibold" style={{ color: colors.text }}>
          {remaining} left
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full mb-2 overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: colors.bar,
          }}
        />
      </div>

      {isNearLimit && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: colors.text, opacity: 0.8 }}>
            Running low? Get {benefit.toLowerCase()}
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="text-xs font-semibold underline"
            style={{ color: colors.text }}
          >
            Upgrade
          </button>
        </div>
      )}
    </div>
  );
}

// Compact version for header/sidebar
export function UsageMeterCompact({ current, limit, type, tier }: UsageMeterProps) {
  const router = useRouter();
  const percentage = (current / limit) * 100;
  const remaining = limit - current;
  const isAtLimit = current >= limit;

  if (tier === 'premium') return null;
  if (tier === 'basic' && (type === 'business-plans' || type === 'bookmarks')) return null;

  if (isAtLimit) {
    return (
      <button
        onClick={() => router.push('/pricing')}
        className="flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-xs font-medium"
        style={{
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
      >
        <span>{TYPE_ICONS[type]}</span>
        <span>0/{limit} left - Upgrade</span>
      </button>
    );
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-full text-xs"
      style={{
        backgroundColor: percentage >= 70 ? '#FEF3C7' : '#DBEAFE',
        color: percentage >= 70 ? '#92400E' : '#1E40AF',
      }}
    >
      <span>{TYPE_ICONS[type]}</span>
      <div className="flex items-center gap-1.5">
        <div
          className="w-12 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div
            className="h-full transition-all"
            style={{
              width: `${percentage}%`,
              backgroundColor: percentage >= 70 ? '#F59E0B' : '#3B82F6',
            }}
          />
        </div>
        <span className="font-semibold">{remaining}</span>
      </div>
    </div>
  );
}
