'use client';

import { ArxivPaper, CategoryMatch } from '@/types/arxiv';
import { RecommendationCard } from './RecommendationCard';

interface RelatedPapersProps {
  currentPaper: ArxivPaper;
  allPapers: ArxivPaper[];
  categoryMatchesMap: Map<string, CategoryMatch[]>;
  onPaperClick: (paper: ArxivPaper) => void;
  onBookmarkToggle: (paperId: string) => void;
  isBookmarked: (paperId: string) => boolean;
}

/**
 * Find related papers using similarity algorithm
 */
function findRelatedPapers(
  currentPaper: ArxivPaper,
  allPapers: ArxivPaper[],
  categoryMatchesMap: Map<string, CategoryMatch[]>,
  limit: number = 3
): ArxivPaper[] {
  const currentMatches = categoryMatchesMap.get(currentPaper.id) || [];
  const currentCategories = currentMatches.map((m) => m.category);
  const currentAuthors = currentPaper.authors.map((a) => a.name.toLowerCase());

  // Score each paper based on similarity
  const scoredPapers = allPapers
    .filter((paper) => paper.id !== currentPaper.id) // Exclude current paper
    .map((paper) => {
      let score = 0;
      const matches = categoryMatchesMap.get(paper.id) || [];
      const paperCategories = matches.map((m) => m.category);
      const paperAuthors = paper.authors.map((a) => a.name.toLowerCase());

      // Same category (40% weight)
      const sharedCategories = paperCategories.filter((cat) => currentCategories.includes(cat)).length;
      score += sharedCategories * 40;

      // Same authors (30% weight)
      const sharedAuthors = paperAuthors.filter((author) => currentAuthors.includes(author)).length;
      score += sharedAuthors * 30;

      // Similar arXiv categories (20% weight)
      const sharedArxivCats = paper.categories.filter((cat) => currentPaper.categories.includes(cat)).length;
      score += sharedArxivCats * 20;

      // Recency boost (10% weight) - prefer newer papers
      const daysSincePublished = Math.floor(
        (new Date().getTime() - new Date(paper.publishedDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSincePublished < 7) {
        score += 10;
      } else if (daysSincePublished < 30) {
        score += 5;
      }

      return { paper, score };
    })
    .filter((item) => item.score > 0) // Only papers with some similarity
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, limit); // Take top N

  return scoredPapers.map((item) => item.paper);
}

export function RelatedPapers({
  currentPaper,
  allPapers,
  categoryMatchesMap,
  onPaperClick,
  onBookmarkToggle,
  isBookmarked,
}: RelatedPapersProps) {
  const relatedPapers = findRelatedPapers(currentPaper, allPapers, categoryMatchesMap, 3);

  if (relatedPapers.length === 0) {
    return null; // Don't show if no related papers
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5"
          style={{ color: '#4A5568' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <h2 className="text-lg font-semibold" style={{ color: '#4A5568' }}>
          Related Research
        </h2>
      </div>

      <p className="text-sm mb-4" style={{ color: '#718096' }}>
        Papers you might find interesting based on similar topics and authors
      </p>

      <div className="space-y-3">
        {relatedPapers.map((paper) => (
          <RecommendationCard
            key={paper.id}
            paper={paper}
            categoryMatches={categoryMatchesMap.get(paper.id)}
            onClick={() => onPaperClick(paper)}
            onBookmarkClick={() => onBookmarkToggle(paper.id)}
            isBookmarked={isBookmarked(paper.id)}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-6 py-3 rounded-lg text-sm font-medium transition-all hover:shadow-md"
          style={{ backgroundColor: '#F7FAFC', color: '#4A5568', border: '1px solid #E2E8F0' }}
        >
          ← Back to Top
        </button>
      </div>
    </div>
  );
}
