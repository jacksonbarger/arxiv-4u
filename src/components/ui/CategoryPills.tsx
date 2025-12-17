'use client';

import { TopicCategory } from '@/types/arxiv';
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_PRIORITY,
} from '@/lib/keywords';
import { useTheme } from '@/contexts/ThemeContext';

interface CategoryPillsProps {
  selectedCategories: TopicCategory[];
  onToggleCategory: (category: TopicCategory) => void;
  categoryDistribution?: Record<TopicCategory, number>;
  showAll?: boolean;
}

// Theme-aware color configurations
const themeColors = {
  light: {
    pillBg: '#EFECE6',
    pillBgHover: '#E5E2DC',
    pillText: '#718096',
    allSelectedBg: '#9EDCE1',
    allSelectedText: '#4A5568',
    countBg: 'rgba(0,0,0,0.1)',
  },
  dark: {
    pillBg: '#374151',
    pillBgHover: '#4B5563',
    pillText: '#D1D5DB',
    allSelectedBg: '#9EDCE1',
    allSelectedText: '#1F2937',
    countBg: 'rgba(255,255,255,0.15)',
  },
};

export function CategoryPills({
  selectedCategories,
  onToggleCategory,
  categoryDistribution,
  showAll = false,
}: CategoryPillsProps) {
  const { themeDefinition } = useTheme();
  // Use colorScheme (light/dark) instead of theme ID for styling
  const colorScheme = themeDefinition.colorScheme;
  const colors = themeColors[colorScheme];

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
        className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
        style={{
          backgroundColor: isAllSelected ? colors.allSelectedBg : colors.pillBg,
          color: isAllSelected ? colors.allSelectedText : colors.pillText,
        }}
      >
        All
      </button>

      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category);
        const count = categoryDistribution?.[category] || 0;
        const categoryColor = CATEGORY_COLORS[category];

        return (
          <button
            key={category}
            onClick={() => onToggleCategory(category)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap hover:scale-105"
            style={{
              backgroundColor: isSelected ? categoryColor : colors.pillBg,
              color: isSelected ? '#FFFFFF' : categoryColor,
              boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : 'none',
              border: isSelected ? 'none' : `1px solid ${colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
            }}
          >
            <span>{CATEGORY_ICONS[category]}</span>
            <span>{CATEGORY_LABELS[category]}</span>
            {count > 0 && (
              <span
                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : colors.countBg,
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
