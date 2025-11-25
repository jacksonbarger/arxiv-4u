'use client';

import { ArxivPaper, CategoryMatch } from '@/types/arxiv';
import { PaperCard, PaperCardSkeleton } from './PaperCard';

interface PaperListProps {
  papers: ArxivPaper[];
  categoryMatchesMap?: Map<string, CategoryMatch[]>;
  isLoading?: boolean;
  onSelectPaper?: (paper: ArxivPaper) => void;
}

export function PaperList({
  papers,
  categoryMatchesMap,
  isLoading = false,
  onSelectPaper,
}: PaperListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <PaperCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-16 dark:border-zinc-700">
        <svg
          className="mb-4 h-12 w-12 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No papers found matching your filters
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
          Try adjusting your search criteria or clearing filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {papers.map((paper) => (
        <PaperCard
          key={paper.id}
          paper={paper}
          categoryMatches={categoryMatchesMap?.get(paper.id)}
          onSelect={onSelectPaper}
        />
      ))}
    </div>
  );
}

// Stats bar component
interface StatsBarProps {
  totalPapers: number;
  filteredCount: number;
  lastUpdated?: Date | null;
}

export function StatsBar({ totalPapers, filteredCount, lastUpdated }: StatsBarProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">
          Showing{' '}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {filteredCount}
          </span>
          {filteredCount !== totalPapers && (
            <>
              {' '}
              of{' '}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {totalPapers}
              </span>
            </>
          )}{' '}
          papers
        </span>
      </div>
      {lastUpdated && (
        <span className="text-xs text-zinc-500 dark:text-zinc-500">
          Updated {lastUpdated.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
