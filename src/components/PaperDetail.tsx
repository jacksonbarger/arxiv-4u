'use client';

import { useState } from 'react';
import { ArxivPaper, CategoryMatch, TopicCategory } from '@/types/arxiv';
import { AbstractArt } from './ui/AbstractArt';
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/keywords';
import { generateProfitInsights } from '@/lib/profitInsights';
import { MarketingInsights, MarketingInsightsPaywall } from './MarketingInsights';
import { BusinessPlanGenerator } from './BusinessPlanGenerator';
import { useSubscription } from '@/hooks';
import { estimateReadingTime, getReadingTimeBadgeColor } from '@/lib/readingTime';
import { PaperTLDR } from './PaperTLDR';
import { ShareButtons } from './ShareButtons';
import { RelatedPapers } from './RelatedPapers';
import { useReaderMode, getFontSizeValue, getLineHeightValue, getFontFamilyValue } from '@/contexts/ReaderModeContext';
import { ReaderModeControls } from './ui/ReaderModeControls';

interface PaperDetailProps {
  paper: ArxivPaper;
  categoryMatches?: CategoryMatch[];
  onBack: () => void;
  onBookmarkToggle: () => void;
  isBookmarked: boolean;
  // For related papers
  allPapers?: ArxivPaper[];
  categoryMatchesMap?: Map<string, CategoryMatch[]>;
  onPaperClick?: (paper: ArxivPaper) => void;
  isBookmarkedFn?: (paperId: string) => boolean;
  onBookmarkToggleFn?: (paperId: string) => void;
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


export function PaperDetail({
  paper,
  categoryMatches = [],
  onBack,
  onBookmarkToggle,
  isBookmarked,
  allPapers = [],
  categoryMatchesMap = new Map(),
  onPaperClick,
  isBookmarkedFn,
  onBookmarkToggleFn,
}: PaperDetailProps) {
  const primaryCategory: TopicCategory = categoryMatches[0]?.category || 'other';
  const color = CATEGORY_COLORS[primaryCategory];
  const profitInsights = generateProfitInsights(paper, categoryMatches);
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const readingTime = estimateReadingTime(paper.abstract);
  const readingTimeBadge = getReadingTimeBadgeColor(readingTime.category);

  // Reader mode settings
  const { fontSize, fontFamily, lineHeight, isReaderMode } = useReaderMode();
  const readerStyles = {
    fontSize: getFontSizeValue(fontSize),
    fontFamily: getFontFamilyValue(fontFamily),
    lineHeight: getLineHeightValue(lineHeight),
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F3EF' }}>
      {/* Hero section - hidden in reader mode */}
      {!isReaderMode && (
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

          {/* Action buttons - fixed position */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <div className="bg-black/20 backdrop-blur-sm rounded-full">
              <ShareButtons paper={paper} categoryMatches={categoryMatches} variant="compact" />
            </div>
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
          <div className="h-32 md:h-40 relative">
            <AbstractArt
              paperId={paper.id}
              category={primaryCategory}
              className="absolute inset-0"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #F5F3EF, transparent, rgba(0,0,0,0.2))' }} />
          </div>
        </div>
      )}

      {/* Back button for reader mode */}
      {isReaderMode && (
        <div className="sticky top-4 left-4 z-20 px-4 pt-4">
          <button
            type="button"
            aria-label="Go back"
            onClick={onBack}
            className="p-2 rounded-full transition-colors"
            style={{ backgroundColor: '#EFECE6', color: '#4A5568' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EFECE6'}
          >
            <svg
              className="w-6 h-6"
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
      )}

      {/* Content */}
      <div className={`px-4 md:px-6 lg:px-8 mx-auto relative z-10 ${isReaderMode ? 'max-w-2xl pt-4' : 'max-w-3xl -mt-8'}`}>
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#4A5568' }}>
          {paper.title}
        </h1>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-sm mb-6" style={{ color: '#718096' }}>
          <span>Posted {formatDate(paper.publishedDate)}</span>
          <span style={{ color: '#C0E5E8' }}>•</span>
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: readingTimeBadge.bg, color: readingTimeBadge.text }}
          >
            {readingTime.displayText}
          </span>
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

        {/* TL;DR Section */}
        <PaperTLDR paper={paper} categoryMatches={categoryMatches} />

        {/* Abstract */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#4A5568' }}>
            Abstract
          </h2>
          <p
            className="whitespace-pre-line"
            style={{
              color: '#718096',
              ...readerStyles,
            }}
          >
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

        {/* Marketing Insights Section */}
        {!subscriptionLoading && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💰</span>
              <h2 className="text-lg font-semibold" style={{ color: '#4A5568' }}>
                Marketing Insights
              </h2>
            </div>

            {/* Show full insights for Basic/Premium users, paywall for free users */}
            {subscription?.tier === 'basic' || subscription?.tier === 'premium' ? (
              <MarketingInsights paper={paper} categoryMatches={categoryMatches} />
            ) : (
              <MarketingInsightsPaywall />
            )}
          </div>
        )}

        {/* Business Plan Generator Section */}
        {!subscriptionLoading && categoryMatches.length > 0 && profitInsights && (
          <div id="business-plan-generator" className="mb-8 scroll-mt-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📊</span>
              <h2 className="text-lg font-semibold" style={{ color: '#4A5568' }}>
                Business Plan Generator
              </h2>
            </div>

            <BusinessPlanGenerator
              paper={paper}
              categoryMatch={categoryMatches[0]}
              selectedStrategy={profitInsights.strategies[0]}
              userTier={subscription?.tier || 'free'}
              freeGenerationsRemaining={subscription?.freeGenerationsRemaining ?? 0}
            />
          </div>
        )}

        {/* Related Papers */}
        {allPapers.length > 0 && onPaperClick && isBookmarkedFn && onBookmarkToggleFn && (
          <RelatedPapers
            currentPaper={paper}
            allPapers={allPapers}
            categoryMatchesMap={categoryMatchesMap}
            onPaperClick={onPaperClick}
            onBookmarkToggle={onBookmarkToggleFn}
            isBookmarked={isBookmarkedFn}
          />
        )}

        {/* Share Section */}
        <ShareButtons paper={paper} categoryMatches={categoryMatches} />

        {/* Action buttons */}
        <div className="flex gap-3 pb-24 mt-8">
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

      {/* Reader Mode Controls */}
      <ReaderModeControls />
    </div>
  );
}

export default PaperDetail;
