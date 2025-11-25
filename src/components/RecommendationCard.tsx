'use client';

import { ArxivPaper, CategoryMatch, TopicCategory } from '@/types/arxiv';
import { AbstractArt } from './ui/AbstractArt';
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/keywords';

interface RecommendationCardProps {
  paper: ArxivPaper;
  categoryMatches?: CategoryMatch[];
  onClick?: () => void;
  onBookmarkClick?: () => void;
  isBookmarked?: boolean;
  variant?: 'default' | 'compact';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function RecommendationCard({
  paper,
  categoryMatches = [],
  onClick,
  onBookmarkClick,
  isBookmarked = false,
  variant = 'default',
}: RecommendationCardProps) {
  const primaryCategory: TopicCategory = categoryMatches[0]?.category || 'other';
  const color = CATEGORY_COLORS[primaryCategory];

  if (variant === 'compact') {
    return (
      <article
        className="flex gap-4 p-3 rounded-2xl transition-colors cursor-pointer"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={onClick}
      >
        {/* Thumbnail */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
          <AbstractArt
            paperId={paper.id}
            category={primaryCategory}
            className="absolute inset-0"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <span
              className="text-[10px] font-semibold uppercase tracking-wide"
              style={{ color }}
            >
              {CATEGORY_LABELS[primaryCategory]}
            </span>
            <h3 className="text-sm font-semibold line-clamp-2 mt-0.5" style={{ color: '#4A5568' }}>
              {paper.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#718096' }}>
            <span>{formatDate(paper.publishedDate)}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="flex gap-4 p-4 rounded-2xl transition-all cursor-pointer group"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden">
        <AbstractArt
          paperId={paper.id}
          category={primaryCategory}
          className="absolute inset-0"
        />
        {/* Category badge overlay */}
        <div className="absolute bottom-2 left-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
            style={{ backgroundColor: `${color}cc` }}
          >
            {CATEGORY_ICONS[primaryCategory]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color }}
          >
            {CATEGORY_LABELS[primaryCategory]}
          </span>
          <button
            type="button"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkClick?.();
            }}
            className="p-1.5 -m-1.5 rounded-full transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFECE6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg
              className="w-4 h-4"
              style={{ color: isBookmarked ? '#9EDCE1' : '#718096' }}
              fill={isBookmarked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm md:text-base font-semibold line-clamp-2 mt-1 transition-colors" style={{ color: '#4A5568' }}>
          {paper.title}
        </h3>

        {/* Abstract preview */}
        <p className="text-xs line-clamp-2 mt-1.5 hidden md:block" style={{ color: '#718096' }}>
          {paper.abstract}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-3 mt-auto pt-2 text-xs" style={{ color: '#718096' }}>
          <div className="flex items-center gap-1">
            <span className="font-medium">arXiv</span>
            <svg className="w-3.5 h-3.5" style={{ color: '#9EDCE1' }} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span style={{ color: '#C0E5E8' }}>•</span>
          <span>{formatDate(paper.publishedDate)}</span>
          {categoryMatches[0]?.score && (
            <>
              <span style={{ color: '#C0E5E8' }}>•</span>
              <span style={{ color }}>{Math.round(categoryMatches[0].score)}% match</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function RecommendationCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-4 p-3 rounded-2xl animate-pulse" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="w-24 h-24 rounded-xl" style={{ backgroundColor: '#EFECE6' }} />
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="w-20 h-3 rounded" style={{ backgroundColor: '#EFECE6' }} />
            <div className="w-full h-4 rounded mt-2" style={{ backgroundColor: '#EFECE6' }} />
            <div className="w-3/4 h-4 rounded mt-1" style={{ backgroundColor: '#EFECE6' }} />
          </div>
          <div className="w-16 h-3 rounded" style={{ backgroundColor: '#EFECE6' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 rounded-2xl animate-pulse" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl" style={{ backgroundColor: '#EFECE6' }} />
      <div className="flex-1 flex flex-col">
        <div className="w-24 h-3 rounded" style={{ backgroundColor: '#EFECE6' }} />
        <div className="w-full h-5 rounded mt-2" style={{ backgroundColor: '#EFECE6' }} />
        <div className="w-4/5 h-5 rounded mt-1" style={{ backgroundColor: '#EFECE6' }} />
        <div className="w-full h-3 rounded mt-3 hidden md:block" style={{ backgroundColor: '#EFECE6' }} />
        <div className="w-3/4 h-3 rounded mt-1 hidden md:block" style={{ backgroundColor: '#EFECE6' }} />
        <div className="w-32 h-3 rounded mt-auto" style={{ backgroundColor: '#EFECE6' }} />
      </div>
    </div>
  );
}

export default RecommendationCard;
