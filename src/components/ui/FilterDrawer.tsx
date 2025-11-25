'use client';

import { useEffect, useRef } from 'react';
import { TopicCategory } from '@/types/arxiv';
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_PRIORITY,
} from '@/lib/keywords';
import { getAvailableCategories } from '@/lib/arxiv-api';
import { FilterState } from '@/components/FilterPanel';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categoryDistribution?: Record<TopicCategory, number>;
}

const arxivCategories = getAvailableCategories();

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  categoryDistribution,
}: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const toggleCategory = (category: TopicCategory) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter((c) => c !== category)
      : [...filters.selectedCategories, category];
    onFiltersChange({ ...filters, selectedCategories: newCategories });
  };

  const toggleArxivCategory = (category: string) => {
    const newCategories = filters.arxivCategories.includes(category)
      ? filters.arxivCategories.filter((c) => c !== category)
      : [...filters.arxivCategories, category];
    onFiltersChange({ ...filters, arxivCategories: newCategories });
  };

  const clearFilters = () => {
    onFiltersChange({
      selectedCategories: [],
      arxivCategories: arxivCategories.map((c) => c.value),
      minRelevanceScore: 0,
      searchQuery: '',
      sortBy: 'date',
    });
  };

  const topicCategories = CATEGORY_PRIORITY.filter((c) => c !== 'other');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up"
        style={{
          animation: 'slideUp 0.3s ease-out',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#C0E5E8' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: '1px solid #E2E8F0' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#4A5568' }}>
            Filters
          </h2>
          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Topic Categories */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: '#4A5568' }}>
              Topic Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {topicCategories.map((category) => {
                const isSelected = filters.selectedCategories.includes(category);
                const count = categoryDistribution?.[category] || 0;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-all"
                    style={{
                      backgroundColor: isSelected ? CATEGORY_COLORS[category] : '#EFECE6',
                      color: isSelected ? '#FFFFFF' : CATEGORY_COLORS[category],
                      boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                    }}
                  >
                    <span>{CATEGORY_ICONS[category]}</span>
                    <span>{CATEGORY_LABELS[category]}</span>
                    {count > 0 && (
                      <span
                        className="ml-1 px-1.5 rounded-full text-[10px]"
                        style={{
                          backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* arXiv Categories */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: '#4A5568' }}>
              arXiv Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {arxivCategories.map(({ value }) => {
                const isSelected = filters.arxivCategories.includes(value);

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleArxivCategory(value)}
                    className="rounded-lg px-3 py-2 text-sm font-medium transition-all"
                    style={{
                      backgroundColor: isSelected ? '#9EDCE1' : '#EFECE6',
                      color: isSelected ? '#4A5568' : '#718096',
                    }}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Min Relevance */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: '#4A5568' }}>
              Minimum Relevance Score: {filters.minRelevanceScore}
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={filters.minRelevanceScore}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  minRelevanceScore: parseInt(e.target.value, 10),
                })
              }
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ backgroundColor: '#EFECE6', accentColor: '#9EDCE1' }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: '#718096' }}>
              <span>0</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: '#4A5568' }}>
              Sort By
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, sortBy: 'date' })}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: filters.sortBy === 'date' ? '#9EDCE1' : '#EFECE6',
                  color: filters.sortBy === 'date' ? '#4A5568' : '#718096',
                }}
              >
                Date
              </button>
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, sortBy: 'relevance' })}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: filters.sortBy === 'relevance' ? '#9EDCE1' : '#EFECE6',
                  color: filters.sortBy === 'relevance' ? '#4A5568' : '#718096',
                }}
              >
                Relevance
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 pb-safe" style={{ borderTop: '1px solid #E2E8F0' }}>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ border: '1px solid #C0E5E8', color: '#718096', backgroundColor: 'transparent' }}
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ backgroundColor: '#9EDCE1', color: '#4A5568' }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default FilterDrawer;
