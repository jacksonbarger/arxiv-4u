'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArxivPaper } from '@/types/arxiv';
import { FilterState, defaultFilters } from '@/components/FilterPanel';
import { usePapers } from '@/lib/usePapers';
import { useOnboarding, useBookmarks, useIsMobile } from '@/hooks';
import { BottomNav, NavItem, FilterDrawer } from '@/components/ui';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { HomeFeed } from '@/components/HomeFeed';
import { PaperDetail } from '@/components/PaperDetail';
import { KeywordManager } from '@/components/KeywordManager';
import { ReferralDashboard } from '@/components/ReferralDashboard';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { useToast } from '@/components/ui/Toast';
import { EmptyBookmarks } from '@/components/ui/EmptyState';
import { SuccessCelebration } from '@/components/ui/Confetti';

type Screen = 'onboarding' | 'home' | 'detail' | 'categories' | 'search' | 'bookmarks' | 'settings';

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedPaper, setSelectedPaper] = useState<ArxivPaper | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  const { hasCompletedOnboarding, isLoading: isOnboardingLoading, completeOnboarding } = useOnboarding();
  const { toggleBookmark, isBookmarked, bookmarkCount, bookmarkedIds } = useBookmarks();
  const isMobile = useIsMobile();
  const { showToast } = useToast();

  // Enhanced toggle bookmark with toast feedback
  const handleToggleBookmark = useCallback((paperId: string) => {
    const wasBookmarked = isBookmarked(paperId);
    toggleBookmark(paperId);

    if (wasBookmarked) {
      showToast('Bookmark removed', 'info');
    } else {
      showToast('Paper bookmarked! 🔖', 'success');
    }
  }, [toggleBookmark, isBookmarked, showToast]);

  const {
    filteredPapers,
    categoryMatchesMap,
    categoryDistribution,
    isLoading,
    error,
    refetch,
  } = usePapers(filters);

  // Handle URL params for deep linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paperId = params.get('paper');
    if (paperId && filteredPapers.length > 0) {
      const paper = filteredPapers.find((p) => p.id === paperId);
      if (paper) {
        setSelectedPaper(paper);
        setScreen('detail');
      }
    }
  }, [filteredPapers]);

  // Update URL when navigating
  const updateUrl = useCallback((paperId?: string) => {
    const url = new URL(window.location.href);
    if (paperId) {
      url.searchParams.set('paper', paperId);
    } else {
      url.searchParams.delete('paper');
    }
    window.history.pushState({}, '', url);
  }, []);

  // Check onboarding status
  useEffect(() => {
    if (!isOnboardingLoading && hasCompletedOnboarding === false) {
      setScreen('onboarding');
    }
  }, [hasCompletedOnboarding, isOnboardingLoading]);

  const handleOnboardingComplete = () => {
    completeOnboarding();
    setCelebrationMessage('Welcome to Arxiv-4U! 🎉');
    setShowCelebration(true);
    setTimeout(() => setScreen('home'), 1000);
  };

  const handlePaperClick = (paper: ArxivPaper) => {
    setSelectedPaper(paper);
    setScreen('detail');
    updateUrl(paper.id);
  };

  const handleBack = () => {
    setSelectedPaper(null);
    setScreen('home');
    updateUrl();
  };

  const handleNavClick = (item: NavItem) => {
    if (item === 'home') {
      setSelectedPaper(null);
      setScreen('home');
      updateUrl();
    } else if (item === 'categories') {
      setIsFilterDrawerOpen(true);
    } else if (item === 'search') {
      // Focus search - just go home and search is at top
      setSelectedPaper(null);
      setScreen('home');
      updateUrl();
    } else if (item === 'bookmarks') {
      setScreen('bookmarks');
    } else if (item === 'settings') {
      setScreen('settings');
    }
  };

  // Get bookmarked papers
  const bookmarkedPapers = filteredPapers.filter((p) => bookmarkedIds.has(p.id));

  // Loading state
  if (isOnboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="w-8 h-8 border-2 border-[#9EDCE1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Onboarding screen
  if (screen === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Paper detail screen
  if (screen === 'detail' && selectedPaper) {
    return (
      <>
        <PaperDetail
          paper={selectedPaper}
          categoryMatches={categoryMatchesMap.get(selectedPaper.id)}
          onBack={handleBack}
          onBookmarkToggle={() => handleToggleBookmark(selectedPaper.id)}
          isBookmarked={isBookmarked(selectedPaper.id)}
          allPapers={filteredPapers}
          categoryMatchesMap={categoryMatchesMap}
          onPaperClick={handlePaperClick}
          isBookmarkedFn={isBookmarked}
          onBookmarkToggleFn={handleToggleBookmark}
        />
        {isMobile && (
          <BottomNav
            activeItem="home"
            onItemClick={handleNavClick}
            bookmarkCount={bookmarkCount}
          />
        )}
      </>
    );
  }

  // Bookmarks screen
  if (screen === 'bookmarks') {
    return (
      <>
        <div className="min-h-screen" style={{ backgroundColor: '#F5F3EF' }}>
          <header className="sticky top-0 z-30 backdrop-blur-lg border-b" style={{ backgroundColor: 'rgba(245, 243, 239, 0.9)', borderColor: '#E2E8F0' }}>
            <div className="px-4 py-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Go back"
                  onClick={() => setScreen('home')}
                  className="p-2 -ml-2 rounded-full transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg className="w-5 h-5" style={{ color: '#718096' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold" style={{ color: '#4A5568' }}>
                  Bookmarks
                </h1>
              </div>
            </div>
          </header>

          <main className="px-4 py-4 md:px-6 lg:px-8 max-w-4xl mx-auto pb-24">
            {bookmarkedPapers.length > 0 ? (
              <div className="space-y-3 stagger-children">
                {bookmarkedPapers.map((paper) => (
                  <article
                    key={paper.id}
                    onClick={() => handlePaperClick(paper)}
                    className="flex gap-4 p-4 rounded-2xl cursor-pointer smooth-hover"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-2" style={{ color: '#4A5568' }}>
                        {paper.title}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: '#718096' }}>
                        {paper.authors.slice(0, 2).map((a) => a.name).join(', ')}
                        {paper.authors.length > 2 && ` +${paper.authors.length - 2}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove bookmark"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBookmark(paper.id);
                      }}
                      className="p-2 -m-2"
                      style={{ color: '#9EDCE1' }}
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyBookmarks />
            )}
          </main>
        </div>
        {isMobile && (
          <BottomNav
            activeItem="bookmarks"
            onItemClick={handleNavClick}
            bookmarkCount={bookmarkCount}
          />
        )}
      </>
    );
  }

  // Settings screen (keyword manager)
  if (screen === 'settings') {
    return (
      <>
        <div className="min-h-screen" style={{ backgroundColor: '#F5F3EF' }}>
          <header className="sticky top-0 z-30 backdrop-blur-lg border-b" style={{ backgroundColor: 'rgba(245, 243, 239, 0.9)', borderColor: '#E2E8F0' }}>
            <div className="px-4 py-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Go back"
                  onClick={() => setScreen('home')}
                  className="p-2 -ml-2 rounded-full transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg className="w-5 h-5" style={{ color: '#718096' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold" style={{ color: '#4A5568' }}>
                  Settings
                </h1>
              </div>
            </div>
          </header>

          <main className="px-4 py-4 md:px-6 lg:px-8 max-w-4xl mx-auto pb-24 space-y-8">
            <SubscriptionManager />
            <KeywordManager />
            <ReferralDashboard />
          </main>
        </div>
        {isMobile && (
          <BottomNav
            activeItem="settings"
            onItemClick={handleNavClick}
            bookmarkCount={bookmarkCount}
          />
        )}
      </>
    );
  }

  // Home feed (default)
  return (
    <>
      {/* Error toast - dismissible */}
      {error && (
        <div className="fixed bottom-24 left-4 right-4 z-40 md:left-auto md:right-4 md:w-96 md:bottom-4">
          <div className="rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-1 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors flex-shrink-0"
                aria-label="Dismiss"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <HomeFeed
        papers={filteredPapers}
        categoryMatchesMap={categoryMatchesMap}
        categoryDistribution={categoryDistribution}
        filters={filters}
        onFiltersChange={setFilters}
        onPaperClick={handlePaperClick}
        onBookmarkToggle={handleToggleBookmark}
        isBookmarked={isBookmarked}
        isLoading={isLoading}
        onRefresh={refetch}
        onFilterDrawerOpen={() => setIsFilterDrawerOpen(true)}
      />

      {/* Filter drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        categoryDistribution={categoryDistribution}
      />

      {/* Bottom nav for mobile */}
      {isMobile && (
        <BottomNav
          activeItem="home"
          onItemClick={handleNavClick}
          bookmarkCount={bookmarkCount}
        />
      )}

      {/* Success celebration */}
      <SuccessCelebration
        show={showCelebration}
        message={celebrationMessage}
        onClose={() => setShowCelebration(false)}
      />
    </>
  );
}
