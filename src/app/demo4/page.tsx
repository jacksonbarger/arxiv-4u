'use client';

import { useState, useCallback } from 'react';
import { ArxivPaper } from '@/types/arxiv';
import { FilterState, defaultFilters } from '@/components/FilterPanel';
import { usePapers } from '@/lib/usePapers';
import { useBookmarks } from '@/hooks';
import { Demo4HomeFeed } from '@/components/demo4/Demo4HomeFeed';
import { Demo4PaperDetail } from '@/components/demo4/Demo4PaperDetail';
import { Demo4Bookmarks } from '@/components/demo4/Demo4Bookmarks';
import { Demo4Settings } from '@/components/demo4/Demo4Settings';
import { useToast } from '@/components/ui/Toast';

type Screen = 'home' | 'detail' | 'bookmarks' | 'settings';

function Demo4Content() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedPaper, setSelectedPaper] = useState<ArxivPaper | null>(null);

  const { toggleBookmark, isBookmarked, bookmarkCount, bookmarkedIds } = useBookmarks();
  const { showToast } = useToast();

  const {
    filteredPapers,
    categoryMatchesMap,
    categoryDistribution,
    isLoading,
    error,
    refetch,
  } = usePapers(filters);

  const handleToggleBookmark = useCallback((paperId: string) => {
    const wasBookmarked = isBookmarked(paperId);
    toggleBookmark(paperId);
    showToast(wasBookmarked ? 'Bookmark removed' : 'Paper bookmarked!', wasBookmarked ? 'info' : 'success');
  }, [toggleBookmark, isBookmarked, showToast]);

  const handlePaperClick = (paper: ArxivPaper) => {
    setSelectedPaper(paper);
    setScreen('detail');
  };

  const handleBack = () => {
    setSelectedPaper(null);
    setScreen('home');
  };

  const handleNavClick = (item: 'home' | 'bookmarks' | 'settings') => {
    setScreen(item);
    if (item === 'home') setSelectedPaper(null);
  };

  const bookmarkedPapers = filteredPapers.filter((p) => bookmarkedIds.has(p.id));

  if (screen === 'detail' && selectedPaper) {
    return (
      <Demo4PaperDetail
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
    );
  }

  if (screen === 'bookmarks') {
    return (
      <Demo4Bookmarks
        papers={bookmarkedPapers}
        onPaperClick={handlePaperClick}
        onBookmarkToggle={handleToggleBookmark}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'settings') {
    return <Demo4Settings onBack={() => setScreen('home')} />;
  }

  return (
    <Demo4HomeFeed
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
      error={error}
      onNavClick={handleNavClick}
      bookmarkCount={bookmarkCount}
    />
  );
}

export default function Demo4Page() {
  return <Demo4Content />;
}
