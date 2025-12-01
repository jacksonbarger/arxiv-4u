'use client';

import { useEffect } from 'react';

/**
 * Client component that tracks referral codes from URL parameters
 * Usage: Add this component to your root layout
 *
 * Example URL: https://yourapp.com/?ref=ABC123
 * This will store the referral code in localStorage for later use during signup
 */
export function ReferralTracker() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const referralCode = params.get('ref');

    if (referralCode) {
      // Store referral code in localStorage for use during signup
      localStorage.setItem('referral_code', referralCode);

      // Optional: Remove the ref parameter from URL to clean it up
      const url = new URL(window.location.href);
      url.searchParams.delete('ref');
      window.history.replaceState({}, '', url.toString());

      console.log('Referral code tracked:', referralCode);
    }
  }, []);

  // This component renders nothing, it just handles side effects
  return null;
}
