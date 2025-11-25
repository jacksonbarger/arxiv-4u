import { ArxivPaper, Author } from '@/types/arxiv';

// Arxiv API configuration
const ARXIV_API_BASE = 'https://export.arxiv.org/api/query';

// Default categories to search
const DEFAULT_CATEGORIES = [
  'cs.AI',  // Artificial Intelligence
  'cs.LG',  // Machine Learning
  'cs.CV',  // Computer Vision
  'cs.CL',  // Computation and Language
  'cs.NE',  // Neural and Evolutionary Computing
  'cs.RO',  // Robotics
  'stat.ML', // Machine Learning (Statistics)
];

export interface FetchPapersOptions {
  categories?: string[];
  maxResults?: number;
  startIndex?: number;
  sortBy?: 'relevance' | 'lastUpdatedDate' | 'submittedDate';
  sortOrder?: 'ascending' | 'descending';
  searchQuery?: string;
}

export interface FetchPapersResult {
  papers: ArxivPaper[];
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
}

/**
 * Build the Arxiv API query URL
 */
function buildQueryUrl(options: FetchPapersOptions): string {
  const {
    categories = DEFAULT_CATEGORIES,
    maxResults = 50,
    startIndex = 0,
    sortBy = 'submittedDate',
    sortOrder = 'descending',
    searchQuery,
  } = options;

  const params = new URLSearchParams();

  // Build category query: cat:cs.AI OR cat:cs.LG OR ...
  let query = categories.map(cat => `cat:${cat}`).join(' OR ');

  // Add search query if provided
  if (searchQuery) {
    query = `(${query}) AND (all:${searchQuery})`;
  }

  params.set('search_query', query);
  params.set('start', startIndex.toString());
  params.set('max_results', maxResults.toString());
  params.set('sortBy', sortBy);
  params.set('sortOrder', sortOrder);

  return `${ARXIV_API_BASE}?${params.toString()}`;
}

/**
 * Parse author element from Arxiv XML
 */
function parseAuthor(authorEl: Element): Author {
  const name = authorEl.querySelector('name')?.textContent || 'Unknown';
  const affiliation = authorEl.querySelector('affiliation')?.textContent || undefined;
  return { name, affiliation };
}

/**
 * Parse a single entry from Arxiv XML response
 */
function parseEntry(entry: Element): ArxivPaper {
  // Extract arxiv ID from the id URL
  const idUrl = entry.querySelector('id')?.textContent || '';
  const idMatch = idUrl.match(/abs\/(.+)$/);
  const id = idMatch ? idMatch[1] : idUrl;

  // Get title and clean whitespace
  const title = (entry.querySelector('title')?.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();

  // Get abstract and clean whitespace
  const abstract = (entry.querySelector('summary')?.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();

  // Parse authors
  const authorElements = entry.querySelectorAll('author');
  const authors: Author[] = Array.from(authorElements).map(parseAuthor);

  // Get categories
  const categoryElements = entry.querySelectorAll('category');
  const categories: string[] = Array.from(categoryElements)
    .map(el => el.getAttribute('term'))
    .filter((term): term is string => term !== null);

  // Primary category
  const primaryCategory = entry.querySelector('arxiv\\:primary_category, primary_category')
    ?.getAttribute('term') || categories[0] || 'unknown';

  // Dates
  const publishedDate = entry.querySelector('published')?.textContent || '';
  const updatedDate = entry.querySelector('updated')?.textContent || '';

  // URLs
  const links = entry.querySelectorAll('link');
  let pdfUrl = '';
  let arxivUrl = '';

  Array.from(links).forEach(link => {
    const href = link.getAttribute('href') || '';
    const type = link.getAttribute('type');
    const title = link.getAttribute('title');

    if (title === 'pdf' || type === 'application/pdf') {
      pdfUrl = href;
    } else if (!type || type === 'text/html') {
      arxivUrl = href;
    }
  });

  // Fallback URLs if not found
  if (!pdfUrl && id) {
    pdfUrl = `https://arxiv.org/pdf/${id}.pdf`;
  }
  if (!arxivUrl && id) {
    arxivUrl = `https://arxiv.org/abs/${id}`;
  }

  return {
    id,
    title,
    abstract,
    authors,
    categories,
    primaryCategory,
    publishedDate,
    updatedDate,
    pdfUrl,
    arxivUrl,
  };
}

/**
 * Parse the Arxiv API XML response
 */
function parseArxivResponse(xmlText: string): FetchPapersResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');

  // Check for parse errors
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Failed to parse Arxiv API response');
  }

  // Get total results from opensearch namespace
  const totalResults = parseInt(
    doc.querySelector('opensearch\\:totalResults, totalResults')?.textContent || '0',
    10
  );
  const startIndex = parseInt(
    doc.querySelector('opensearch\\:startIndex, startIndex')?.textContent || '0',
    10
  );
  const itemsPerPage = parseInt(
    doc.querySelector('opensearch\\:itemsPerPage, itemsPerPage')?.textContent || '0',
    10
  );

  // Parse entries
  const entries = doc.querySelectorAll('entry');
  const papers: ArxivPaper[] = Array.from(entries).map(parseEntry);

  return {
    papers,
    totalResults,
    startIndex,
    itemsPerPage,
  };
}

/**
 * Fetch papers from Arxiv API
 */
export async function fetchPapers(options: FetchPapersOptions = {}): Promise<FetchPapersResult> {
  const url = buildQueryUrl(options);

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/atom+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`Arxiv API error: ${response.status} ${response.statusText}`);
  }

  const xmlText = await response.text();
  return parseArxivResponse(xmlText);
}

/**
 * Fetch recent papers (last N days)
 */
export async function fetchRecentPapers(
  days: number = 7,
  options: Omit<FetchPapersOptions, 'sortBy' | 'sortOrder'> = {}
): Promise<FetchPapersResult> {
  return fetchPapers({
    ...options,
    sortBy: 'submittedDate',
    sortOrder: 'descending',
  });
}

/**
 * Search papers by query
 */
export async function searchPapers(
  query: string,
  options: Omit<FetchPapersOptions, 'searchQuery'> = {}
): Promise<FetchPapersResult> {
  return fetchPapers({
    ...options,
    searchQuery: query,
  });
}

/**
 * Get available Arxiv categories for AI/ML
 */
export function getAvailableCategories(): { value: string; label: string }[] {
  return [
    { value: 'cs.AI', label: 'Artificial Intelligence' },
    { value: 'cs.LG', label: 'Machine Learning' },
    { value: 'cs.CV', label: 'Computer Vision' },
    { value: 'cs.CL', label: 'Computation and Language' },
    { value: 'cs.NE', label: 'Neural and Evolutionary Computing' },
    { value: 'cs.RO', label: 'Robotics' },
    { value: 'cs.SD', label: 'Sound' },
    { value: 'cs.GR', label: 'Graphics' },
    { value: 'cs.MM', label: 'Multimedia' },
    { value: 'stat.ML', label: 'Machine Learning (Statistics)' },
    { value: 'eess.AS', label: 'Audio and Speech Processing' },
    { value: 'eess.IV', label: 'Image and Video Processing' },
  ];
}

export { DEFAULT_CATEGORIES };
