'use client';

import { useRouter } from 'next/navigation';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  upgradePrompt?: {
    tier: 'standard' | 'pro';
    benefit: string;
  };
}

export function EmptyState({ icon, title, description, action, upgradePrompt }: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
      {/* Icon */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-scaleIn"
        style={{
          backgroundColor: '#EFECE6',
          background: 'linear-gradient(135deg, #EFECE6 0%, #DEEBEB 100%)',
        }}
      >
        <span className="text-5xl">{icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-3" style={{ color: '#4A5568' }}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-base mb-8 max-w-md" style={{ color: '#718096' }}>
        {description}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <button
            onClick={action.onClick}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{
              backgroundColor: action.variant === 'secondary' ? '#EFECE6' : '#9EDCE1',
              color: '#4A5568',
            }}
          >
            {action.label}
          </button>
        )}

        {upgradePrompt && (
          <button
            onClick={() => router.push('/pricing')}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 border-2"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#9EDCE1',
              color: '#4A5568',
            }}
          >
            Upgrade to {upgradePrompt.tier === 'standard' ? 'Standard' : 'Pro'} →
          </button>
        )}
      </div>

      {/* Upgrade benefit */}
      {upgradePrompt && (
        <div
          className="mt-6 px-4 py-3 rounded-xl max-w-md animate-slideInRight"
          style={{ backgroundColor: '#DAF4EF' }}
        >
          <p className="text-sm font-medium" style={{ color: '#065F46' }}>
            ✨ {upgradePrompt.benefit}
          </p>
        </div>
      )}
    </div>
  );
}

// Pre-built empty states for common scenarios
export function EmptyBookmarks() {
  return (
    <EmptyState
      icon="🔖"
      title="No Bookmarks Yet"
      description="Save papers you want to read later or reference in your research. Your bookmarks will appear here."
      action={{
        label: 'Browse Papers',
        onClick: () => window.location.href = '/',
      }}
      upgradePrompt={{
        tier: 'standard',
        benefit: 'Upgrade to Standard for unlimited bookmarks and folders',
      }}
    />
  );
}

export function EmptySearchResults() {
  return (
    <EmptyState
      icon="🔍"
      title="No Papers Found"
      description="We couldn't find any papers matching your search. Try adjusting your filters or search terms."
      action={{
        label: 'Clear Filters',
        onClick: () => window.location.reload(),
        variant: 'secondary',
      }}
    />
  );
}

export function EmptyBusinessPlans() {
  return (
    <EmptyState
      icon="📊"
      title="No Business Plans Yet"
      description="Generate AI-powered business plans from research papers. Your saved plans will appear here."
      upgradePrompt={{
        tier: 'standard',
        benefit: 'Upgrade to Standard for unlimited business plan generation',
      }}
    />
  );
}

export function EmptySavedSearches() {
  return (
    <EmptyState
      icon="💾"
      title="No Saved Searches"
      description="Save your favorite search queries and filters to quickly access papers you care about."
      upgradePrompt={{
        tier: 'standard',
        benefit: 'Upgrade to Standard for 50 saved searches with auto-updates',
      }}
    />
  );
}

export function BookmarkLimitReached() {
  const router = useRouter();

  return (
    <div className="p-8 rounded-3xl text-center animate-scaleIn" style={{ backgroundColor: '#FEF3C7', border: '2px solid #F59E0B' }}>
      <div className="text-6xl mb-4">🔖</div>
      <h3 className="text-2xl font-bold mb-3" style={{ color: '#92400E' }}>
        Bookmark Limit Reached
      </h3>
      <p className="text-base mb-6 max-w-md mx-auto" style={{ color: '#92400E', opacity: 0.9 }}>
        You&apos;ve saved 10 bookmarks on the free plan. Upgrade to save unlimited papers and organize them in folders.
      </p>
      <button
        onClick={() => router.push('/pricing')}
        className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl"
        style={{ backgroundColor: '#F59E0B', color: '#FFFFFF' }}
      >
        Upgrade to Basic - Just $12/month
      </button>
      <p className="text-xs mt-4" style={{ color: '#92400E', opacity: 0.7 }}>
        14-day free trial • Cancel anytime
      </p>
    </div>
  );
}

export function BusinessPlanLimitReached() {
  const router = useRouter();

  return (
    <div className="p-8 rounded-3xl text-center animate-scaleIn" style={{ backgroundColor: '#DBEAFE', border: '2px solid #3B82F6' }}>
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-2xl font-bold mb-3" style={{ color: '#1E40AF' }}>
        Business Plan Limit Reached
      </h3>
      <p className="text-base mb-6 max-w-md mx-auto" style={{ color: '#1E40AF', opacity: 0.9 }}>
        You&apos;ve generated 3 business plans this month. Upgrade to create unlimited AI-powered business plans.
      </p>
      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
        <div className="p-4 rounded-xl text-left" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="text-2xl mb-2">✅</div>
          <h4 className="font-semibold mb-1" style={{ color: '#1E40AF' }}>Unlimited Plans</h4>
          <p className="text-sm" style={{ color: '#1E40AF', opacity: 0.8 }}>Generate as many business plans as you need</p>
        </div>
        <div className="p-4 rounded-xl text-left" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="text-2xl mb-2">📈</div>
          <h4 className="font-semibold mb-1" style={{ color: '#1E40AF' }}>Full Insights</h4>
          <p className="text-sm" style={{ color: '#1E40AF', opacity: 0.8 }}>Access complete marketing and market analysis</p>
        </div>
      </div>
      <button
        onClick={() => router.push('/pricing')}
        className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl"
        style={{ backgroundColor: '#3B82F6', color: '#FFFFFF' }}
      >
        Upgrade to Basic - $12/month
      </button>
      <p className="text-xs mt-4" style={{ color: '#1E40AF', opacity: 0.7 }}>
        Start 14-day free trial • No credit card required
      </p>
    </div>
  );
}
