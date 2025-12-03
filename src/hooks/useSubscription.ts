import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface SubscriptionStatus {
  tier: 'free' | 'standard' | 'pro' | 'enterprise';
  freeGenerationsRemaining: number;
  totalGenerated: number;
  status?: 'active' | 'trialing' | 'canceled' | 'past_due' | null;
  trialEnd?: string | null;
  currentPeriodEnd?: string | null;
}

export function useSubscription() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      // Not logged in
      if (status === 'unauthenticated') {
        setSubscription({
          tier: 'free',
          freeGenerationsRemaining: 0,
          totalGenerated: 0,
        });
        setLoading(false);
        return;
      }

      // Still loading session
      if (status === 'loading') {
        return;
      }

      // Logged in - fetch subscription
      if (session?.user) {
        try {
          const res = await fetch('/api/user/subscription');

          if (!res.ok) {
            throw new Error('Failed to fetch subscription');
          }

          const data = await res.json();
          setSubscription(data);
        } catch (err) {
          console.error('Error fetching subscription:', err);
          setError('Failed to load subscription');
          // Default to free tier on error
          setSubscription({
            tier: 'free',
            freeGenerationsRemaining: 3,
            totalGenerated: 0,
          });
        } finally {
          setLoading(false);
        }
      }
    }

    fetchSubscription();
  }, [session, status]);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/user/subscription');

      if (!res.ok) {
        throw new Error('Failed to fetch subscription');
      }

      const data = await res.json();
      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    loading,
    error,
    refetch,
  };
}
