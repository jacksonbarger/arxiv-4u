// Keywords & Categories
export {
  CATEGORY_KEYWORDS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_PRIORITY,
  NEGATIVE_KEYWORDS,
  ARXIV_CATEGORY_BOOST,
  type KeywordEntry,
  type NegativeKeyword,
} from './keywords';

// Filter functions
export {
  calculateRelevanceScores,
  getPrimaryCategory,
  matchesCategory,
  filterByCategory,
  sortByRelevance,
  filterByCategories,
  hasMarketPotential,
  getCategoryDistribution,
  categorizePapers,
  createFilterWithUserKeywords,
  type FilterOptions,
} from './filter';

// User Keywords Hook
export {
  useUserKeywords,
  getEffectiveKeywordsStatic,
  type UserKeywordsState,
} from './useUserKeywords';

// Combined Paper Filter Hook
export { usePaperFilter } from './usePaperFilter';
