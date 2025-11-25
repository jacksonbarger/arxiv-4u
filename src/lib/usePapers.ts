'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ArxivPaper, CategoryMatch, TopicCategory } from '@/types/arxiv';
import { calculateRelevanceScores, getCategoryDistribution } from './filter';
import { FilterState } from '@/components/FilterPanel';

interface FetchPapersResult {
  papers: ArxivPaper[];
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
}

interface UsePapersOptions {
  initialCategories?: string[];
  maxResults?: number;
}

interface UsePapersReturn {
  papers: ArxivPaper[];
  filteredPapers: ArxivPaper[];
  categoryMatchesMap: Map<string, CategoryMatch[]>;
  categoryDistribution: Record<TopicCategory, number>;
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

export function usePapers(
  filters: FilterState,
  options: UsePapersOptions = {}
): UsePapersReturn {
  const { maxResults = 50 } = options;

  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadPapers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters for API route
      const params = new URLSearchParams();
      if (filters.arxivCategories.length > 0) {
        params.set('categories', filters.arxivCategories.join(','));
      }
      params.set('maxResults', maxResults.toString());
      params.set('sortBy', filters.sortBy === 'date' ? 'submittedDate' : 'relevance');
      params.set('sortOrder', 'descending');
      if (filters.searchQuery) {
        params.set('searchQuery', filters.searchQuery);
      }

      // Fetch from API route (server-side proxy)
      const response = await fetch(`/api/papers?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch papers: ${response.statusText}`);
      }

      const data: FetchPapersResult = await response.json();

      setPapers(data.papers);
      setTotalResults(data.totalResults);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filters.arxivCategories, filters.searchQuery, filters.sortBy, maxResults]);

  // Fetch on mount and when arxiv categories or search query changes
  useEffect(() => {
    loadPapers();
  }, [loadPapers]);

  // Calculate category matches for all papers
  const categoryMatchesMap = useMemo(() => {
    const map = new Map<string, CategoryMatch[]>();
    for (const paper of papers) {
      map.set(paper.id, calculateRelevanceScores(paper));
    }
    return map;
  }, [papers]);

  // Filter papers based on selected topic categories and min relevance score
  const filteredPapers = useMemo(() => {
    let result = papers;

    // Filter by selected topic categories
    if (filters.selectedCategories.length > 0) {
      result = result.filter((paper) => {
        const matches = categoryMatchesMap.get(paper.id) || [];
        return matches.some(
          (match) =>
            filters.selectedCategories.includes(match.category) &&
            match.score >= filters.minRelevanceScore
        );
      });
    } else if (filters.minRelevanceScore > 0) {
      // If no categories selected but min score set, filter by any category score
      result = result.filter((paper) => {
        const matches = categoryMatchesMap.get(paper.id) || [];
        return matches.some((match) => match.score >= filters.minRelevanceScore);
      });
    }

    // Sort by relevance if selected
    if (filters.sortBy === 'relevance') {
      result = [...result].sort((a, b) => {
        const matchesA = categoryMatchesMap.get(a.id) || [];
        const matchesB = categoryMatchesMap.get(b.id) || [];
        const maxScoreA = matchesA.length > 0 ? Math.max(...matchesA.map((m) => m.score)) : 0;
        const maxScoreB = matchesB.length > 0 ? Math.max(...matchesB.map((m) => m.score)) : 0;
        return maxScoreB - maxScoreA;
      });
    }

    return result;
  }, [papers, filters.selectedCategories, filters.minRelevanceScore, filters.sortBy, categoryMatchesMap]);

  // Calculate category distribution for filtered papers
  const categoryDistribution = useMemo(() => {
    return getCategoryDistribution(filteredPapers);
  }, [filteredPapers]);

  return {
    papers,
    filteredPapers,
    categoryMatchesMap,
    categoryDistribution,
    isLoading,
    error,
    totalResults,
    lastUpdated,
    refetch: loadPapers,
  };
}
