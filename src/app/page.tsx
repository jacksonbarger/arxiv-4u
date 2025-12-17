'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArxivPaper, TopicCategory } from '@/types/arxiv';
import { FilterState, defaultFilters } from '@/components/FilterPanel';
import { usePapers } from '@/lib/usePapers';
import { useBookmarks, useSubscription } from '@/hooks';
import { Header } from '@/components/ui/Header';
import { SearchBar } from '@/components/ui/SearchBar';
import { CategoryPills } from '@/components/ui/CategoryPills';
import { FeaturedPaperCard, FeaturedPaperCardSkeleton } from '@/components/FeaturedPaperCard';
import { RecommendationCard, RecommendationCardSkeleton } from '@/components/RecommendationCard';
import { FilterDrawer } from '@/components/ui/FilterDrawer';
import { EmptySearchResults } from '@/components/ui/EmptyState';
import { UpgradeModal } from '@/components/UpgradeModal';
import { MarketingInsights } from '@/components/MarketingInsights';
import { useToast } from '@/components/ui/Toast';
import {
  X, Bookmark, ExternalLink, Download,
  Sparkles, TrendingUp, ArrowLeft, RefreshCw, Filter
} from 'lucide-react';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { subscription } = useSubscription();
  const { showToast } = useToast();

  // State
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedPaper, setSelectedPaper] = useState<ArxivPaper | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Hooks
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const {
    filteredPapers,
    categoryMatchesMap,
    categoryDistribution,
    isLoading,
    error,
    refetch,
  } = usePapers(filters);

  // Handlers
  const handleToggleBookmark = useCallback((paperId: string) => {
    const wasBookmarked = isBookmarked(paperId);
    toggleBookmark(paperId);
    showToast(
      wasBookmarked ? 'Bookmark removed' : 'Paper bookmarked!',
      wasBookmarked ? 'info' : 'success'
    );
  }, [toggleBookmark, isBookmarked, showToast]);

  const handlePaperClick = (paper: ArxivPaper) => {
    setSelectedPaper(paper);
  };

  const handleClosePaper = () => {
    setSelectedPaper(null);
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const toggleCategory = (category: TopicCategory) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter((c) => c !== category)
      : [...filters.selectedCategories, category];
    setFilters({ ...filters, selectedCategories: newCategories });
  };

  // Featured paper is the first one
  const featuredPaper = filteredPapers[0];
  const recommendedPapers = filteredPapers.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" />
        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              Discover AI Research
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Transform cutting-edge research into actionable business strategies and product ideas.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <SearchBar
                value={filters.searchQuery}
                onChange={(value) => setFilters({ ...filters, searchQuery: value })}
                placeholder="Search papers, topics, or authors..."
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={refetch}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFilterDrawerOpen(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex items-center gap-2 relative"
              >
                <Filter className="w-4 h-4" />
                Filters
                {(filters.selectedCategories.length > 0 || filters.minRelevanceScore > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500" />
                )}
              </motion.button>
              {session && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Dashboard
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <CategoryPills
            selectedCategories={filters.selectedCategories}
            onToggleCategory={toggleCategory}
            categoryDistribution={categoryDistribution}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 pb-24">
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Featured Paper */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Research</h2>
          </div>
          {isLoading ? (
            <FeaturedPaperCardSkeleton />
          ) : featuredPaper ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FeaturedPaperCard
                paper={featuredPaper}
                categoryMatches={categoryMatchesMap.get(featuredPaper.id)}
                onClick={() => handlePaperClick(featuredPaper)}
                onBookmarkClick={() => handleToggleBookmark(featuredPaper.id)}
                isBookmarked={isBookmarked(featuredPaper.id)}
              />
            </motion.div>
          ) : (
            <div className="aspect-[4/3] md:aspect-[16/9] rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <p className="text-slate-500">No papers found</p>
            </div>
          )}
        </section>

        {/* Recent Papers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Papers</h2>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredPapers.length} papers
            </span>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <RecommendationCardSkeleton key={i} />
              ))
            ) : recommendedPapers.length > 0 ? (
              recommendedPapers.map((paper, index) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <RecommendationCard
                    paper={paper}
                    categoryMatches={categoryMatchesMap.get(paper.id)}
                    onClick={() => handlePaperClick(paper)}
                    onBookmarkClick={() => handleToggleBookmark(paper.id)}
                    isBookmarked={isBookmarked(paper.id)}
                  />
                </motion.div>
              ))
            ) : (
              <EmptySearchResults />
            )}
          </div>
        </section>
      </main>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        categoryDistribution={categoryDistribution}
      />

      {/* Paper Detail Modal */}
      <AnimatePresence>
        {selectedPaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClosePaper}
          >
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 top-12 md:top-20 bg-white dark:bg-slate-900 rounded-t-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Paper Detail Header */}
              <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
                <button
                  onClick={handleClosePaper}
                  className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleBookmark(selectedPaper.id)}
                    className={`p-2 rounded-full transition-colors ${
                      isBookmarked(selectedPaper.id)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked(selectedPaper.id) ? 'fill-current' : ''}`} />
                  </button>
                  <a
                    href={selectedPaper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <a
                    href={selectedPaper.arxivUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={handleClosePaper}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Paper Detail Content */}
              <div className="overflow-y-auto h-full pb-20">
                <div className="max-w-4xl mx-auto px-4 py-6">
                  {/* Paper Title & Meta */}
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {categoryMatchesMap.get(selectedPaper.id)?.slice(0, 3).map((match) => (
                        <span
                          key={match.category}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        >
                          {match.category.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                      {selectedPaper.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span>{selectedPaper.primaryCategory}</span>
                      <span>|</span>
                      <span>
                        {new Date(selectedPaper.publishedDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>|</span>
                      <span>{selectedPaper.authors.length} authors</span>
                    </div>
                  </div>

                  {/* Authors */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Authors</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPaper.authors.map((author, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {author.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Abstract */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Abstract</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedPaper.abstract}
                    </p>
                  </div>

                  {/* AI Analysis Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        AI-Powered Insights
                      </h3>
                    </div>

                    {/* Subscription Gate */}
                    {!subscription || subscription.tier === 'free' ? (
                      <div className="rounded-2xl p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-4 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          Unlock AI Insights
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
                          Get detailed marketing strategies, revenue estimates, and full business plans for any research paper.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={handleUpgradeClick}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                          >
                            Start Free Trial
                          </button>
                          <button
                            onClick={() => router.push('/pricing')}
                            className="px-6 py-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-600 transition-colors"
                          >
                            View Plans
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                          7-day free trial. Cancel anytime.
                        </p>
                      </div>
                    ) : (
                      <MarketingInsights
                        paper={selectedPaper}
                        categoryMatches={categoryMatchesMap.get(selectedPaper.id) || []}
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
