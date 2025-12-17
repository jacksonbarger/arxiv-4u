'use client';

import { GenerativeArt } from './ui/GenerativeArt';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Generative art background */}
      <GenerativeArt
        title="Welcome to Arxiv-4U Research Discovery"
        category="market-opportunity"
        variant="featured"
        className="absolute inset-0"
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-6 pb-12 md:pb-16 md:p-12">
        {/* Text content */}
        <div className="max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Research from arXiv, curated for you
          </h1>
          <p className="text-lg text-white/70 mb-8">
            Best time to read. Discover the latest AI/ML papers filtered by your interests.
          </p>

          {/* CTA Button */}
          <button
            onClick={onComplete}
            className="w-full md:w-auto px-8 py-4 bg-[#f97316] hover:bg-[#ea580c] text-white text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Status bar spacer for mobile */}
      <div className="absolute top-0 left-0 right-0 h-safe-top" />
    </div>
  );
}

export default OnboardingScreen;
