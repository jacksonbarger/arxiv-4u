'use client';

import { TopicCategory } from '@/types/arxiv';
import { CATEGORY_GRADIENT_COLORS, CATEGORY_ICONS } from '@/lib/keywords';

interface CategoryGradientBarProps {
  category: TopicCategory;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
  showIcon?: boolean;
}

/**
 * CategoryGradientBar - A clean, minimal visual indicator for paper categories
 *
 * Replaces the old AbstractArt component with a professional gradient bar design.
 * The gradient color is based on the paper's primary category.
 */
export function CategoryGradientBar({
  category,
  className = '',
  variant = 'default',
  showIcon = true,
}: CategoryGradientBarProps) {
  const colors = CATEGORY_GRADIENT_COLORS[category] || CATEGORY_GRADIENT_COLORS['other'];
  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS['other'];

  // Bar height based on variant
  const barHeight = variant === 'featured' ? 8 : variant === 'compact' ? 4 : 6;

  // Padding based on variant
  const padding = variant === 'compact' ? 8 : 12;

  // Icon size based on variant
  const iconSize = variant === 'featured' ? 'text-4xl' : variant === 'compact' ? 'text-xl' : 'text-2xl';

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor: '#F8FAFC' }}
    >
      {/* Primary gradient bar at top */}
      <div
        className="absolute left-0 right-0 rounded-full"
        style={{
          top: `${padding}px`,
          marginLeft: `${padding}px`,
          marginRight: `${padding}px`,
          width: `calc(100% - ${padding * 2}px)`,
          height: `${barHeight}px`,
          background: `linear-gradient(90deg, ${colors.start} 0%, ${colors.end} 100%)`,
          boxShadow: `0 2px 4px ${colors.start}20`,
        }}
      />

      {/* Optional secondary thinner bar for visual depth */}
      {variant !== 'compact' && (
        <div
          className="absolute left-0 right-0 rounded-full opacity-40"
          style={{
            top: `${padding + barHeight + 6}px`,
            marginLeft: `${padding + 16}px`,
            marginRight: `${padding + 16}px`,
            width: `calc(100% - ${(padding + 16) * 2}px)`,
            height: `${Math.max(2, barHeight - 2)}px`,
            background: `linear-gradient(90deg, ${colors.start} 0%, ${colors.end} 100%)`,
          }}
        />
      )}

      {/* Centered faded icon */}
      {showIcon && variant !== 'compact' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`${iconSize} opacity-15 select-none`}
            style={{ color: colors.start }}
          >
            {icon}
          </span>
        </div>
      )}

      {/* Subtle pattern overlay for texture */}
      {variant === 'featured' && (
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(${colors.start} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
      )}
    </div>
  );
}

export default CategoryGradientBar;
