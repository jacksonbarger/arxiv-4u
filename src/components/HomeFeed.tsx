'use client';

import { ArxivPaper, CategoryMatch, TopicCategory } from '@/types/arxiv';
import { SearchBar } from './ui/SearchBar';
import { CategoryPills } from './ui/CategoryPills';
import { UserMenu } from './ui/UserMenu';
import { FeaturedPaperCard, FeaturedPaperCardSkeleton } from './FeaturedPaperCard';
import { RecommendationCard, RecommendationCardSkeleton } from './RecommendationCard';
import { FilterState } from './FilterPanel';

interface HomeFeedProps {
  papers: ArxivPaper[];
  categoryMatchesMap: Map<string, CategoryMatch[]>;
  categoryDistribution: Record<TopicCategory, number>;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onPaperClick: (paper: ArxivPaper) => void;
  onBookmarkToggle: (paperId: string) => void;
  isBookmarked: (paperId: string) => boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onFilterDrawerOpen: () => void;
}

export function HomeFeed({
  papers,
  categoryMatchesMap,
  categoryDistribution,
  filters,
  onFiltersChange,
  onPaperClick,
  onBookmarkToggle,
  isBookmarked,
  isLoading,
  onRefresh,
  onFilterDrawerOpen,
}: HomeFeedProps) {
  const featuredPaper = papers[0];
  const recommendedPapers = papers.slice(1);

  const toggleCategory = (category: TopicCategory) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter((c) => c !== category)
      : [...filters.selectedCategories, category];
    onFiltersChange({ ...filters, selectedCategories: newCategories });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F3EF' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-lg" style={{ backgroundColor: 'rgba(245, 243, 239, 0.9)' }}>
        <div className="px-4 pt-4 pb-2 md:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            {/* Location / Title */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#9EDCE1' }}>
                <svg
                  className="w-5 h-5"
                  style={{ color: '#4A5568' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: '#4A5568' }}>
                  Arxiv-4U
                </h1>
                <p className="text-xs" style={{ color: '#718096' }}>AI/ML Papers</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <UserMenu />
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 rounded-full transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg
                  className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
                  style={{ color: '#718096' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={onFilterDrawerOpen}
                className="p-2 rounded-full transition-colors relative"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: '#718096' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                {(filters.selectedCategories.length > 0 || filters.minRelevanceScore > 0) && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#9EDCE1' }} />
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <SearchBar
            value={filters.searchQuery}
            onChange={(value) => onFiltersChange({ ...filters, searchQuery: value })}
            placeholder="Find interesting papers..."
          />
        </div>

        {/* Category pills */}
        <div className="px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
          <CategoryPills
            selectedCategories={filters.selectedCategories}
            onToggleCategory={toggleCategory}
            categoryDistribution={categoryDistribution}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 py-4 md:px-6 lg:px-8 max-w-4xl mx-auto pb-24">
        {/* Featured paper */}
        <section className="mb-6">
          {isLoading ? (
            <FeaturedPaperCardSkeleton />
          ) : featuredPaper ? (
            <FeaturedPaperCard
              paper={featuredPaper}
              categoryMatches={categoryMatchesMap.get(featuredPaper.id)}
              onClick={() => onPaperClick(featuredPaper)}
              onBookmarkClick={() => onBookmarkToggle(featuredPaper.id)}
              isBookmarked={isBookmarked(featuredPaper.id)}
            />
          ) : (
            <div className="aspect-[4/3] md:aspect-[16/9] rounded-3xl flex items-center justify-center" style={{ backgroundColor: '#EFECE6' }}>
              <p style={{ color: '#718096' }}>No papers found</p>
            </div>
          )}
        </section>

        {/* Recommendations section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: '#4A5568' }}>
              Recommendations
            </h2>
            <span className="text-sm" style={{ color: '#718096' }}>
              {papers.length} papers
            </span>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <RecommendationCardSkeleton key={i} />
              ))
            ) : recommendedPapers.length > 0 ? (
              recommendedPapers.map((paper) => (
                <RecommendationCard
                  key={paper.id}
                  paper={paper}
                  categoryMatches={categoryMatchesMap.get(paper.id)}
                  onClick={() => onPaperClick(paper)}
                  onBookmarkClick={() => onBookmarkToggle(paper.id)}
                  isBookmarked={isBookmarked(paper.id)}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: '#C0E5E8' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p style={{ color: '#718096' }}>
                  No more papers matching your filters
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomeFeed;
