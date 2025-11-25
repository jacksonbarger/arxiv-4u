// Arxiv Paper Types

export interface Author {
  name: string;
  affiliation?: string;
}

export interface ArxivPaper {
  id: string;                    // arxiv ID (e.g., "2401.12345")
  title: string;
  abstract: string;
  authors: Author[];
  categories: string[];          // arxiv categories (e.g., ["cs.AI", "cs.LG"])
  primaryCategory: string;
  publishedDate: string;         // ISO date string
  updatedDate: string;
  pdfUrl: string;
  arxivUrl: string;
}

// Category/Topic Types

export type TopicCategory =
  | 'agentic-coding'
  | 'image-generation'
  | 'video-generation'
  | 'ai-content-creators'
  | 'comfyui'
  | 'runpod'
  | 'market-opportunity'
  | 'other';

export interface CategoryMatch {
  category: TopicCategory;
  score: number;                 // 0-100 relevance score
  matchedKeywords: string[];
}

// AI Summary Types

export interface PaperSummary {
  paperId: string;
  summary: string;               // 2-3 sentence summary
  keyFindings: string[];         // Bullet points
  practicalApplications: string[];
  relevanceScores: CategoryMatch[];
  marketPotential: MarketOpportunity | null;
  generatedAt: string;
}

export interface MarketOpportunity {
  score: number;                 // 0-100
  reasoning: string;
  potentialProducts: string[];
  soloDevFeasibility: 'high' | 'medium' | 'low';
  estimatedEffort: string;       // e.g., "2-4 weeks"
}

// Filter/Search Types

export interface FilterOptions {
  categories: TopicCategory[];
  minRelevanceScore: number;
  dateRange: {
    start: string;
    end: string;
  } | null;
  showMarketOpportunities: boolean;
  searchQuery: string;
}

// Storage Types

export interface StoredPaper extends ArxivPaper {
  fetchedAt: string;
  summary?: PaperSummary;
  isRead: boolean;
  isSaved: boolean;
}

export interface AppState {
  papers: StoredPaper[];
  filters: FilterOptions;
  lastFetchDate: string | null;
}

// Q&A Types

export interface QAMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relatedPaperIds?: string[];
}

export interface QASession {
  id: string;
  messages: QAMessage[];
  createdAt: string;
}
