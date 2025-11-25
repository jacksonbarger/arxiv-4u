'use client';

import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_KEY = 'arxiv4u_onboarded';

export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(stored === 'true');
    } catch {
      // localStorage not available, skip onboarding
      setHasCompletedOnboarding(true);
    }
    setIsLoading(false);
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setHasCompletedOnboarding(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setHasCompletedOnboarding(false);
  }, []);

  return {
    hasCompletedOnboarding,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
}
