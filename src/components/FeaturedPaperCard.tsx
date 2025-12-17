'use client';

import { ArxivPaper, CategoryMatch, TopicCategory } from '@/types/arxiv';
import { GenerativeArt } from './ui/GenerativeArt';
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/keywords';

interface FeaturedPaperCardProps {
  paper: ArxivPaper;
  categoryMatches?: CategoryMatch[];
  onClick?: () => void;
  onBookmarkClick?: () => void;
  isBookmarked?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function FeaturedPaperCard({
  paper,
  categoryMatches = [],
  onClick,
  onBookmarkClick,
  isBookmarked = false,
}: FeaturedPaperCardProps) {
  const primaryCategory: TopicCategory = categoryMatches[0]?.category || 'other';
  const color = CATEGORY_COLORS[primaryCategory];

  return (
    <article
      className="relative rounded-3xl overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Aspect ratio container */}
      <div className="aspect-[4/3] md:aspect-[16/9] relative">
        {/* Generative art background */}
        <GenerativeArt
          title={paper.title}
          category={primaryCategory}
          variant="featured"
          className="absolute inset-0"
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              <span>{CATEGORY_ICONS[primaryCategory]}</span>
              {CATEGORY_LABELS[primaryCategory]}
            </span>
            {categoryMatches[0]?.score && (
              <span className="text-white/60 text-xs">
                {Math.round(categoryMatches[0].score)}% match
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-white line-clamp-2 mb-3 group-hover:underline decoration-2 underline-offset-2">
            {paper.title}
          </h2>

          {/* Meta row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-white/70">
              {/* Source badge */}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold">arX</span>
                </div>
                <span>arXiv</span>
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-white/40">•</span>
              <span>{formatDate(paper.publishedDate)}</span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkClick?.();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg
                className={`w-5 h-5 ${isBookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`}
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
        </div>
      </div>
    </article>
  );
}

export function FeaturedPaperCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden animate-pulse" style={{ backgroundColor: '#EFECE6' }}>
      <div className="aspect-[4/3] md:aspect-[16/9] relative">
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
          <div className="w-32 h-6 rounded-full mb-3" style={{ backgroundColor: '#DEEBEB' }} />
          <div className="w-full h-7 rounded mb-2" style={{ backgroundColor: '#DEEBEB' }} />
          <div className="w-3/4 h-7 rounded mb-3" style={{ backgroundColor: '#DEEBEB' }} />
          <div className="w-40 h-5 rounded" style={{ backgroundColor: '#DEEBEB' }} />
        </div>
      </div>
    </div>
  );
}

export default FeaturedPaperCard;
