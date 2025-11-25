'use client';

import { useState } from 'react';
import { ArxivPaper, CategoryMatch, TopicCategory } from '@/types/arxiv';
import { AbstractArt } from './ui/AbstractArt';
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/keywords';
import { generateProfitInsights, getDifficultyColor, getDifficultyLabel, ProfitStrategy } from '@/lib/profitInsights';

interface PaperDetailProps {
  paper: ArxivPaper;
  categoryMatches?: CategoryMatch[];
  onBack: () => void;
  onBookmarkToggle: () => void;
  isBookmarked: boolean;
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
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function StrategyCard({ strategy, index }: { strategy: ProfitStrategy; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start gap-3 text-left"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{ backgroundColor: '#DAF4EF', color: '#4A5568' }}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold mb-1" style={{ color: '#4A5568' }}>
            {strategy.title}
          </h4>
          <p className="text-sm line-clamp-2" style={{ color: '#718096' }}>
            {strategy.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: '#EFECE6', color: '#4A5568' }}
            >
              {strategy.estimatedRevenue}
            </span>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: '#EFECE6', color: '#4A5568' }}
            >
              {strategy.timeToMarket}
            </span>
            <span
              className="text-xs px-2 py-1 rounded-full text-white"
              style={{ backgroundColor: getDifficultyColor(strategy.difficulty) }}
            >
              {getDifficultyLabel(strategy.difficulty)}
            </span>
          </div>
        </div>
        <svg
          className={`w-5 h-5 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          style={{ color: '#718096' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="pl-11">
            <h5 className="text-sm font-semibold mb-2" style={{ color: '#4A5568' }}>
              Implementation Steps:
            </h5>
            <ol className="space-y-2">
              {strategy.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm" style={{ color: '#718096' }}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                    style={{ backgroundColor: '#C0E5E8', color: '#4A5568' }}
                  >
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export function PaperDetail({
  paper,
  categoryMatches = [],
  onBack,
  onBookmarkToggle,
  isBookmarked,
}: PaperDetailProps) {
  const [showAllStrategies, setShowAllStrategies] = useState(false);
  const primaryCategory: TopicCategory = categoryMatches[0]?.category || 'other';
  const color = CATEGORY_COLORS[primaryCategory];
  const profitInsights = generateProfitInsights(paper, categoryMatches);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F3EF' }}>
      {/* Hero section */}
      <div className="relative">
        {/* Back button - fixed position */}
        <div className="absolute top-4 left-4 z-20">
          <button
            type="button"
            aria-label="Go back"
            onClick={onBack}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Category label - fixed position */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <span className="text-sm font-medium text-white/90">
            {CATEGORY_LABELS[primaryCategory]}
          </span>
        </div>

        {/* Bookmark button - fixed position */}
        <div className="absolute top-4 right-4 z-20">
          <button
            type="button"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            onClick={onBookmarkToggle}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
          >
            <svg
              className="w-6 h-6"
              style={{ color: isBookmarked ? '#9EDCE1' : '#FFFFFF' }}
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

        {/* Hero image */}
        <div className="aspect-[4/3] md:aspect-[21/9] relative">
          <AbstractArt
            paperId={paper.id}
            category={primaryCategory}
            className="absolute inset-0"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #F5F3EF, transparent, rgba(0,0,0,0.2))' }} />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 lg:px-8 max-w-3xl mx-auto -mt-8 relative z-10">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#4A5568' }}>
          {paper.title}
        </h1>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-sm mb-6" style={{ color: '#718096' }}>
          <span>Posted {formatDate(paper.publishedDate)}</span>
        </div>

        {/* Paper image placeholder with caption */}
        <div className="rounded-2xl overflow-hidden mb-6" style={{ backgroundColor: '#EFECE6' }}>
          <div className="aspect-video relative">
            <AbstractArt
              paperId={paper.id + '-detail'}
              category={primaryCategory}
              className="absolute inset-0"
            />
          </div>
          <div className="p-3 text-xs text-center" style={{ color: '#718096' }}>
            Abstract visualization for {paper.title.slice(0, 50)}...
          </div>
        </div>

        {/* Source info */}
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl" style={{ backgroundColor: '#EFECE6' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C0E5E8' }}>
            <span className="text-xs font-bold" style={{ color: '#4A5568' }}>arX</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold" style={{ color: '#4A5568' }}>arXiv</span>
              <svg className="w-4 h-4" style={{ color: '#9EDCE1' }} fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-xs" style={{ color: '#718096' }}>
              Paper ID: {paper.id}
            </div>
          </div>
          <a
            href={paper.arxivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{ backgroundColor: '#C0E5E8', color: '#4A5568' }}
          >
            View
          </a>
        </div>

        {/* Category badges */}
        {categoryMatches.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categoryMatches.slice(0, 4).map((match) => (
              <span
                key={match.category}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: CATEGORY_COLORS[match.category] }}
              >
                <span>{CATEGORY_ICONS[match.category]}</span>
                {CATEGORY_LABELS[match.category]}
                <span className="ml-1 opacity-75">{match.score}%</span>
              </span>
            ))}
          </div>
        )}

        {/* Abstract */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#4A5568' }}>
            Abstract
          </h2>
          <p className="leading-relaxed whitespace-pre-line" style={{ color: '#718096' }}>
            {paper.abstract}
          </p>
        </div>

        {/* Authors */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#4A5568' }}>
            Authors
          </h2>
          <div className="flex flex-wrap gap-2">
            {paper.authors.map((author, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full text-sm"
                style={{ backgroundColor: '#EFECE6', color: '#4A5568' }}
              >
                {author.name}
              </span>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#4A5568' }}>
            arXiv Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {paper.categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1.5 rounded-lg text-sm font-mono"
                style={{ backgroundColor: '#DEEBEB', color: '#4A5568' }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Profit Opportunities Section */}
        {profitInsights && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💰</span>
              <h2 className="text-lg font-semibold" style={{ color: '#4A5568' }}>
                Profit Opportunities
              </h2>
            </div>

            {/* Market Context */}
            <div
              className="p-4 rounded-2xl mb-4"
              style={{ backgroundColor: '#DAF4EF', border: '1px solid #9EDCE1' }}
            >
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: '#4A5568' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#4A5568' }}>
                    Market Context
                  </h3>
                  <p className="text-sm" style={{ color: '#4A5568' }}>
                    {profitInsights.marketContext}
                  </p>
                </div>
              </div>
            </div>

            {/* Monetization Strategies */}
            <h3 className="font-semibold mb-3" style={{ color: '#4A5568' }}>
              Monetization Strategies
            </h3>
            <div className="space-y-3 mb-4">
              {(showAllStrategies
                ? profitInsights.strategies
                : profitInsights.strategies.slice(0, 2)
              ).map((strategy, i) => (
                <StrategyCard key={i} strategy={strategy} index={i} />
              ))}
            </div>

            {profitInsights.strategies.length > 2 && (
              <button
                type="button"
                onClick={() => setShowAllStrategies(!showAllStrategies)}
                className="w-full py-2 text-sm font-medium rounded-xl transition-colors mb-4"
                style={{ backgroundColor: '#EFECE6', color: '#4A5568' }}
              >
                {showAllStrategies
                  ? 'Show Less'
                  : `Show ${profitInsights.strategies.length - 2} More Strategies`}
              </button>
            )}

            {/* Quick Wins */}
            <div
              className="p-4 rounded-2xl mb-4"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#4A5568' }}>
                <span>⚡</span> Quick Wins (Start Today)
              </h3>
              <ul className="space-y-2">
                {profitInsights.quickWins.map((win, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#718096' }}>
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: '#9EDCE1' }}
                    />
                    {win}
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div
              className="p-4 rounded-2xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#4A5568' }}>
                <span>🛠️</span> Recommended Tools & Resources
              </h3>
              <div className="flex flex-wrap gap-2">
                {profitInsights.resources.map((resource, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{ backgroundColor: '#EFECE6', color: '#4A5568' }}
                  >
                    {resource}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pb-24">
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 rounded-2xl text-center font-semibold transition-colors"
            style={{ backgroundColor: '#9EDCE1', color: '#4A5568' }}
          >
            View PDF
          </a>
          <a
            href={paper.arxivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 rounded-2xl text-center font-semibold transition-colors"
            style={{ border: '2px solid #C0E5E8', color: '#4A5568', backgroundColor: 'transparent' }}
          >
            arXiv Page
          </a>
        </div>
      </div>
    </div>
  );
}

export default PaperDetail;
