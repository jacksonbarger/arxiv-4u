'use client';

import { TopicCategory } from '@/types/arxiv';
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_PRIORITY,
} from '@/lib/keywords';

interface CategoryPillsProps {
  selectedCategories: TopicCategory[];
  onToggleCategory: (category: TopicCategory) => void;
  categoryDistribution?: Record<TopicCategory, number>;
  showAll?: boolean;
}

export function CategoryPills({
  selectedCategories,
  onToggleCategory,
  categoryDistribution,
  showAll = false,
}: CategoryPillsProps) {
  const categories = showAll
    ? CATEGORY_PRIORITY
    : CATEGORY_PRIORITY.filter((c) => c !== 'other');

  const isAllSelected = selectedCategories.length === 0;

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1">
      {/* All button */}
      <button
        onClick={() => {
          if (!isAllSelected) {
            // Clear all selections to show all
            selectedCategories.forEach((c) => onToggleCategory(c));
          }
        }}
        className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
        style={{
          backgroundColor: isAllSelected ? '#9EDCE1' : '#EFECE6',
          color: isAllSelected ? '#4A5568' : '#718096',
        }}
      >
        All
      </button>

      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category);
        const count = categoryDistribution?.[category] || 0;
        const color = CATEGORY_COLORS[category];

        return (
          <button
            key={category}
            onClick={() => onToggleCategory(category)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
            style={{
              backgroundColor: isSelected ? color : '#EFECE6',
              color: isSelected ? '#FFFFFF' : color,
              boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
            }}
          >
            <span>{CATEGORY_ICONS[category]}</span>
            <span>{CATEGORY_LABELS[category]}</span>
            {count > 0 && (
              <span
                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  color: isSelected ? '#FFFFFF' : 'inherit',
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryPills;
