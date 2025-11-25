'use client';

import { ArxivPaper, CategoryMatch } from '@/types/arxiv';
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/keywords';

interface PaperCardProps {
  paper: ArxivPaper;
  categoryMatches?: CategoryMatch[];
  onSelect?: (paper: ArxivPaper) => void;
}

export function PaperCard({ paper, categoryMatches = [], onSelect }: PaperCardProps) {
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
      className="group relative flex flex-col rounded-lg border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
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
      <h3 className="mb-2 text-lg font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
        <a
          href={paper.arxivUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400"
          onClick={(e) => e.stopPropagation()}
        >
          {paper.title}
        </a>
      </h3>

      {/* Authors */}
      <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
        {paper.authors.slice(0, 3).map(a => a.name).join(', ')}
        {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
      </p>

      {/* Abstract */}
      <p className="mb-4 flex-grow text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {truncatedAbstract}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
        {/* Date and arxiv categories */}
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-500">
          <span>{formattedDate}</span>
          <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono dark:bg-zinc-800">
            {paper.primaryCategory}
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2">
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            onClick={(e) => e.stopPropagation()}
          >
            PDF
          </a>
          <a
            href={paper.arxivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            onClick={(e) => e.stopPropagation()}
          >
            arXiv
          </a>
        </div>
      </div>

      {/* Matched keywords (collapsible detail) */}
      {topCategories.length > 0 && topCategories[0].matchedKeywords.length > 0 && (
        <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <details className="text-xs text-zinc-500">
            <summary className="cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300">
              Matched keywords
            </summary>
            <div className="mt-2 flex flex-wrap gap-1">
              {topCategories[0].matchedKeywords.slice(0, 10).map((keyword) => (
                <span
                  key={keyword}
                  className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800"
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
  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Category badges skeleton */}
      <div className="mb-3 flex gap-2">
        <div className="h-5 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Title skeleton */}
      <div className="mb-2 h-6 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

      {/* Authors skeleton */}
      <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

      {/* Abstract skeleton */}
      <div className="mb-4 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex gap-2">
          <div className="h-7 w-12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-7 w-12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
