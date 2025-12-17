'use client';

import { useState, useEffect, useCallback } from 'react';
import { TopicCategory } from '@/types/arxiv';
import { KeywordEntry, CATEGORY_KEYWORDS } from './keywords';

const STORAGE_KEY = 'arxiv4u-user-keywords';

export interface UserKeywordsState {
  // Keywords added by the user
  added: Record<TopicCategory, KeywordEntry[]>;
  // Keywords removed/disabled by the user (from defaults)
  removed: Record<TopicCategory, string[]>;
}

const createEmptyState = (): UserKeywordsState => ({
  added: {
    'agentic-coding': [],
    'image-generation': [],
    'video-generation': [],
    'ai-content-creators': [],
    'comfyui': [],
    'runpod': [],
    'market-opportunity': [],
    'nlp': [],
    'llm': [],
    'rag': [],
    'multimodal': [],
    'robotics': [],
    'rl': [],
    'transformers': [],
    'safety': [],
    'science': [],
    'efficiency': [],
    'other': [],
  },
  removed: {
    'agentic-coding': [],
    'image-generation': [],
    'video-generation': [],
    'ai-content-creators': [],
    'comfyui': [],
    'runpod': [],
    'market-opportunity': [],
    'nlp': [],
    'llm': [],
    'rag': [],
    'multimodal': [],
    'robotics': [],
    'rl': [],
    'transformers': [],
    'safety': [],
    'science': [],
    'efficiency': [],
    'other': [],
  },
});

export function useUserKeywords() {
  const [userKeywords, setUserKeywords] = useState<UserKeywordsState>(createEmptyState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserKeywordsState;
        setUserKeywords(parsed);
      }
    } catch (error) {
      console.error('Failed to load user keywords:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userKeywords));
      } catch (error) {
        console.error('Failed to save user keywords:', error);
      }
    }
  }, [userKeywords, isLoaded]);

  // Add a custom keyword
  const addKeyword = useCallback((
    category: TopicCategory,
    term: string,
    weight: number = 8
  ) => {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) return;

    setUserKeywords(prev => {
      // Check if already exists in added
      const alreadyAdded = prev.added[category].some(
        k => k.term.toLowerCase() === normalizedTerm
      );
      if (alreadyAdded) return prev;

      // Check if it was removed (re-enabling a default)
      const wasRemoved = prev.removed[category].includes(normalizedTerm);
      if (wasRemoved) {
        return {
          ...prev,
          removed: {
            ...prev.removed,
            [category]: prev.removed[category].filter(t => t !== normalizedTerm),
          },
        };
      }

      // Check if it exists in defaults
      const existsInDefaults = CATEGORY_KEYWORDS[category].some(
        k => k.term.toLowerCase() === normalizedTerm
      );
      if (existsInDefaults) return prev;

      // Add new keyword
      return {
        ...prev,
        added: {
          ...prev.added,
          [category]: [
            ...prev.added[category],
            { term: normalizedTerm, weight },
          ],
        },
      };
    });
  }, []);

  // Remove a keyword (either user-added or disable a default)
  const removeKeyword = useCallback((category: TopicCategory, term: string) => {
    const normalizedTerm = term.trim().toLowerCase();

    setUserKeywords(prev => {
      // Check if it's a user-added keyword
      const isUserAdded = prev.added[category].some(
        k => k.term.toLowerCase() === normalizedTerm
      );

      if (isUserAdded) {
        // Remove from added
        return {
          ...prev,
          added: {
            ...prev.added,
            [category]: prev.added[category].filter(
              k => k.term.toLowerCase() !== normalizedTerm
            ),
          },
        };
      }

      // It's a default keyword - add to removed list
      const alreadyRemoved = prev.removed[category].includes(normalizedTerm);
      if (alreadyRemoved) return prev;

      return {
        ...prev,
        removed: {
          ...prev.removed,
          [category]: [...prev.removed[category], normalizedTerm],
        },
      };
    });
  }, []);

  // Update weight of a user-added keyword
  const updateKeywordWeight = useCallback((
    category: TopicCategory,
    term: string,
    weight: number
  ) => {
    const normalizedTerm = term.trim().toLowerCase();

    setUserKeywords(prev => ({
      ...prev,
      added: {
        ...prev.added,
        [category]: prev.added[category].map(k =>
          k.term.toLowerCase() === normalizedTerm
            ? { ...k, weight: Math.max(1, Math.min(10, weight)) }
            : k
        ),
      },
    }));
  }, []);

  // Reset a category to defaults
  const resetCategory = useCallback((category: TopicCategory) => {
    setUserKeywords(prev => ({
      ...prev,
      added: { ...prev.added, [category]: [] },
      removed: { ...prev.removed, [category]: [] },
    }));
  }, []);

  // Reset all categories to defaults
  const resetAll = useCallback(() => {
    setUserKeywords(createEmptyState());
  }, []);

  // Get effective keywords for a category (defaults + added - removed)
  const getEffectiveKeywords = useCallback((category: TopicCategory): KeywordEntry[] => {
    const defaults = CATEGORY_KEYWORDS[category];
    const added = userKeywords.added[category];
    const removed = userKeywords.removed[category];

    // Filter out removed defaults and add user keywords
    const filtered = defaults.filter(
      k => !removed.includes(k.term.toLowerCase())
    );

    return [...filtered, ...added];
  }, [userKeywords]);

  // Check if a keyword is user-added
  const isUserAdded = useCallback((category: TopicCategory, term: string): boolean => {
    return userKeywords.added[category].some(
      k => k.term.toLowerCase() === term.toLowerCase()
    );
  }, [userKeywords]);

  // Check if a default keyword is disabled
  const isDisabled = useCallback((category: TopicCategory, term: string): boolean => {
    return userKeywords.removed[category].includes(term.toLowerCase());
  }, [userKeywords]);

  // Get stats for a category
  const getCategoryStats = useCallback((category: TopicCategory) => {
    const defaults = CATEGORY_KEYWORDS[category].length;
    const added = userKeywords.added[category].length;
    const removed = userKeywords.removed[category].length;
    return {
      defaults,
      added,
      removed,
      total: defaults + added - removed,
    };
  }, [userKeywords]);

  return {
    userKeywords,
    isLoaded,
    addKeyword,
    removeKeyword,
    updateKeywordWeight,
    resetCategory,
    resetAll,
    getEffectiveKeywords,
    isUserAdded,
    isDisabled,
    getCategoryStats,
  };
}

// Export a function to get effective keywords without the hook (for server-side or utilities)
export function getEffectiveKeywordsStatic(
  category: TopicCategory,
  userState: UserKeywordsState | null
): KeywordEntry[] {
  const defaults = CATEGORY_KEYWORDS[category];

  if (!userState) return defaults;

  const added = userState.added[category];
  const removed = userState.removed[category];

  const filtered = defaults.filter(
    k => !removed.includes(k.term.toLowerCase())
  );

  return [...filtered, ...added];
}
