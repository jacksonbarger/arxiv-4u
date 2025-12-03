'use client';

import { useState, useEffect } from 'react';
import { ArxivPaper, CategoryMatch } from '@/types/arxiv';
import { generateProfitInsights, ProfitInsights, getDifficultyColor, getDifficultyLabel } from '@/lib/profitInsights';
import { UpgradeModal } from './UpgradeModal';

interface MarketingInsightsProps {
  paper: ArxivPaper;
  categoryMatches?: CategoryMatch[];
}

export function MarketingInsights({ paper, categoryMatches = [] }: MarketingInsightsProps) {
  const [insights, setInsights] = useState<ProfitInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        setLoading(true);

        // Generate profit insights from existing library
        if (categoryMatches.length > 0) {
          const profitInsights = generateProfitInsights(paper, categoryMatches);
          setInsights(profitInsights);
        } else {
          setError('No category matches available');
        }
      } catch (err) {
        console.error('Error loading insights:', err);
        setError('Failed to load marketing insights');
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, [paper, categoryMatches]);

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="w-8 h-8 border-2 border-[#9EDCE1] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm" style={{ color: '#718096' }}>
          Analyzing business opportunities...
        </p>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="py-8 text-center">
        <p style={{ color: '#E53E3E' }}>{error || 'No insights available'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Context */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <h3 className="text-lg font-semibold mb-3" style={{ color: '#4A5568' }}>
          💡 Market Opportunity
        </h3>
        <p style={{ color: '#718096', lineHeight: '1.6' }}>
          {insights.marketContext}
        </p>
      </div>

      {/* Monetization Strategies */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#4A5568' }}>
          🚀 Monetization Strategies
        </h3>
        <div className="space-y-4">
          {insights.strategies.map((strategy, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 transition-all hover:shadow-md"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              {/* Strategy Header */}
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-base font-semibold flex-1" style={{ color: '#4A5568' }}>
                  {index + 1}. {strategy.title}
                </h4>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium ml-4"
                  style={{
                    backgroundColor: `${getDifficultyColor(strategy.difficulty)}15`,
                    color: getDifficultyColor(strategy.difficulty),
                  }}
                >
                  {getDifficultyLabel(strategy.difficulty)}
                </span>
              </div>

              {/* Description */}
              <p className="mb-4" style={{ color: '#718096', fontSize: '14px', lineHeight: '1.6' }}>
                {strategy.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg p-3" style={{ backgroundColor: '#F7FAFC' }}>
                  <div className="text-xs font-medium mb-1" style={{ color: '#718096' }}>
                    Revenue Potential
                  </div>
                  <div className="text-sm font-semibold" style={{ color: '#10B981' }}>
                    {strategy.estimatedRevenue}
                  </div>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: '#F7FAFC' }}>
                  <div className="text-xs font-medium mb-1" style={{ color: '#718096' }}>
                    Time to Market
                  </div>
                  <div className="text-sm font-semibold" style={{ color: '#6366F1' }}>
                    {strategy.timeToMarket}
                  </div>
                </div>
              </div>

              {/* Implementation Steps */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium" style={{ color: '#4A5568' }}>
                  📋 Implementation Steps ({strategy.steps.length})
                </summary>
                <ol className="mt-3 space-y-2 pl-5 list-decimal">
                  {strategy.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-sm" style={{ color: '#718096' }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Wins */}
      {insights.quickWins && insights.quickWins.length > 0 && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FDBA74' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#EA580C' }}>
            ⚡ Quick Wins
          </h3>
          <ul className="space-y-2">
            {insights.quickWins.map((win, index) => (
              <li key={index} className="flex items-start gap-2">
                <span style={{ color: '#EA580C' }}>•</span>
                <span style={{ color: '#9A3412', fontSize: '14px' }}>{win}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Resources */}
      {insights.resources && insights.resources.length > 0 && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#F0F9FF', border: '1px solid #7DD3FC' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#0369A1' }}>
            🛠️ Recommended Resources
          </h3>
          <ul className="space-y-2">
            {insights.resources.map((resource, index) => (
              <li key={index} className="flex items-start gap-2">
                <span style={{ color: '#0369A1' }}>•</span>
                <span style={{ color: '#075985', fontSize: '14px' }}>{resource}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA to Generate Business Plan */}
      <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#EFF6FF', border: '2px solid #60A5FA' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E40AF' }}>
          Ready to Build This?
        </h3>
        <p className="mb-4" style={{ color: '#3B82F6', fontSize: '14px' }}>
          Generate a detailed 12-section business plan with financial projections, implementation timeline, and more.
        </p>
        <button
          onClick={() => {
            // Scroll to business plan generator section
            const element = document.getElementById('business-plan-generator');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
          style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
        >
          Generate Full Business Plan →
        </button>
      </div>
    </div>
  );
}

// Paywall component for free users
export function MarketingInsightsPaywall() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <>
      <div className="py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
            <svg className="w-8 h-8" style={{ color: '#F59E0B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h3 className="text-xl font-bold mb-3" style={{ color: '#4A5568' }}>
            Unlock Marketing Insights
          </h3>

          <p className="mb-6" style={{ color: '#718096' }}>
            Get detailed monetization strategies, revenue estimates, and implementation plans for every paper.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
            >
              Start 7-Day Free Trial - Basic $9.99/mo
            </button>

            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full px-6 py-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor: '#FFFFFF', color: '#2563EB', border: '2px solid #2563EB' }}
            >
              See All Plans →
            </button>
          </div>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm" style={{ color: '#718096' }}>
              ✓ Unlimited bookmarks &nbsp;&nbsp; ✓ Commercial scores &nbsp;&nbsp; ✓ Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Import and render UpgradeModal */}
      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentTier="free"
          highlightTier="standard"
          reason="Unlock marketing insights to see monetization strategies for every paper"
        />
      )}
    </>
  );
}
