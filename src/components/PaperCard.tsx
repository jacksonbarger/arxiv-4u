'use client';

import { ArxivPaper, CategoryMatch } from '@/types/arxiv';
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/keywords';
import { useTheme } from '@/contexts/ThemeContext';

interface PaperCardProps {
  paper: ArxivPaper;
  categoryMatches?: CategoryMatch[];
  onSelect?: (paper: ArxivPaper) => void;
}

export function PaperCard({ paper, categoryMatches = [], onSelect }: PaperCardProps) {
  const { themeDefinition } = useTheme();
  const colors = themeDefinition.colors;

  const formattedDate = new Date(paper.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const truncatedAbstract = paper.abstract.length > 300
    ? paper.abstract.slice(0, 300) + '...'
    : paper.abstract;

  const topCategories = categoryMatches.slice(0, 3);

  return (
    <article
      className="group relative flex flex-col rounded-lg border p-5 transition-all cursor-pointer"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.cardBorder;
        e.currentTarget.style.boxShadow = 'none';
      }}
      onClick={() => onSelect?.(paper)}
    >
      {/* Category badges */}
      {topCategories.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {topCategories.map((match) => (
            <span
              key={match.category}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${CATEGORY_COLORS[match.category]}20`,
                color: CATEGORY_COLORS[match.category],
              }}
            >
              <span>{CATEGORY_ICONS[match.category]}</span>
              <span>{CATEGORY_LABELS[match.category]}</span>
              <span className="ml-1 opacity-70">{match.score}</span>
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold leading-snug" style={{ color: colors.foreground }}>
        <a
          href={paper.arxivUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline transition-colors"
          style={{ color: 'inherit' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
          onClick={(e) => e.stopPropagation()}
        >
          {paper.title}
        </a>
      </h3>

      {/* Authors */}
      <p className="mb-2 text-sm" style={{ color: colors.foregroundMuted }}>
        {paper.authors.slice(0, 3).map(a => a.name).join(', ')}
        {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
      </p>

      {/* Abstract */}
      <p className="mb-4 flex-grow text-sm leading-relaxed" style={{ color: colors.cardForeground }}>
        {truncatedAbstract}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between border-t pt-3"
        style={{ borderColor: colors.border }}
      >
        {/* Date and arxiv categories */}
        <div className="flex items-center gap-3 text-xs" style={{ color: colors.foregroundMuted }}>
          <span>{formattedDate}</span>
          <span
            className="rounded px-1.5 py-0.5 font-mono"
            style={{ backgroundColor: colors.muted, color: colors.foregroundMuted }}
          >
            {paper.primaryCategory}
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2">
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              backgroundColor: colors.muted,
              color: colors.foreground,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            onClick={(e) => e.stopPropagation()}
          >
            PDF
          </a>
          <a
            href={paper.arxivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              backgroundColor: `${colors.primary}20`,
              color: colors.primary,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${colors.primary}30`)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = `${colors.primary}20`)}
            onClick={(e) => e.stopPropagation()}
          >
            arXiv
          </a>
        </div>
      </div>

      {/* Matched keywords (collapsible detail) */}
      {topCategories.length > 0 && topCategories[0].matchedKeywords.length > 0 && (
        <div className="mt-3 border-t pt-3" style={{ borderColor: colors.border }}>
          <details className="text-xs" style={{ color: colors.foregroundMuted }}>
            <summary
              className="cursor-pointer transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.foreground)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.foregroundMuted)}
            >
              Matched keywords
            </summary>
            <div className="mt-2 flex flex-wrap gap-1">
              {topCategories[0].matchedKeywords.slice(0, 10).map((keyword) => (
                <span
                  key={keyword}
                  className="rounded px-1.5 py-0.5"
                  style={{ backgroundColor: colors.muted, color: colors.foregroundMuted }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </details>
        </div>
      )}
    </article>
  );
}

// Skeleton loader for PaperCard
export function PaperCardSkeleton() {
  const { themeDefinition } = useTheme();
  const colors = themeDefinition.colors;

  return (
    <div
      className="flex flex-col rounded-lg border p-5"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
      }}
    >
      {/* Category badges skeleton */}
      <div className="mb-3 flex gap-2">
        <div
          className="h-5 w-24 animate-pulse rounded-full"
          style={{ backgroundColor: colors.muted }}
        />
        <div
          className="h-5 w-20 animate-pulse rounded-full"
          style={{ backgroundColor: colors.muted }}
        />
      </div>

      {/* Title skeleton */}
      <div
        className="mb-2 h-6 w-full animate-pulse rounded"
        style={{ backgroundColor: colors.muted }}
      />
      <div
        className="mb-2 h-6 w-3/4 animate-pulse rounded"
        style={{ backgroundColor: colors.muted }}
      />

      {/* Authors skeleton */}
      <div
        className="mb-2 h-4 w-1/2 animate-pulse rounded"
        style={{ backgroundColor: colors.muted }}
      />

      {/* Abstract skeleton */}
      <div className="mb-4 space-y-2">
        <div
          className="h-4 w-full animate-pulse rounded"
          style={{ backgroundColor: colors.muted }}
        />
        <div
          className="h-4 w-full animate-pulse rounded"
          style={{ backgroundColor: colors.muted }}
        />
        <div
          className="h-4 w-2/3 animate-pulse rounded"
          style={{ backgroundColor: colors.muted }}
        />
      </div>

      {/* Footer skeleton */}
      <div
        className="flex items-center justify-between border-t pt-3"
        style={{ borderColor: colors.border }}
      >
        <div
          className="h-4 w-24 animate-pulse rounded"
          style={{ backgroundColor: colors.muted }}
        />
        <div className="flex gap-2">
          <div
            className="h-7 w-12 animate-pulse rounded"
            style={{ backgroundColor: colors.muted }}
          />
          <div
            className="h-7 w-12 animate-pulse rounded"
            style={{ backgroundColor: colors.muted }}
          />
        </div>
      </div>
    </div>
  );
}
