'use client';

import { useState } from 'react';
import { TopicCategory } from '@/types/arxiv';
import { useUserKeywords } from '@/lib/useUserKeywords';
import {
  CATEGORY_KEYWORDS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_PRIORITY,
  KeywordEntry,
} from '@/lib/keywords';

interface KeywordTagProps {
  keyword: KeywordEntry;
  isDefault: boolean;
  isDisabled: boolean;
  onRemove: () => void;
  onToggle?: () => void;
  color: string;
}

function KeywordTag({ keyword, isDefault, isDisabled, onRemove, onToggle, color }: KeywordTagProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        transition-all duration-200
        ${isDisabled
          ? 'bg-gray-100 text-gray-400 line-through opacity-60'
          : 'text-white'
        }
      `}
      style={!isDisabled ? { backgroundColor: color } : undefined}
    >
      <span className="max-w-[150px] truncate">{keyword.term}</span>
      <span className={`text-[10px] ${isDisabled ? 'text-gray-400' : 'text-white/70'}`}>
        ({keyword.weight})
      </span>
      {isDefault && isDisabled && onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="ml-1 hover:text-green-600 transition-colors"
          title="Re-enable keyword"
          aria-label={`Re-enable "${keyword.term}"`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
      {!isDisabled && (
        <button
          type="button"
          onClick={onRemove}
          className={`ml-1 transition-colors ${isDefault ? 'hover:text-red-200' : 'hover:text-red-200'}`}
          title={isDefault ? 'Disable keyword' : 'Remove keyword'}
          aria-label={isDefault ? `Disable "${keyword.term}"` : `Remove "${keyword.term}"`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

interface CategorySectionProps {
  category: TopicCategory;
  color: string;
  onAddKeyword: (term: string, weight: number) => void;
  onRemoveKeyword: (term: string) => void;
  onResetCategory: () => void;
  getEffectiveKeywords: () => KeywordEntry[];
  isUserAdded: (term: string) => boolean;
  isDisabled: (term: string) => boolean;
  stats: { defaults: number; added: number; removed: number; total: number };
}

function CategorySection({
  category,
  color,
  onAddKeyword,
  onRemoveKeyword,
  onResetCategory,
  getEffectiveKeywords,
  isUserAdded,
  isDisabled,
  stats,
}: CategorySectionProps) {
  const [newKeyword, setNewKeyword] = useState('');
  const [newWeight, setNewWeight] = useState(8);
  const [isExpanded, setIsExpanded] = useState(false);

  const effectiveKeywords = getEffectiveKeywords();
  const defaultKeywords = CATEGORY_KEYWORDS[category];
  const disabledKeywords = defaultKeywords.filter(k => isDisabled(k.term));

  const handleAdd = () => {
    if (newKeyword.trim()) {
      onAddKeyword(newKeyword.trim(), newWeight);
      setNewKeyword('');
      setNewWeight(8);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{CATEGORY_ICONS[category]}</span>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{CATEGORY_LABELS[category]}</h3>
            <p className="text-xs text-gray-500">{CATEGORY_DESCRIPTIONS[category]}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-xs text-gray-500">
            <span className="font-medium text-gray-700">{stats.total}</span> keywords
            {stats.added > 0 && (
              <span className="text-green-600 ml-1">(+{stats.added})</span>
            )}
            {stats.removed > 0 && (
              <span className="text-red-500 ml-1">(-{stats.removed})</span>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Add keyword form */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a keyword..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="flex items-center gap-1">
              <label htmlFor={`weight-${category}`} className="text-xs text-gray-500">
                Weight:
              </label>
              <input
                id={`weight-${category}`}
                type="number"
                min={1}
                max={10}
                value={newWeight}
                onChange={(e) => setNewWeight(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-14 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newKeyword.trim()}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>

          {/* Active keywords */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Active Keywords</h4>
              {(stats.added > 0 || stats.removed > 0) && (
                <button
                  type="button"
                  onClick={onResetCategory}
                  className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                >
                  Reset to defaults
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {effectiveKeywords.map((keyword) => (
                <KeywordTag
                  key={keyword.term}
                  keyword={keyword}
                  isDefault={!isUserAdded(keyword.term)}
                  isDisabled={false}
                  onRemove={() => onRemoveKeyword(keyword.term)}
                  color={color}
                />
              ))}
              {effectiveKeywords.length === 0 && (
                <span className="text-sm text-gray-400 italic">No keywords</span>
              )}
            </div>
          </div>

          {/* Disabled keywords */}
          {disabledKeywords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Disabled Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {disabledKeywords.map((keyword) => (
                  <KeywordTag
                    key={keyword.term}
                    keyword={keyword}
                    isDefault={true}
                    isDisabled={true}
                    onRemove={() => {}}
                    onToggle={() => onAddKeyword(keyword.term, keyword.weight)}
                    color={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function KeywordManager() {
  const {
    isLoaded,
    addKeyword,
    removeKeyword,
    resetCategory,
    resetAll,
    getEffectiveKeywords,
    isUserAdded,
    isDisabled,
    getCategoryStats,
  } = useUserKeywords();

  const [searchFilter, setSearchFilter] = useState('');

  if (!isLoaded) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading keywords...
      </div>
    );
  }

  // Filter categories based on search
  const filteredCategories = CATEGORY_PRIORITY.filter(category => {
    if (category === 'other') return false;
    if (!searchFilter) return true;

    const search = searchFilter.toLowerCase();
    const label = CATEGORY_LABELS[category].toLowerCase();
    const description = CATEGORY_DESCRIPTIONS[category].toLowerCase();
    const keywords = getEffectiveKeywords(category);

    return (
      label.includes(search) ||
      description.includes(search) ||
      keywords.some(k => k.term.includes(search))
    );
  });

  // Get total stats
  const totalStats = CATEGORY_PRIORITY.reduce(
    (acc, category) => {
      if (category === 'other') return acc;
      const stats = getCategoryStats(category);
      return {
        added: acc.added + stats.added,
        removed: acc.removed + stats.removed,
      };
    },
    { added: 0, removed: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Keyword Manager</h2>
          <p className="text-sm text-gray-500 mt-1">
            Customize keywords used to filter and categorize papers
          </p>
        </div>
        {(totalStats.added > 0 || totalStats.removed > 0) && (
          <button
            type="button"
            onClick={resetAll}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Reset All to Defaults
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Search categories or keywords..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Stats summary */}
      {(totalStats.added > 0 || totalStats.removed > 0) && (
        <div className="flex gap-4 text-sm">
          {totalStats.added > 0 && (
            <span className="text-green-600">
              +{totalStats.added} custom keyword{totalStats.added !== 1 ? 's' : ''} added
            </span>
          )}
          {totalStats.removed > 0 && (
            <span className="text-red-500">
              {totalStats.removed} keyword{totalStats.removed !== 1 ? 's' : ''} disabled
            </span>
          )}
        </div>
      )}

      {/* Category sections */}
      <div className="space-y-3">
        {filteredCategories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            color={CATEGORY_COLORS[category]}
            onAddKeyword={(term, weight) => addKeyword(category, term, weight)}
            onRemoveKeyword={(term) => removeKeyword(category, term)}
            onResetCategory={() => resetCategory(category)}
            getEffectiveKeywords={() => getEffectiveKeywords(category)}
            isUserAdded={(term) => isUserAdded(category, term)}
            isDisabled={(term) => isDisabled(category, term)}
            stats={getCategoryStats(category)}
          />
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No categories match your search
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="text-xs text-gray-400 space-y-1">
        <p>
          <strong>Weight</strong>: Higher weight (1-10) means the keyword has more influence on matching.
        </p>
        <p>
          <strong>Tip</strong>: Disable default keywords you dont care about to reduce noise.
        </p>
      </div>
    </div>
  );
}
