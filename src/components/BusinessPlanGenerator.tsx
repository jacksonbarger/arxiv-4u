'use client';

import { useState } from 'react';
import { ArxivPaper, CategoryMatch } from '@/types/arxiv';
import { ProfitStrategy } from '@/lib/profitInsights';
import { BusinessPlanData } from '@/types/database';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe outside component to avoid re-creating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface BusinessPlanGeneratorProps {
  paper: ArxivPaper;
  categoryMatch: CategoryMatch;
  selectedStrategy: ProfitStrategy;
  userTier: 'free' | 'standard' | 'pro' | 'enterprise';
  freeGenerationsRemaining: number;
  onComplete?: (plan: BusinessPlanData) => void;
  onUpgradeClick?: () => void;
}

export function BusinessPlanGenerator({
  paper,
  categoryMatch,
  selectedStrategy,
  userTier,
  freeGenerationsRemaining,
  onComplete,
  onUpgradeClick,
}: BusinessPlanGeneratorProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'generating' | 'complete'>('form');
  const [userInputs, setUserInputs] = useState({
    budget: '',
    timeline: '',
    experienceLevel: 'intermediate' as 'beginner' | 'intermediate' | 'expert',
    targetMarket: '',
    teamSize: '',
  });
  const [generatedPlan, setGeneratedPlan] = useState<BusinessPlanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  // Create payment intent when entering payment step
  const initiatePayment = async () => {
    try {
      setError(null);
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperId: paper.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to initiate payment');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setStep('payment');
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate payment');
    }
  };

  // Generate business plan (with optional payment intent)
  const handleGenerate = async (paidPaymentIntentId?: string) => {
    try {
      setStep('generating');
      setError(null);
      setProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch('/api/ai/generate-business-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paper,
          categoryMatch,
          selectedStrategy,
          userInputs,
          paymentIntentId: paidPaymentIntentId,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();

        // Handle payment required - show payment modal for standard users
        if (response.status === 402) {
          if (userTier === 'standard' || (userTier === 'free' && freeGenerationsRemaining === 0)) {
            await initiatePayment();
            return;
          }
          setError('payment_required');
          setStep('form');
          return;
        }

        // Handle upgrade required
        if (response.status === 403) {
          setError('upgrade_required');
          setStep('form');
          return;
        }

        throw new Error(errorData.error || 'Failed to generate business plan');
      }

      const data = await response.json();
      setProgress(100);
      setGeneratedPlan(data.planData);
      setStep('complete');

      if (onComplete) {
        onComplete(data.planData);
      }
    } catch (err) {
      console.error('Error generating business plan:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('form');
    }
  };

  // Handle successful payment
  const onPaymentSuccess = (confirmedPaymentIntentId: string) => {
    setPaymentIntentId(confirmedPaymentIntentId);
    handleGenerate(confirmedPaymentIntentId);
  };

  if (step === 'generating') {
    return (
      <div className="py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse" style={{ backgroundColor: '#DBEAFE' }}>
            <svg className="w-8 h-8" style={{ color: '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h3 className="text-xl font-bold mb-2" style={{ color: '#4A5568' }}>
            Generating Your Business Plan...
          </h3>

          <p className="mb-6" style={{ color: '#718096' }}>
            Our AI is analyzing the research and creating a comprehensive plan tailored to your needs.
          </p>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full mb-4" style={{ backgroundColor: '#E2E8F0' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ backgroundColor: '#2563EB', width: `${progress}%` }}
            />
          </div>

          <p className="text-sm" style={{ color: '#718096' }}>
            {progress}% complete
          </p>

          <div className="mt-8 text-left space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${progress > 10 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm" style={{ color: '#718096' }}>Analyzing research paper</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${progress > 30 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm" style={{ color: '#718096' }}>Researching market opportunities</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${progress > 50 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm" style={{ color: '#718096' }}>Creating financial projections</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${progress > 70 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm" style={{ color: '#718096' }}>Building implementation timeline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${progress > 90 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm" style={{ color: '#718096' }}>Finalizing your plan</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment' && clientSecret) {
    return (
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
            <svg className="w-8 h-8" style={{ color: '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#1E293B' }}>
            Complete Payment
          </h3>
          <p className="text-sm mb-4" style={{ color: '#64748B' }}>
            One-time payment of <strong>$0.99</strong> for this business plan
          </p>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#2563EB',
                borderRadius: '8px',
              },
            },
          }}
        >
          <PaymentForm
            onSuccess={onPaymentSuccess}
            onCancel={() => {
              setStep('form');
              setClientSecret(null);
              setPaymentIntentId(null);
            }}
          />
        </Elements>
      </div>
    );
  }

  if (step === 'complete' && generatedPlan) {
    return (
      <BusinessPlanViewer
        plan={generatedPlan}
        paper={paper}
        strategy={selectedStrategy}
      />
    );
  }

  // Input form
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2" style={{ color: '#4A5568' }}>
          Generate Business Plan
        </h3>
        <p style={{ color: '#718096' }}>
          Provide some context to create a personalized business plan for: <strong>{selectedStrategy.title}</strong>
        </p>
      </div>

      {/* User Context Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#4A5568' }}>
            Budget (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., $10K, $50K, Bootstrap"
            value={userInputs.budget}
            onChange={(e) => setUserInputs({ ...userInputs, budget: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#4A5568' }}>
            Timeline (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., 3 months, ASAP, Part-time"
            value={userInputs.timeline}
            onChange={(e) => setUserInputs({ ...userInputs, timeline: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#4A5568' }}>
            Experience Level
          </label>
          <select
            value={userInputs.experienceLevel}
            onChange={(e) => setUserInputs({ ...userInputs, experienceLevel: e.target.value as 'beginner' | 'intermediate' | 'expert' })}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
          >
            <option value="beginner">Beginner - First time founder</option>
            <option value="intermediate">Intermediate - Some experience</option>
            <option value="expert">Expert - Serial entrepreneur</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#4A5568' }}>
            Target Market (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., B2B SaaS, E-commerce, Developers"
            value={userInputs.targetMarket}
            onChange={(e) => setUserInputs({ ...userInputs, targetMarket: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#4A5568' }}>
            Team Size (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Solo, 2-3 people, Small team"
            value={userInputs.teamSize}
            onChange={(e) => setUserInputs({ ...userInputs, teamSize: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
            style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
          />
        </div>
      </div>

      {/* Cost/Usage Info */}
      <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#0284C7' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1" style={{ color: '#0C4A6E' }}>
              {(userTier === 'pro' || userTier === 'enterprise') && 'Included in Pro'}
              {userTier === 'standard' && 'Pay $0.99 for this business plan'}
              {userTier === 'free' && freeGenerationsRemaining > 0 && `${freeGenerationsRemaining} free generation${freeGenerationsRemaining === 1 ? '' : 's'} remaining`}
              {userTier === 'free' && freeGenerationsRemaining === 0 && 'All free generations used'}
            </p>
            <p className="text-xs" style={{ color: '#075985' }}>
              Comprehensive 12-section plan with financial projections, implementation timeline, and market analysis
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && error !== 'payment_required' && error !== 'upgrade_required' && (
        <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5' }}>
          <p className="text-sm" style={{ color: '#991B1B' }}>{error}</p>
        </div>
      )}

      {/* Upgrade Required Message */}
      {error === 'upgrade_required' && (
        <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}>
          <p className="text-sm mb-3" style={{ color: '#92400E' }}>
            You&apos;ve used all your free business plan generations. Upgrade to continue!
          </p>
          {onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ backgroundColor: '#F59E0B', color: '#FFFFFF' }}
            >
              View Upgrade Options
            </button>
          )}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={() => handleGenerate()}
        disabled={userTier === 'free' && freeGenerationsRemaining === 0 && !onUpgradeClick}
        className="w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1D4ED8';
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#2563EB';
        }}
      >
        {(userTier === 'pro' || userTier === 'enterprise')
          ? 'Generate Business Plan (Included)'
          : userTier === 'standard'
            ? 'Generate Business Plan ($0.99)'
            : freeGenerationsRemaining > 0
              ? 'Generate Business Plan (Free)'
              : 'Upgrade to Generate'}
      </button>
    </div>
  );
}

