'use client';

import { useState } from 'react';
import { TopicCategory } from '@/types/arxiv';
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_PRIORITY,
} from '@/lib/keywords';
import { getAvailableCategories } from '@/lib/arxiv-api';

export interface FilterState {
  selectedCategories: TopicCategory[];
  arxivCategories: string[];
  minRelevanceScore: number;
  searchQuery: string;
  sortBy: 'date' | 'relevance';
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categoryDistribution?: Record<TopicCategory, number>;
}

const arxivCategories = getAvailableCategories();

export function FilterPanel({
  filters,
  onFiltersChange,
  categoryDistribution,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

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

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Filters
        </h2>
        <svg
          className={`h-5 w-5 text-zinc-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-6 border-t border-zinc-100 p-4 dark:border-zinc-800">
          {/* Search */}
          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Search
            </label>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) =>
                onFiltersChange({ ...filters, searchQuery: e.target.value })
              }
              placeholder="Search papers..."
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* Topic Categories */}
          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Topic Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {topicCategories.map((category) => {
                const isSelected = filters.selectedCategories.includes(category);
                const count = categoryDistribution?.[category] || 0;

                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'ring-2 ring-offset-1 dark:ring-offset-zinc-900'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? `${CATEGORY_COLORS[category]}30`
                        : `${CATEGORY_COLORS[category]}15`,
                      color: CATEGORY_COLORS[category],
                      ['--tw-ring-color' as string]: isSelected ? CATEGORY_COLORS[category] : undefined,
                    } as React.CSSProperties}
                  >
                    <span>{CATEGORY_ICONS[category]}</span>
                    <span>{CATEGORY_LABELS[category]}</span>
                    {count > 0 && (
                      <span className="ml-1 rounded-full bg-black/10 px-1.5 text-[10px] dark:bg-white/10">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Arxiv Categories */}
          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Arxiv Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {arxivCategories.map(({ value, label }) => {
                const isSelected = filters.arxivCategories.includes(value);

                return (
                  <button
                    key={value}
                    onClick={() => toggleArxivCategory(value)}
                    className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minimum Relevance Score */}
          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Min Relevance Score: {filters.minRelevanceScore}
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
              className="w-full accent-blue-600"
            />
            <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
              <span>0</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Sort By
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onFiltersChange({ ...filters, sortBy: 'date' })}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                  filters.sortBy === 'date'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => onFiltersChange({ ...filters, sortBy: 'relevance' })}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                  filters.sortBy === 'relevance'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                Relevance
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export const defaultFilters: FilterState = {
  selectedCategories: [],
  arxivCategories: arxivCategories.map((c) => c.value),
  minRelevanceScore: 0,
  searchQuery: '',
  sortBy: 'date',
};
