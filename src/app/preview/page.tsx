'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingInsights, MarketingInsightsPaywall } from '@/components/MarketingInsights';
import { BusinessPlanGenerator } from '@/components/BusinessPlanGenerator';
import { UpgradeModal, InlineUpgradePrompt } from '@/components/UpgradeModal';
import { ArxivPaper, CategoryMatch } from '@/types/arxiv';
import { generateProfitInsights } from '@/lib/profitInsights';

export default function PreviewPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'insights' | 'paywall' | 'business-plan' | 'upgrade'>('insights');

  // Mock paper data
  const mockPaper: ArxivPaper = {
    id: '2312.00001',
    title: 'Advanced Techniques in Large Language Model Fine-Tuning for Domain-Specific Applications',
    abstract: 'We present novel approaches to fine-tuning large language models that significantly reduce computational requirements while improving performance on domain-specific tasks. Our method introduces adaptive learning rate scheduling combined with selective layer freezing, achieving 40% faster training times and 15% better accuracy compared to standard fine-tuning approaches. We demonstrate the effectiveness of our technique across multiple domains including legal document analysis, medical diagnosis support, and financial forecasting. The proposed method is particularly effective for organizations with limited GPU resources, making advanced AI more accessible.',
    authors: [
      { name: 'Dr. Jane Smith' },
      { name: 'Prof. John Doe' },
      { name: 'Dr. Sarah Johnson' },
    ],
    categories: ['cs.AI', 'cs.LG', 'cs.CL'],
    primaryCategory: 'cs.AI',
    publishedDate: '2023-12-01',
    updatedDate: '2023-12-01',
    pdfUrl: 'https://arxiv.org/pdf/2312.00001',
    arxivUrl: 'https://arxiv.org/abs/2312.00001',
  };

  const mockCategoryMatches: CategoryMatch[] = [
    {
      category: 'agentic-coding',
      score: 85,
      matchedKeywords: ['LLM', 'fine-tuning', 'domain-specific', 'AI'],
    },
  ];

  const profitInsights = generateProfitInsights(mockPaper, mockCategoryMatches);
  const selectedStrategy = profitInsights?.strategies[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F3EF' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-lg border-b" style={{ backgroundColor: 'rgba(245, 243, 239, 0.95)', borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#1E293B' }}>
                🎨 Component Preview
              </h1>
              <p className="text-sm mt-1" style={{ color: '#64748B' }}>
                See all your new monetization components in action
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg font-medium transition-all"
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
            >
              ← Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveDemo('insights')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeDemo === 'insights' ? 'shadow-md' : ''
            }`}
            style={{
              backgroundColor: activeDemo === 'insights' ? '#2563EB' : '#FFFFFF',
              color: activeDemo === 'insights' ? '#FFFFFF' : '#475569',
            }}
          >
            💡 Marketing Insights
          </button>
          <button
            onClick={() => setActiveDemo('paywall')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeDemo === 'paywall' ? 'shadow-md' : ''
            }`}
            style={{
              backgroundColor: activeDemo === 'paywall' ? '#2563EB' : '#FFFFFF',
              color: activeDemo === 'paywall' ? '#FFFFFF' : '#475569',
            }}
          >
            🔒 Paywall
          </button>
          <button
            onClick={() => setActiveDemo('business-plan')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeDemo === 'business-plan' ? 'shadow-md' : ''
            }`}
            style={{
              backgroundColor: activeDemo === 'business-plan' ? '#2563EB' : '#FFFFFF',
              color: activeDemo === 'business-plan' ? '#FFFFFF' : '#475569',
            }}
          >
            📊 Business Plan Generator
          </button>
          <button
            onClick={() => setActiveDemo('upgrade')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeDemo === 'upgrade' ? 'shadow-md' : ''
            }`}
            style={{
              backgroundColor: activeDemo === 'upgrade' ? '#2563EB' : '#FFFFFF',
              color: activeDemo === 'upgrade' ? '#FFFFFF' : '#475569',
            }}
          >
            💎 Upgrade Prompts
          </button>
        </div>

        {/* Demo Content */}
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          {/* Marketing Insights Demo */}
          {activeDemo === 'insights' && (
            <div>
              <div className="mb-6 pb-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1E293B' }}>
                  Marketing Insights Component
                </h2>
                <p style={{ color: '#64748B' }}>
                  Shows monetization strategies with revenue estimates, implementation steps, and quick wins
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                    For Basic + Premium Users
                  </span>
                  <span style={{ color: '#64748B' }}>•</span>
                  <span style={{ color: '#64748B' }}>Uses existing profitInsights.ts library</span>
                </div>
              </div>

              <MarketingInsights
                paper={mockPaper}
                categoryMatches={mockCategoryMatches}
              />
            </div>
          )}

          {/* Paywall Demo */}
          {activeDemo === 'paywall' && (
            <div>
              <div className="mb-6 pb-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1E293B' }}>
                  Paywall Component
                </h2>
                <p style={{ color: '#64748B' }}>
                  Shown to free users when they try to access premium features
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                    For Free Users
                  </span>
                  <span style={{ color: '#64748B' }}>•</span>
                  <span style={{ color: '#64748B' }}>Encourages upgrades to Basic tier</span>
                </div>
              </div>

              <MarketingInsightsPaywall />
            </div>
          )}

          {/* Business Plan Generator Demo */}
          {activeDemo === 'business-plan' && selectedStrategy && (
            <div>
              <div className="mb-6 pb-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1E293B' }}>
                  Business Plan Generator
                </h2>
                <p style={{ color: '#64748B' }}>
                  12-section AI-powered business plan with financial projections and implementation timeline
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className="px-3 py-1 rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                    3 Free for All Users
                  </span>
                  <span className="px-3 py-1 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                    $0.99 for Basic Users
                  </span>
                  <span className="px-3 py-1 rounded-full" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                    Unlimited for Premium
                  </span>
                </div>
              </div>

              <BusinessPlanGenerator
                paper={mockPaper}
                categoryMatch={mockCategoryMatches[0]}
                selectedStrategy={selectedStrategy}
                userTier="free"
                freeGenerationsRemaining={3}
              />
            </div>
          )}

          {/* Upgrade Prompts Demo */}
          {activeDemo === 'upgrade' && (
            <div>
              <div className="mb-6 pb-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1E293B' }}>
                  Upgrade Prompts
                </h2>
                <p style={{ color: '#64748B' }}>
                  Beautiful upgrade CTAs that appear throughout the app
                </p>
              </div>

              <div className="space-y-6">
                {/* Inline Prompt Example */}
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#1E293B' }}>
                    Inline Upgrade Prompt
                  </h3>
                  <InlineUpgradePrompt
                    feature="Access unlimited business plans and advanced market analysis"
                    tier="premium"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#1E293B' }}>
                    Another Example
                  </h3>
                  <InlineUpgradePrompt
                    feature="Unlock marketing insights for all papers"
                    tier="basic"
                  />
                </div>

                {/* Full Modal Button */}
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#1E293B' }}>
                    Full Upgrade Modal
                  </h3>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    View Full Pricing Modal
                  </button>
                  <p className="text-sm mt-2" style={{ color: '#64748B' }}>
                    Beautiful two-tier pricing display with 7-day trial
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature List */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#1E293B' }}>
              ✅ What&apos;s Working Now
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#475569' }}>
              <li>✓ All components render correctly</li>
              <li>✓ Professional styling with your color scheme</li>
              <li>✓ Responsive design (mobile + desktop)</li>
              <li>✓ Interactive elements and hover states</li>
              <li>✓ Mock data displays properly</li>
            </ul>
          </div>

          <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FDBA74' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#9A3412' }}>
              ⏳ Needs Integration
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#9A3412' }}>
              <li>• Connect to real user session data</li>
              <li>• Wire up Stripe payment flows</li>
              <li>• Add to PaperDetail component</li>
              <li>• Connect to Claude AI API</li>
              <li>• Test with real paper data</li>
            </ul>
          </div>
        </div>

        {/* Code Reference */}
        <div className="mt-8 rounded-2xl p-6" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#1E293B' }}>
            📁 Component Files
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <p className="mb-2" style={{ color: '#64748B' }}>UI Components:</p>
              <ul className="space-y-1" style={{ color: '#475569' }}>
                <li>src/components/MarketingInsights.tsx</li>
                <li>src/components/BusinessPlanGenerator.tsx</li>
                <li>src/components/UpgradeModal.tsx</li>
              </ul>
            </div>
            <div>
              <p className="mb-2" style={{ color: '#64748B' }}>Backend:</p>
              <ul className="space-y-1" style={{ color: '#475569' }}>
                <li>src/app/api/ai/analyze-paper/route.ts</li>
                <li>src/app/api/ai/generate-business-plan/route.ts</li>
                <li>src/lib/stripe/</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier="free"
        highlightTier="premium"
        reason="See the beautiful pricing modal in action"
      />
    </div>
  );
}
