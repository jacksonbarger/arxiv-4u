'use client';

import { ArxivPaper, CategoryMatch } from '@/types/arxiv';

interface PaperTLDRProps {
  paper: ArxivPaper;
  categoryMatches?: CategoryMatch[];
}

/**
 * Generate a TL;DR summary from the paper abstract
 * Extracts key sentences and commercial insights
 */
function generateTLDR(paper: ArxivPaper, categoryMatches?: CategoryMatch[]): {
  whyItMatters: string;
  keyFindings: string[];
  commercialScore: number;
} {
  // Extract first 2 sentences as "why it matters"
  const sentences = paper.abstract.match(/[^.!?]+[.!?]+/g) || [];
  const whyItMatters = sentences.slice(0, 2).join(' ').trim();

  // Extract key findings from remaining sentences
  // Look for sentences with numbers, "we", "our", "results", "show", etc.
  const findingIndicators = ['we', 'our', 'results', 'show', 'demonstrate', 'achieve', 'propose', 'introduce'];
  const keyFindings = sentences
    .slice(2)
    .filter((s) => {
      const lower = s.toLowerCase();
      return (
        findingIndicators.some((ind) => lower.includes(ind)) ||
        /\d+%|\d+x|\d+ times|significantly|outperform/.test(lower)
      );
    })
    .slice(0, 3)
    .map((s) => s.trim());

  // Calculate commercial score based on category match
  const commercialScore = categoryMatches && categoryMatches[0] ? categoryMatches[0].score : 50;

  return {
    whyItMatters,
    keyFindings,
    commercialScore,
  };
}

/**
 * Get color for commercial score badge
 */
function getScoreColor(score: number): { bg: string; text: string; label: string } {
  if (score >= 80) {
    return { bg: '#DCFCE7', text: '#166534', label: 'High Potential' };
  } else if (score >= 60) {
    return { bg: '#FEF3C7', text: '#92400E', label: 'Moderate Potential' };
  } else {
    return { bg: '#FEE2E2', text: '#991B1B', label: 'Niche Application' };
  }
}

export function PaperTLDR({ paper, categoryMatches = [] }: PaperTLDRProps) {
  const { whyItMatters, keyFindings, commercialScore } = generateTLDR(paper, categoryMatches);
  const scoreColor = getScoreColor(commercialScore);

  return (
    <div
      className="rounded-2xl p-6 mb-6 border-l-4"
      style={{
        backgroundColor: '#EFF6FF',
        borderLeftColor: '#3B82F6',
        border: '1px solid #DBEAFE',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <h3 className="text-lg font-bold" style={{ color: '#1E40AF' }}>
            TL;DR
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: scoreColor.bg, color: scoreColor.text }}
          >
            {scoreColor.label}
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#3B82F6', color: '#FFFFFF' }}
          >
            {commercialScore}/100
          </span>
        </div>
      </div>

      {/* Why It Matters */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2" style={{ color: '#1E40AF' }}>
          💡 Why This Matters
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: '#1E40AF' }}>
          {whyItMatters || paper.abstract.slice(0, 200) + '...'}
        </p>
      </div>

      {/* Key Findings */}
      {keyFindings.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: '#1E40AF' }}>
            🎯 Key Findings
          </h4>
          <ul className="space-y-1.5">
            {keyFindings.map((finding, index) => (
              <li key={index} className="flex items-start gap-2 text-sm" style={{ color: '#3B82F6' }}>
                <span
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: '#3B82F6' }}
                />
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="mt-4 pt-4 border-t flex items-center gap-4 text-xs" style={{ borderColor: '#DBEAFE' }}>
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4"
            style={{ color: '#3B82F6' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span style={{ color: '#1E40AF' }}>
            Commercial Score: <strong>{commercialScore}/100</strong>
          </span>
        </div>
        {paper.authors.length > 0 && (
          <>
            <span style={{ color: '#DBEAFE' }}>•</span>
            <span style={{ color: '#3B82F6' }}>
              {paper.authors.length} author{paper.authors.length !== 1 ? 's' : ''}
            </span>
          </>
        )}
        {categoryMatches.length > 0 && (
          <>
            <span style={{ color: '#DBEAFE' }}>•</span>
            <span style={{ color: '#3B82F6' }}>
              {categoryMatches.length} categor{categoryMatches.length !== 1 ? 'ies' : 'y'} matched
            </span>
          </>
        )}
      </div>
    </div>
  );
}
