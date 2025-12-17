import { ArxivPaper, TopicCategory, CategoryMatch } from '@/types/arxiv';
import {
  CATEGORY_KEYWORDS,
  NEGATIVE_KEYWORDS,
  ARXIV_CATEGORY_BOOST,
  KeywordEntry,
  CATEGORY_PRIORITY,
} from './keywords';
import { UserKeywordsState, getEffectiveKeywordsStatic } from './useUserKeywords';

// Minimum score to consider a paper relevant to a category
const MIN_RELEVANCE_SCORE = 5;

// Partial match multiplier (when keyword is found but not as exact match)
const PARTIAL_MATCH_MULTIPLIER = 0.6;

// Options for filtering functions
export interface FilterOptions {
  userKeywords?: UserKeywordsState | null;
  minScore?: number;
}

/**
 * Get keywords for a category, optionally including user customizations
 */
function getKeywordsForCategory(
  category: TopicCategory,
  userKeywords?: UserKeywordsState | null
): KeywordEntry[] {
  if (userKeywords) {
    return getEffectiveKeywordsStatic(category, userKeywords);
  }
  return CATEGORY_KEYWORDS[category];
}

/**
 * Calculate relevance scores for a paper across all categories
 */
export function calculateRelevanceScores(
  paper: ArxivPaper,
  options: FilterOptions = {}
): CategoryMatch[] {
  const { userKeywords } = options;
  const text = `${paper.title} ${paper.abstract}`.toLowerCase();
  const results: CategoryMatch[] = [];

  for (const category of CATEGORY_PRIORITY) {
    if (category === 'other') continue;

    const keywords = getKeywordsForCategory(category, userKeywords);
    const score = calculateCategoryScoreWithKeywords(
      text,
      category,
      paper.categories,
      keywords
    );

    if (score >= MIN_RELEVANCE_SCORE) {
      const matchedKeywords = getMatchedKeywordsFromList(text, keywords);
      results.push({
        category,
        score: Math.min(score, 100), // Cap at 100
        matchedKeywords,
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Calculate score for a single category using provided keywords
 */
function calculateCategoryScoreWithKeywords(
  text: string,
  category: TopicCategory,
  arxivCategories: string[],
  keywords: KeywordEntry[]
): number {
  const negativeKeywords = NEGATIVE_KEYWORDS[category];

  let score = 0;

  // Calculate positive keyword matches
  for (const keyword of keywords) {
    const matchScore = matchKeyword(text, keyword);
    score += matchScore;
  }

  // Apply negative keyword penalties
  for (const negative of negativeKeywords) {
    if (text.includes(negative.term.toLowerCase())) {
      score -= negative.penalty;
    }
  }

  // Apply arxiv category boost
  for (const arxivCat of arxivCategories) {
    const boosts = ARXIV_CATEGORY_BOOST[arxivCat];
    if (boosts && boosts[category]) {
      score *= boosts[category]!;
    }
  }

  return Math.max(0, score);
}

/**
 * Calculate score for a single category (backward compatible)
 */
function calculateCategoryScore(
  text: string,
  category: TopicCategory,
  arxivCategories: string[],
  userKeywords?: UserKeywordsState | null
): number {
  const keywords = getKeywordsForCategory(category, userKeywords);
  return calculateCategoryScoreWithKeywords(text, category, arxivCategories, keywords);
}

/**
 * Match a single keyword and return its score contribution
 */
function matchKeyword(text: string, keyword: KeywordEntry): number {
  const term = keyword.term.toLowerCase();

  if (keyword.exact) {
    // Exact word boundary match
    const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'i');
    if (regex.test(text)) {
      return keyword.weight;
    }
    return 0;
  }

  // Check for exact phrase first
  if (text.includes(term)) {
    return keyword.weight;
  }

  // Check for partial match (individual words)
  const words = term.split(/\s+/);
  if (words.length > 1) {
    const matchedWords = words.filter(word =>
      new RegExp(`\\b${escapeRegex(word)}\\b`, 'i').test(text)
    );
    if (matchedWords.length > 0) {
      return keyword.weight * PARTIAL_MATCH_MULTIPLIER * (matchedWords.length / words.length);
    }
  }

  return 0;
}

/**
 * Get list of keywords that matched from a provided list
 */
function getMatchedKeywordsFromList(text: string, keywords: KeywordEntry[]): string[] {
  const matched: string[] = [];

  for (const keyword of keywords) {
    const term = keyword.term.toLowerCase();

    if (keyword.exact) {
      const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'i');
      if (regex.test(text)) {
        matched.push(keyword.term);
      }
    } else if (text.includes(term)) {
      matched.push(keyword.term);
    }
  }

  return matched;
}

/**
 * Get list of keywords that matched for a category (backward compatible)
 */
function getMatchedKeywords(
  text: string,
  category: TopicCategory,
  userKeywords?: UserKeywordsState | null
): string[] {
  const keywords = getKeywordsForCategory(category, userKeywords);
  return getMatchedKeywordsFromList(text, keywords);
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get the primary category for a paper (highest scoring)
 */
export function getPrimaryCategory(
  paper: ArxivPaper,
  options: FilterOptions = {}
): TopicCategory {
  const scores = calculateRelevanceScores(paper, options);
  return scores.length > 0 ? scores[0].category : 'other';
}

/**
 * Check if a paper matches a specific category with minimum threshold
 */
export function matchesCategory(
  paper: ArxivPaper,
  category: TopicCategory,
  options: FilterOptions = {}
): boolean {
  const { userKeywords, minScore = MIN_RELEVANCE_SCORE } = options;
  const text = `${paper.title} ${paper.abstract}`.toLowerCase();
  const score = calculateCategoryScore(text, category, paper.categories, userKeywords);
  return score >= minScore;
}

/**
 * Filter papers by category with optional minimum score
 */
export function filterByCategory(
  papers: ArxivPaper[],
  category: TopicCategory,
  options: FilterOptions = {}
): ArxivPaper[] {
  return papers.filter(paper => matchesCategory(paper, category, options));
}

/**
 * Sort papers by relevance to a category
 */
export function sortByRelevance(
  papers: ArxivPaper[],
  category: TopicCategory,
  options: FilterOptions = {}
): ArxivPaper[] {
  const { userKeywords } = options;
  return [...papers].sort((a, b) => {
    const textA = `${a.title} ${a.abstract}`.toLowerCase();
    const textB = `${b.title} ${b.abstract}`.toLowerCase();
    const scoreA = calculateCategoryScore(textA, category, a.categories, userKeywords);
    const scoreB = calculateCategoryScore(textB, category, b.categories, userKeywords);
    return scoreB - scoreA;
  });
}

/**
 * Get papers that match any of the specified categories
 */
export function filterByCategories(
  papers: ArxivPaper[],
  categories: TopicCategory[],
  options: FilterOptions = {}
): ArxivPaper[] {
  return papers.filter(paper =>
    categories.some(category => matchesCategory(paper, category, options))
  );
}

/**
 * Check if paper has market opportunity potential
 */
export function hasMarketPotential(
  paper: ArxivPaper,
  options: FilterOptions = {}
): boolean {
  const opts = { ...options, minScore: options.minScore ?? 10 };
  return matchesCategory(paper, 'market-opportunity', opts);
}

/**
 * Get a summary of category distribution for a set of papers
 */
export function getCategoryDistribution(
  papers: ArxivPaper[],
  options: FilterOptions = {}
): Record<TopicCategory, number> {
  const distribution: Record<TopicCategory, number> = {
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
    'other': 0,
  };

  for (const paper of papers) {
    const primary = getPrimaryCategory(paper, options);
    distribution[primary]++;
  }

  return distribution;
}

/**
 * Score and categorize a batch of papers efficiently
 */
export function categorizePapers(
  papers: ArxivPaper[],
  options: FilterOptions = {}
): Map<string, CategoryMatch[]> {
  const results = new Map<string, CategoryMatch[]>();

  for (const paper of papers) {
    results.set(paper.id, calculateRelevanceScores(paper, options));
  }

  return results;
}

/**
 * Create a hook-compatible filter function
 * Returns a function that can be used with user keywords from the hook
 */
export function createFilterWithUserKeywords(userKeywords: UserKeywordsState | null) {
  return {
    calculateRelevanceScores: (paper: ArxivPaper) =>
      calculateRelevanceScores(paper, { userKeywords }),
    getPrimaryCategory: (paper: ArxivPaper) =>
      getPrimaryCategory(paper, { userKeywords }),
    matchesCategory: (paper: ArxivPaper, category: TopicCategory, minScore?: number) =>
      matchesCategory(paper, category, { userKeywords, minScore }),
    filterByCategory: (papers: ArxivPaper[], category: TopicCategory, minScore?: number) =>
      filterByCategory(papers, category, { userKeywords, minScore }),
    sortByRelevance: (papers: ArxivPaper[], category: TopicCategory) =>
      sortByRelevance(papers, category, { userKeywords }),
    filterByCategories: (papers: ArxivPaper[], categories: TopicCategory[], minScore?: number) =>
      filterByCategories(papers, categories, { userKeywords, minScore }),
    hasMarketPotential: (paper: ArxivPaper, minScore?: number) =>
      hasMarketPotential(paper, { userKeywords, minScore }),
    getCategoryDistribution: (papers: ArxivPaper[]) =>
      getCategoryDistribution(papers, { userKeywords }),
    categorizePapers: (papers: ArxivPaper[]) =>
      categorizePapers(papers, { userKeywords }),
  };
}
