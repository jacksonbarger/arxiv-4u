import { NextRequest, NextResponse } from 'next/server';
import { fetchPapers } from '@/lib/arxiv-api';

// Ensure this runs on Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const categories = searchParams.get('categories')?.split(',').filter(Boolean);
    const maxResults = searchParams.get('maxResults') ? parseInt(searchParams.get('maxResults')!) : undefined;
    const startIndex = searchParams.get('startIndex') ? parseInt(searchParams.get('startIndex')!) : undefined;
    const sortBy = searchParams.get('sortBy') as 'relevance' | 'lastUpdatedDate' | 'submittedDate' | undefined;
    const sortOrder = searchParams.get('sortOrder') as 'ascending' | 'descending' | undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;

    // Fetch papers from arXiv API
    const result = await fetchPapers({
      categories,
      maxResults,
      startIndex,
      sortBy,
      sortOrder,
      searchQuery,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching papers:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch papers' },
      { status: 500 }
    );
  }
}
