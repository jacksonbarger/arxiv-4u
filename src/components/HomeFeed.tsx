'use client';

import { ArxivPaper, CategoryMatch, TopicCategory } from '@/types/arxiv';
import { SearchBar } from './ui/SearchBar';
import { CategoryPills } from './ui/CategoryPills';
import { FeaturedPaperCard, FeaturedPaperCardSkeleton } from './FeaturedPaperCard';
import { RecommendationCard, RecommendationCardSkeleton } from './RecommendationCard';
import { FilterState } from './FilterPanel';
import { EmptySearchResults } from './ui/EmptyState';

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
    <div className="flex-1" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Hero Section */}
      <section className="py-12 px-4" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#0F172A' }}>
            Discover AI Research
          </h1>
          <p className="text-lg mb-8" style={{ color: '#64748B' }}>
            Turn cutting-edge AI/ML papers into profitable products and business strategies.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar
              value={filters.searchQuery}
              onChange={(value) => onFiltersChange({ ...filters, searchQuery: value })}
              placeholder="Search for papers, topics, or authors..."
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
              style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
            >
              <span className="flex items-center gap-2">
                <svg
                  className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
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
                Refresh
              </span>
            </button>
            <button
              onClick={onFilterDrawerOpen}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 relative"
              style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {(filters.selectedCategories.length > 0 || filters.minRelevanceScore > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ backgroundColor: '#9EDCE1' }} />
                )}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div className="container mx-auto max-w-4xl px-4">
          <CategoryPills
            selectedCategories={filters.selectedCategories}
            onToggleCategory={toggleCategory}
            categoryDistribution={categoryDistribution}
          />
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto max-w-4xl px-4 py-8 pb-24">
        {/* Featured paper */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#0F172A' }}>
            Featured Research
          </h2>
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
            <div
              className="aspect-[4/3] md:aspect-[16/9] rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <p style={{ color: '#64748B' }}>No papers found</p>
            </div>
          )}
        </section>

        {/* Recent Papers section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#0F172A' }}>
              Recent Papers
            </h2>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
            >
              {papers.length} papers
            </span>
          </div>

          <div className="grid gap-4">
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
              <EmptySearchResults />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomeFeed;
