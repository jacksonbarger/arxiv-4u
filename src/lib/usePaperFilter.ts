'use client';

import { useMemo } from 'react';
import { ArxivPaper, TopicCategory, CategoryMatch } from '@/types/arxiv';
import { useUserKeywords } from './useUserKeywords';
import { createFilterWithUserKeywords } from './filter';

/**
 * Hook that provides filtering functions with user keyword customizations
 * Automatically includes user's custom keywords in all filter operations
 */
export function usePaperFilter() {
  const {
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
  } = useUserKeywords();

  // Create filter functions bound to user keywords
  const filter = useMemo(() => {
    if (!isLoaded) return null;
    return createFilterWithUserKeywords(userKeywords);
  }, [userKeywords, isLoaded]);

  return {
    // Filter functions (null if not loaded yet)
    filter,
    isLoaded,

    // Keyword management
    keywords: {
      add: addKeyword,
      remove: removeKeyword,
      updateWeight: updateKeywordWeight,
      resetCategory,
      resetAll,
      getEffective: getEffectiveKeywords,
      isUserAdded,
      isDisabled,
      getStats: getCategoryStats,
      state: userKeywords,
    },

    // Convenience methods that handle loading state
    calculateRelevanceScores: (paper: ArxivPaper): CategoryMatch[] => {
      if (!filter) return [];
      return filter.calculateRelevanceScores(paper);
    },

    getPrimaryCategory: (paper: ArxivPaper): TopicCategory => {
      if (!filter) return 'other';
      return filter.getPrimaryCategory(paper);
    },

    matchesCategory: (paper: ArxivPaper, category: TopicCategory, minScore?: number): boolean => {
      if (!filter) return false;
      return filter.matchesCategory(paper, category, minScore);
    },

    filterByCategory: (papers: ArxivPaper[], category: TopicCategory, minScore?: number): ArxivPaper[] => {
      if (!filter) return papers;
      return filter.filterByCategory(papers, category, minScore);
    },

    sortByRelevance: (papers: ArxivPaper[], category: TopicCategory): ArxivPaper[] => {
      if (!filter) return papers;
      return filter.sortByRelevance(papers, category);
    },

    filterByCategories: (papers: ArxivPaper[], categories: TopicCategory[], minScore?: number): ArxivPaper[] => {
      if (!filter) return papers;
      return filter.filterByCategories(papers, categories, minScore);
    },

    hasMarketPotential: (paper: ArxivPaper, minScore?: number): boolean => {
      if (!filter) return false;
      return filter.hasMarketPotential(paper, minScore);
    },

    getCategoryDistribution: (papers: ArxivPaper[]): Record<TopicCategory, number> => {
      if (!filter) {
        return {
          'agentic-coding': 0,
          'image-generation': 0,
          'video-generation': 0,
          'ai-content-creators': 0,
          'comfyui': 0,
          'runpod': 0,
          'market-opportunity': 0,
          'nlp': 0,
          'llm': 0,
          'rag': 0,
          'multimodal': 0,
          'robotics': 0,
          'rl': 0,
          'transformers': 0,
          'safety': 0,
          'science': 0,
          'efficiency': 0,
          'other': papers.length,
        };
      }
      return filter.getCategoryDistribution(papers);
    },

    categorizePapers: (papers: ArxivPaper[]): Map<string, CategoryMatch[]> => {
      if (!filter) return new Map();
      return filter.categorizePapers(papers);
    },
  };
}
