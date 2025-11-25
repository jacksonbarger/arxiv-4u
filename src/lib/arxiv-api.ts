import { ArxivPaper, Author } from '@/types/arxiv';

// Use xmldom for server-side parsing, DOMParser for client-side
let DOMParserImpl: typeof DOMParser;
const isServer = typeof window === 'undefined';

if (isServer) {
  // Server-side (Node.js)
  const { DOMParser: ServerDOMParser } = require('@xmldom/xmldom');
  DOMParserImpl = ServerDOMParser;
} else {
  // Client-side (browser)
  DOMParserImpl = DOMParser;
}

// Helper to get first element by tag name (works in both environments)
function getElementByTagName(parent: Document | Element, tagName: string): Element | null {
  const elements = parent.getElementsByTagName(tagName);
  return elements.length > 0 ? elements[0] : null;
}

// Helper to get text content from first element with tag name
function getTextByTagName(parent: Document | Element, tagName: string): string {
  const element = getElementByTagName(parent, tagName);
  return element?.textContent || '';
}

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
  const name = getTextByTagName(authorEl, 'name') || 'Unknown';
  const affiliation = getTextByTagName(authorEl, 'affiliation') || undefined;
  return { name, affiliation };
}

/**
 * Parse a single entry from Arxiv XML response
 */
function parseEntry(entry: Element): ArxivPaper {
  // Extract arxiv ID from the id URL
  const idUrl = getTextByTagName(entry, 'id');
  const idMatch = idUrl.match(/abs\/(.+)$/);
  const id = idMatch ? idMatch[1] : idUrl;

  // Get title and clean whitespace
  const title = getTextByTagName(entry, 'title')
    .replace(/\s+/g, ' ')
    .trim();

  // Get abstract and clean whitespace
  const abstract = getTextByTagName(entry, 'summary')
    .replace(/\s+/g, ' ')
    .trim();

  // Parse authors
  const authorElements = entry.getElementsByTagName('author');
  const authors: Author[] = Array.from(authorElements).map(parseAuthor);

  // Get categories
  const categoryElements = entry.getElementsByTagName('category');
  const categories: string[] = Array.from(categoryElements)
    .map(el => el.getAttribute('term'))
    .filter((term): term is string => term !== null);

  // Primary category - try both namespace and plain tag
  let primaryCategory = categories[0] || 'unknown';
  const primaryCatEl = getElementByTagName(entry, 'primary_category') ||
                       getElementByTagName(entry, 'arxiv:primary_category');
  if (primaryCatEl) {
    primaryCategory = primaryCatEl.getAttribute('term') || primaryCategory;
  }

  // Dates
  const publishedDate = getTextByTagName(entry, 'published');
  const updatedDate = getTextByTagName(entry, 'updated');

  // URLs
  const links = entry.getElementsByTagName('link');
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
  const parser = new DOMParserImpl();
  const doc = parser.parseFromString(xmlText, 'text/xml');

  // Check for parse errors
  const parseError = getElementByTagName(doc, 'parsererror');
  if (parseError) {
    throw new Error('Failed to parse Arxiv API response');
  }

  // Get total results from opensearch namespace (try both forms)
  const totalResults = parseInt(
    getTextByTagName(doc, 'totalResults') ||
    getTextByTagName(doc, 'opensearch:totalResults') || '0',
    10
  );
  const startIndex = parseInt(
    getTextByTagName(doc, 'startIndex') ||
    getTextByTagName(doc, 'opensearch:startIndex') || '0',
    10
  );
  const itemsPerPage = parseInt(
    getTextByTagName(doc, 'itemsPerPage') ||
    getTextByTagName(doc, 'opensearch:itemsPerPage') || '0',
    10
  );

  // Parse entries
  const entries = doc.getElementsByTagName('entry');
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
