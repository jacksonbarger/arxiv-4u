import { generateText, generateJSON, isConfigured } from './claude';
import type { ArxivPaper } from '@/types/arxiv';
import type { PaperCache } from '@/types/database';
import { getCachedPaperAnalysis, cachePaperAnalysis } from '@/lib/db';

export interface PaperAnalysis {
  summary: string; // 200-300 words, executive summary in plain English
  commercialScore: number; // 0-100, overall commercial potential
  keyFindings: string[]; // 3-5 main contributions
  targetAudience: string; // Who benefits most from this research
  implementationDifficulty: 'low' | 'medium' | 'high';
  marketingInsights: {
    marketSize: string;
    useCases: string[];
    competitiveAdvantages: string[];
    challenges: string[];
  };
}

const ANALYSIS_SYSTEM_PROMPT = `You are an expert AI research analyst specializing in identifying commercial opportunities in academic papers.

Your expertise includes:
- Understanding cutting-edge AI/ML research
- Identifying practical business applications
- Assessing market potential and commercial viability
- Explaining complex technical concepts in business terms
- Evaluating implementation difficulty and resource requirements

When analyzing papers, focus on:
1. What problem does this solve?
2. Who would pay for this solution?
3. How difficult is it to implement?
4. What's the market opportunity?
5. What are the commercial advantages?`;

/**
 * Analyze a paper and extract business insights
 */
export async function analyzePaper(paper: ArxivPaper): Promise<PaperAnalysis> {
  // Check if API is configured
  if (!isConfigured()) {
    // Return mock data for development
    return getMockAnalysis(paper);
  }

  // Check cache first
  const cached = await getCachedPaperAnalysis(paper.id);
  if (cached && cached.summary) {
    return {
      summary: cached.summary,
      commercialScore: cached.commercial_score || 50,
      keyFindings: (cached.key_findings as string[]) || [],
      targetAudience: cached.target_audience || 'Researchers and developers',
      implementationDifficulty: (cached.implementation_difficulty as 'low' | 'medium' | 'high') || 'medium',
      marketingInsights: (cached.marketing_insights as PaperAnalysis['marketingInsights']) || {
        marketSize: 'Unknown',
        useCases: [],
        competitiveAdvantages: [],
        challenges: [],
      },
    };
  }

  // Generate analysis using Claude
  const prompt = `Analyze this AI research paper and provide business insights:

**Title:** ${paper.title}

**Abstract:** ${paper.abstract}

**Categories:** ${paper.categories.join(', ')}

**Published:** ${new Date(paper.publishedDate).toLocaleDateString()}

Provide a comprehensive business analysis in JSON format with the following structure:
{
  "summary": "200-300 word executive summary in plain English, focusing on what this research enables and why it matters commercially",
  "commercialScore": 0-100 (integer score based on market readiness, uniqueness, implementation difficulty, market size, and business model clarity),
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "targetAudience": "who benefits most from this research (be specific about industries/roles)",
  "implementationDifficulty": "low" | "medium" | "high",
  "marketingInsights": {
    "marketSize": "estimated TAM/market description",
    "useCases": ["use case 1", "use case 2", "use case 3"],
    "competitiveAdvantages": ["advantage 1", "advantage 2"],
    "challenges": ["challenge 1", "challenge 2"]
  }
}`;

  const analysis = await generateJSON<PaperAnalysis>(prompt, {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 3000,
    systemPrompt: ANALYSIS_SYSTEM_PROMPT,
  });

  // Cache the analysis
  await cachePaperAnalysis({
    paperId: paper.id,
    summary: analysis.summary,
    commercialScore: analysis.commercialScore,
    keyFindings: analysis.keyFindings,
    targetAudience: analysis.targetAudience,
    implementationDifficulty: analysis.implementationDifficulty,
    marketingInsights: analysis.marketingInsights,
  });

  return analysis;
}

/**
 * Generate a quick summary (faster, cheaper)
 */
export async function generateQuickSummary(paper: ArxivPaper): Promise<string> {
  if (!isConfigured()) {
    return `This paper explores ${paper.title.toLowerCase()}. The research focuses on advancing the field through novel techniques and methodologies described in the abstract.`;
  }

  const prompt = `Summarize this AI research paper in 2-3 sentences for a general audience:

**Title:** ${paper.title}

**Abstract:** ${paper.abstract}

Focus on what problem it solves and why it matters. Use plain English.`;

  return await generateText(prompt, {
    model: 'claude-3-5-haiku-20241022', // Faster, cheaper
    maxTokens: 200,
  });
}

/**
 * Calculate commercial score based on multiple factors
 */
export function calculateCommercialScore(factors: {
  technicalNovelty: number; // 0-20
  marketReadiness: number; // 0-20
  marketSize: number; // 0-20
  competitiveAdvantage: number; // 0-15
  timeToMarket: number; // 0-15
  businessModelClarity: number; // 0-10
}): number {
  const total =
    factors.technicalNovelty +
    factors.marketReadiness +
    factors.marketSize +
    factors.competitiveAdvantage +
    factors.timeToMarket +
    factors.businessModelClarity;

  return Math.min(100, Math.max(0, Math.round(total)));
}

/**
 * Get mock analysis for development (when API key not configured)
 */
function getMockAnalysis(paper: ArxivPaper): PaperAnalysis {
  // Generate deterministic score based on paper ID
  const hash = paper.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const commercialScore = 30 + (hash % 60); // Score between 30-90

  return {
    summary: `This research presents novel approaches in ${paper.title.toLowerCase()}. The work addresses key challenges in the field by introducing innovative methodologies that could have significant practical applications. The techniques described show promise for real-world deployment, particularly in commercial settings where efficiency and accuracy are critical. Early results suggest that this approach could reduce costs while improving performance compared to existing solutions.`,
    commercialScore,
    keyFindings: [
      'Novel approach with improved performance metrics',
      'Practical implementation pathway identified',
      'Potential for significant cost reduction',
    ],
    targetAudience: 'AI/ML engineers, researchers, and companies building intelligent systems',
    implementationDifficulty: commercialScore > 70 ? 'low' : commercialScore > 50 ? 'medium' : 'high',
    marketingInsights: {
      marketSize: 'Multi-billion dollar AI/ML market with growing demand',
      useCases: [
        'Enterprise AI applications',
        'Product development',
        'Research and development',
      ],
      competitiveAdvantages: [
        'Novel technical approach',
        'Improved efficiency',
        'Lower implementation costs',
      ],
      challenges: [
        'Requires technical expertise',
        'May need additional research for production use',
      ],
    },
  };
}

/**
 * Analyze multiple papers in batch (for digest emails)
 */
export async function analyzePapersBatch(
  papers: ArxivPaper[],
  maxConcurrent = 3
): Promise<Map<string, PaperAnalysis>> {
  const results = new Map<string, PaperAnalysis>();

  // Process in batches to avoid rate limits
  for (let i = 0; i < papers.length; i += maxConcurrent) {
    const batch = papers.slice(i, i + maxConcurrent);
    const analyses = await Promise.all(
      batch.map(async (paper) => {
        try {
          const analysis = await analyzePaper(paper);
          return { paperId: paper.id, analysis };
        } catch (error) {
          console.error(`Error analyzing paper ${paper.id}:`, error);
          return { paperId: paper.id, analysis: getMockAnalysis(paper) };
        }
      })
    );

    analyses.forEach(({ paperId, analysis }) => {
      results.set(paperId, analysis);
    });

    // Small delay between batches
    if (i + maxConcurrent < papers.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}