// ========================================
// PAYMENT FORM COMPONENT (Stripe Elements)
// ========================================

interface PaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

function PaymentForm({ onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href, // Not used with redirect: 'if_required'
        },
        redirect: 'if_required',
      });

      if (error) {
        setPaymentError(error.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        setPaymentError('Payment was not completed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement />
      </div>

      {paymentError && (
        <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5' }}>
          <p className="text-sm" style={{ color: '#991B1B' }}>{paymentError}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
          style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
          style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
        >
          {isProcessing ? 'Processing...' : 'Pay $0.99'}
        </button>
      </div>

      <p className="text-xs text-center mt-4" style={{ color: '#94A3B8' }}>
        Secure payment powered by Stripe
      </p>
    </form>
  );
}

// Business Plan Viewer Component
interface BusinessPlanViewerProps {
  plan: BusinessPlanData;
  paper: ArxivPaper;
  strategy: ProfitStrategy;
}

function BusinessPlanViewer({ plan, paper, strategy }: BusinessPlanViewerProps) {
  const [activeSection, setActiveSection] = useState('executive');

  const sections = [
    { id: 'executive', label: 'Executive Summary', icon: '📊' },
    { id: 'technology', label: 'Technology', icon: '⚙️' },
    { id: 'market', label: 'Market Analysis', icon: '📈' },
    { id: 'competition', label: 'Competition', icon: '🎯' },
    { id: 'product', label: 'Product Strategy', icon: '🚀' },
    { id: 'revenue', label: 'Revenue Model', icon: '💰' },
    { id: 'gtm', label: 'Go-to-Market', icon: '📣' },
    { id: 'financials', label: 'Financials', icon: '💵' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'risks', label: 'Risks', icon: '⚠️' },
    { id: 'resources', label: 'Resources', icon: '🛠️' },
    { id: 'metrics', label: 'Success Metrics', icon: '🎯' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b" style={{ borderColor: '#E2E8F0' }}>
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#1E293B' }}>
          Business Plan: {strategy.title}
        </h2>
        <p style={{ color: '#64748B' }}>
          Based on: {paper.title}
        </p>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeSection === section.id
                ? 'shadow-md'
                : ''
            }`}
            style={{
              backgroundColor: activeSection === section.id ? '#2563EB' : '#F1F5F9',
              color: activeSection === section.id ? '#FFFFFF' : '#475569',
            }}
          >
            {section.icon} {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="rounded-2xl p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        {activeSection === 'executive' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E293B' }}>Opportunity</h3>
              <p style={{ color: '#475569', lineHeight: '1.7' }}>{plan.executiveSummary.opportunity}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E293B' }}>Solution</h3>
              <p style={{ color: '#475569', lineHeight: '1.7' }}>{plan.executiveSummary.solution}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E293B' }}>Market Size</h3>
              <p style={{ color: '#475569', lineHeight: '1.7' }}>{plan.executiveSummary.marketSize}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E293B' }}>Revenue</h3>
              <p style={{ color: '#475569', lineHeight: '1.7' }}>{plan.executiveSummary.revenue}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E293B' }}>Next Steps</h3>
              <p style={{ color: '#475569', lineHeight: '1.7' }}>{plan.executiveSummary.askOrNext}</p>
            </div>
          </div>
        )}

        {/* Add more section renderers here - for brevity showing just executive */}
        {/* In a full implementation, each section would have its own detailed render */}
      </div>

      {/* Export Actions */}
      <div className="mt-6 flex gap-3">
        <button
          className="px-6 py-3 rounded-lg font-medium transition-all"
          style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
        >
          📄 Export PDF (Premium)
        </button>
        <button
          className="px-6 py-3 rounded-lg font-medium transition-all"
          style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
        >
          📋 Copy to Notion
        </button>
      </div>
    </div>
  );
}
