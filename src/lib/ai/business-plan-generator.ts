import { generateJSON, generateText, isConfigured } from './claude';
import type { ArxivPaper, CategoryMatch } from '@/types/arxiv';
import type { BusinessPlanData } from '@/types/database';
import { ProfitStrategy } from '@/lib/profitInsights';

const BUSINESS_PLAN_SYSTEM_PROMPT = `You are an expert business strategist and startup advisor specializing in commercializing AI research.

Your background includes:
- 15+ years launching tech startups
- Deep expertise in AI/ML productization
- Experience with Y Combinator, Techstars, and top accelerators
- Track record of successful exits and fundraising
- Understanding of SaaS, API businesses, and AI infrastructure

You create actionable, realistic business plans that non-technical founders can execute. Your plans are:
- Specific and detailed (not generic advice)
- Based on real market data and comparable companies
- Focused on capital-efficient validation and iteration
- Honest about risks and challenges
- Practical with clear next steps`;

export interface BusinessPlanContext {
  paper: ArxivPaper;
  categoryMatch: CategoryMatch;
  selectedStrategy: ProfitStrategy;
  userInputs: {
    budget?: string;
    timeline?: string;
    experienceLevel?: 'beginner' | 'intermediate' | 'expert';
    targetMarket?: string;
    teamSize?: string;
  };
}

/**
 * Generate a complete business plan using multi-stage AI agent
 */
export async function generateBusinessPlan(
  context: BusinessPlanContext
): Promise<BusinessPlanData> {
  if (!isConfigured()) {
    return getMockBusinessPlan(context);
  }

  const { paper, selectedStrategy, userInputs } = context;

  // Stage 1: Executive Summary
  const executiveSummary = await generateExecutiveSummary(context);

  // Stage 2: Technology Overview
  const technologyOverview = await generateTechnologyOverview(context);

  // Stage 3: Market Analysis
  const marketAnalysis = await generateMarketAnalysis(context);

  // Stage 4: Competitive Landscape
  const competitiveLandscape = await generateCompetitiveLandscape(context);

  // Stage 5: Product Strategy
  const productStrategy = await generateProductStrategy(context);

  // Stage 6: Revenue Model
  const revenueModel = await generateRevenueModel(context);

  // Stage 7: Go-to-Market
  const goToMarket = await generateGoToMarket(context);

  // Stage 8: Financial Projections
  const financialProjections = await generateFinancialProjections(context);

  // Stage 9: Implementation Timeline
  const implementationTimeline = await generateImplementationTimeline(context);

  // Stage 10: Risk Analysis
  const riskAnalysis = await generateRiskAnalysis(context);

  // Stage 11: Resource Requirements
  const resourceRequirements = await generateResourceRequirements(context);

  // Stage 12: Success Metrics
  const successMetrics = await generateSuccessMetrics(context);

  return {
    executiveSummary,
    technologyOverview,
    marketAnalysis,
    competitiveLandscape,
    productStrategy,
    revenueModel,
    goToMarket,
    financialProjections,
    implementationTimeline,
    riskAnalysis,
    resourceRequirements,
    successMetrics,
  };
}

// ========================================
// STAGE GENERATORS
// ========================================

async function generateExecutiveSummary(context: BusinessPlanContext) {
  const prompt = `Create an executive summary for a business based on this AI research:

**Paper Title:** ${context.paper.title}
**Abstract:** ${context.paper.abstract}
**Selected Strategy:** ${context.selectedStrategy.title}
**Strategy Description:** ${context.selectedStrategy.description}
**Estimated Revenue:** ${context.selectedStrategy.estimatedRevenue}
**Time to Market:** ${context.selectedStrategy.timeToMarket}

User Context:
- Budget: ${context.userInputs.budget || 'Not specified'}
- Timeline: ${context.userInputs.timeline || 'ASAP'}
- Experience: ${context.userInputs.experienceLevel || 'intermediate'}

Create a compelling executive summary with:
{
  "opportunity": "2-3 sentence description of the market opportunity",
  "solution": "2-3 sentences on what you're building",
  "marketSize": "TAM/SAM with numbers",
  "revenue": "Expected revenue range and timeline",
  "askOrNext": "What you need (funding/resources) or next steps"
}`;

  return await generateJSON<BusinessPlanData['executiveSummary']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

async function generateTechnologyOverview(context: BusinessPlanContext) {
  const prompt = `Explain the technology from this research in business terms:

**Paper Title:** ${context.paper.title}
**Abstract:** ${context.paper.abstract}

Format:
{
  "paperSummary": "3-4 sentences explaining the research in plain English",
  "keyInnovation": "What makes this approach unique/valuable",
  "technicalAdvantages": ["advantage 1", "advantage 2", "advantage 3"],
  "implementationComplexity": "low" | "medium" | "high"
}`;

  return await generateJSON<BusinessPlanData['technologyOverview']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

async function generateMarketAnalysis(context: BusinessPlanContext) {
  const prompt = `Analyze the market for: ${context.selectedStrategy.title}

Context: ${context.selectedStrategy.description}
Target Market: ${context.userInputs.targetMarket || 'General B2B/SaaS'}

Provide detailed market analysis:
{
  "tam": { "value": "$XXB", "description": "total addressable market explanation" },
  "sam": { "value": "$XXB", "description": "serviceable available market" },
  "som": { "value": "$XXM", "description": "serviceable obtainable market (realistic year 1-3)" },
  "trends": ["trend 1", "trend 2", "trend 3"],
  "painPoints": ["customer pain point 1", "pain point 2"],
  "existingAlternatives": ["current solution 1", "solution 2"]
}`;

  return await generateJSON<BusinessPlanData['marketAnalysis']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

async function generateCompetitiveLandscape(context: BusinessPlanContext) {
  const prompt = `Identify competitors for: ${context.selectedStrategy.title}

Research and provide:
{
  "directCompetitors": [
    {
      "name": "Competitor name",
      "description": "what they do",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"]
    }
  ],
  "indirectCompetitors": [
    { "name": "name", "description": "what they do" }
  ],
  "competitiveAdvantages": ["your unique advantage 1", "advantage 2"],
  "threats": ["potential threat 1", "threat 2"]
}

Provide 3-5 direct competitors and 2-3 indirect ones.`;

  return await generateJSON<BusinessPlanData['competitiveLandscape']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

async function generateProductStrategy(context: BusinessPlanContext) {
  const prompt = `Define product strategy for: ${context.selectedStrategy.title}

Steps from strategy:
${context.selectedStrategy.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Timeline: ${context.selectedStrategy.timeToMarket}

Create product roadmap:
{
  "mvpFeatures": [
    { "name": "feature name", "description": "why essential", "priority": "high" }
  ],
  "phase1Features": ["feature for first major release"],
  "phase2Features": ["feature for scaling phase"],
  "roadmap": [
    { "phase": "MVP", "timeline": "weeks 1-4", "goals": ["goal 1", "goal 2"] }
  ]
}`;

  return await generateJSON<BusinessPlanData['productStrategy']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

async function generateRevenueModel(context: BusinessPlanContext) {
  const prompt = `Create revenue model for: ${context.selectedStrategy.title}

Estimated Revenue: ${context.selectedStrategy.estimatedRevenue}
Difficulty: ${context.selectedStrategy.difficulty}

Provide:
{
  "pricingStrategy": "description of pricing approach (value-based, usage-based, etc)",
  "tiers": [
    {
      "name": "Free/Starter",
      "price": "$0 or $X/mo",
      "features": ["feature 1", "feature 2"],
      "targetCustomer": "who this is for"
    }
  ],
  "unitEconomics": {
    "cac": "$XX",
    "ltv": "$XXX",
    "ltvCacRatio": 3.5,
    "grossMargin": "XX%"
  },
  "revenueStreams": ["primary revenue", "secondary revenue"]
}`;

  return await generateJSON<BusinessPlanData['revenueModel']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

async function generateGoToMarket(context: BusinessPlanContext) {
  const prompt = `Create go-to-market strategy for: ${context.selectedStrategy.title}

Experience Level: ${context.userInputs.experienceLevel}

Provide:
{
  "targetCustomer": {
    "persona": "title/role",
    "demographics": "company size, industry, etc",
    "painPoints": ["pain 1", "pain 2"],
    "buyingBehavior": "how they make decisions"
  },
  "acquisitionChannels": [
    { "channel": "SEO", "strategy": "specific tactics", "expectedCac": "$XX" }
  ],
  "contentStrategy": ["content type 1", "content type 2"],
  "partnerships": ["partnership opportunity 1"],
  "launchPlan": [
    {
      "phase": "Soft Launch",
      "duration": "2 weeks",
      "activities": ["activity 1", "activity 2"],
      "successMetrics": ["metric 1"]
    }
  ]
}`;

  return await generateJSON<BusinessPlanData['goToMarket']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

async function generateFinancialProjections(context: BusinessPlanContext) {
  const prompt = `Create financial projections for: ${context.selectedStrategy.title}

Revenue Target: ${context.selectedStrategy.estimatedRevenue}
Budget: ${context.userInputs.budget || '$10K initial'}

Provide:
{
  "assumptions": [
    { "assumption": "conversion rate", "value": "2%", "rationale": "industry benchmark" }
  ],
  "yearOne": {
    "months": [
      { "month": 1, "revenue": 0, "costs": 2000, "profit": -2000, "users": 50 }
    ]
  },
  "breakEven": { "month": 6, "mrr": "$5000", "users": 100 }
}

Create realistic month-by-month for year 1 (12 months).`;

  return await generateJSON<BusinessPlanData['financialProjections']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

async function generateImplementationTimeline(context: BusinessPlanContext) {
  const prompt = `Create 12-week implementation plan for: ${context.selectedStrategy.title}

Steps:
${context.selectedStrategy.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Format:
{
  "weeks": [
    {
      "week": 1,
      "focus": "main objective this week",
      "deliverables": ["deliverable 1", "deliverable 2"],
      "resources": ["tool/service needed"]
    }
  ],
  "criticalPath": ["must-do task 1", "must-do task 2"],
  "dependencies": [
    { "task": "Deploy MVP", "dependsOn": ["Complete development", "Set up hosting"] }
  ]
}

Provide all 12 weeks.`;

  return await generateJSON<BusinessPlanData['implementationTimeline']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

async function generateRiskAnalysis(context: BusinessPlanContext) {
  const prompt = `Identify risks for: ${context.selectedStrategy.title}

Analyze:
{
  "technical": [
    {
      "risk": "description",
      "probability": "low" | "medium" | "high",
      "impact": "low" | "medium" | "high",
      "mitigation": "how to reduce/handle"
    }
  ],
  "market": [],
  "financial": [],
  "mitigationStrategies": ["overall strategy 1", "strategy 2"]
}

Provide 2-3 risks per category.`;

  return await generateJSON<BusinessPlanData['riskAnalysis']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

async function generateResourceRequirements(context: BusinessPlanContext) {
  const prompt = `Define resource requirements for: ${context.selectedStrategy.title}

Quick Wins: ${context.selectedStrategy.quickWins?.join(', ')}
Resources: ${context.selectedStrategy.resources?.join(', ')}
Budget: ${context.userInputs.budget}
Team: ${context.userInputs.teamSize || 'Solo/small team'}

Provide:
{
  "team": [
    {
      "role": "Developer",
      "responsibilities": ["task 1", "task 2"],
      "timeline": "full-time from week 1",
      "cost": "$5K/mo or sweat equity"
    }
  ],
  "tools": [
    { "name": "Vercel", "purpose": "hosting", "cost": "$20/mo" }
  ],
  "infrastructure": [
    { "service": "OpenAI API", "purpose": "AI features", "estimatedCost": "$100/mo" }
  ],
  "budget": {
    "initialInvestment": "$10,000",
    "monthlyRunRate": "$500",
    "breakdown": [
      { "category": "Development", "amount": "$5000" }
    ]
  }
}`;

  return await generateJSON<BusinessPlanData['resourceRequirements']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

async function generateSuccessMetrics(context: BusinessPlanContext) {
  const prompt = `Define success metrics for: ${context.selectedStrategy.title}

Timeline: ${context.selectedStrategy.timeToMarket}

Create:
{
  "kpis": [
    {
      "metric": "MRR",
      "target": "$5K",
      "timeline": "Month 6",
      "measurement": "Stripe dashboard"
    }
  ],
  "milestones": [
    { "milestone": "First paying customer", "target": "1", "deadline": "Week 6" }
  ],
  "validationCriteria": ["how to know if this is working", "key signal"]
}`;

  return await generateJSON<BusinessPlanData['successMetrics']>(prompt, {
    systemPrompt: BUSINESS_PLAN_SYSTEM_PROMPT,
  });
}

/**
 * Get mock business plan for development
 */
function getMockBusinessPlan(context: BusinessPlanContext): BusinessPlanData {
  const { selectedStrategy } = context;

  return {
    executiveSummary: {
      opportunity: `The AI market is experiencing explosive growth, with businesses seeking practical applications of cutting-edge research like "${context.paper.title}". This creates a unique opportunity to bridge academic innovation with commercial needs.`,
      solution: `We're building ${selectedStrategy.title} - a ${selectedStrategy.description.toLowerCase()}. This leverages recent breakthroughs to deliver immediate value to customers.`,
      marketSize: 'TAM: $50B+ (AI/ML market), SAM: $5B (specific vertical), SOM: $50M (realistic 3-year capture)',
      revenue: selectedStrategy.estimatedRevenue,
      askOrNext: 'Seeking initial validation with beta customers, then $50K seed round for full launch',
    },
    technologyOverview: {
      paperSummary: context.paper.abstract.substring(0, 300) + '...',
      keyInnovation: 'Novel approach that significantly improves upon existing solutions',
      technicalAdvantages: [
        'Better performance than current alternatives',
        'Lower computational requirements',
        'Easier to implement and maintain',
      ],
      implementationComplexity: selectedStrategy.difficulty === 'beginner' ? 'low' : selectedStrategy.difficulty === 'advanced' ? 'high' : 'medium',
    },
    marketAnalysis: {
      tam: { value: '$50B', description: 'Global AI/ML market growing 35% annually' },
      sam: { value: '$5B', description: 'Targetable segment within specific vertical' },
      som: { value: '$50M', description: 'Realistic market capture over 3 years' },
      trends: [
        'Increasing AI adoption across industries',
        'Demand for practical, deployable solutions',
        'Shift from research to production',
      ],
      painPoints: [
        'Difficulty implementing cutting-edge research',
        'High costs of current solutions',
        'Need for specialized expertise',
      ],
      existingAlternatives: [
        'Manual processes',
        'Legacy software solutions',
        'Custom in-house development',
      ],
    },
    competitiveLandscape: {
      directCompetitors: [
        {
          name: 'Established Player A',
          description: 'Market leader with comprehensive solution',
          strengths: ['Brand recognition', 'Large customer base'],
          weaknesses: ['High prices', 'Slow innovation'],
        },
      ],
      indirectCompetitors: [
        {
          name: 'Alternative Approach B',
          description: 'Different technical approach to same problem',
        },
      ],
      competitiveAdvantages: [
        'Latest research-backed technology',
        'Better price-performance ratio',
        'Faster implementation',
      ],
      threats: [
        'Established players could copy approach',
        'Rapid technological change',
      ],
    },
    productStrategy: {
      mvpFeatures: selectedStrategy.steps.slice(0, 3).map((step, i) => ({
        name: `Core Feature ${i + 1}`,
        description: step,
        priority: 'high' as const,
      })),
      phase1Features: ['Enhanced UX', 'API access', 'Analytics dashboard'],
      phase2Features: ['Enterprise features', 'White-label options', 'Advanced integrations'],
      roadmap: [
        {
          phase: 'MVP',
          timeline: 'Weeks 1-4',
          goals: ['Validate core value prop', 'Get first 10 users'],
        },
        {
          phase: 'Beta',
          timeline: 'Weeks 5-8',
          goals: ['Refine based on feedback', '50 active users'],
        },
        {
          phase: 'Launch',
          timeline: 'Weeks 9-12',
          goals: ['Public launch', 'Revenue generation'],
        },
      ],
    },
    revenueModel: {
      pricingStrategy: 'Value-based pricing with tiered subscription model',
      tiers: [
        {
          name: 'Starter',
          price: '$29/month',
          features: ['Basic features', 'Limited usage', 'Email support'],
          targetCustomer: 'Individual developers, small projects',
        },
        {
          name: 'Pro',
          price: '$99/month',
          features: ['All features', 'Higher limits', 'Priority support'],
          targetCustomer: 'Growing businesses, teams',
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          features: ['Unlimited', 'White-label', 'Dedicated support'],
          targetCustomer: 'Large organizations',
        },
      ],
      unitEconomics: {
        cac: '$50',
        ltv: '$600',
        ltvCacRatio: 12,
        grossMargin: '85%',
      },
      revenueStreams: ['Subscription revenue (primary)', 'API usage fees', 'Professional services'],
    },
    goToMarket: {
      targetCustomer: {
        persona: 'Engineering Manager or CTO',
        demographics: 'Tech companies, 10-500 employees, VC-backed or profitable',
        painPoints: [
          'Need to stay competitive with latest AI',
          'Limited engineering resources',
          'High costs of custom development',
        ],
        buyingBehavior: 'Research online, try before buying, value ROI',
      },
      acquisitionChannels: [
        {
          channel: 'Content Marketing',
          strategy: 'Technical blog posts, tutorials, case studies',
          expectedCac: '$30',
        },
        {
          channel: 'Product Hunt',
          strategy: 'Launch campaign, community engagement',
          expectedCac: '$20',
        },
        {
          channel: 'Twitter/X',
          strategy: 'Build in public, share progress, engage community',
          expectedCac: '$15',
        },
      ],
      contentStrategy: [
        'Weekly technical blog posts',
        'Video tutorials and demos',
        'Open source components',
      ],
      partnerships: [
        'Integration partnerships with complementary tools',
        'Reseller agreements with agencies',
      ],
      launchPlan: [
        {
          phase: 'Soft Launch',
          duration: '2 weeks',
          activities: ['Beta user recruitment', 'Gather feedback', 'Iterate'],
          successMetrics: ['10 active users', 'NPS > 50'],
        },
        {
          phase: 'Public Launch',
          duration: '1 week',
          activities: ['Product Hunt launch', 'Press outreach', 'Social campaign'],
          successMetrics: ['500 signups', 'Top 5 on PH'],
        },
      ],
    },
    financialProjections: {
      assumptions: [
        { assumption: 'Conversion rate', value: '2%', rationale: 'SaaS industry average' },
        { assumption: 'Churn rate', value: '5%/month', rationale: 'Early stage typical' },
        { assumption: 'Average revenue per user', value: '$60/month', rationale: 'Mix of tiers' },
      ],
      yearOne: {
        months: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          revenue: Math.max(0, (i - 2) * 1000),
          costs: 1500 + i * 200,
          profit: Math.max(0, (i - 2) * 1000) - (1500 + i * 200),
          users: Math.max(0, (i - 2) * 20),
        })),
      },
      breakEven: { month: 6, mrr: '$6000', users: 100 },
    },
    implementationTimeline: {
      weeks: selectedStrategy.steps.map((step, i) => ({
        week: i + 1,
        focus: step,
        deliverables: [`Complete: ${step}`, 'Test and validate'],
        resources: selectedStrategy.resources || ['Development tools', 'Cloud hosting'],
      })),
      criticalPath: ['MVP development', 'User testing', 'Launch preparation'],
      dependencies: [
        { task: 'Launch', dependsOn: ['MVP complete', 'Beta testing done'] },
      ],
    },
    riskAnalysis: {
      technical: [
        {
          risk: 'Implementation complexity higher than expected',
          probability: 'medium' as const,
          impact: 'high' as const,
          mitigation: 'Start with simpler MVP, iterate based on learnings',
        },
      ],
      market: [
        {
          risk: 'Market not ready for this solution',
          probability: 'low' as const,
          impact: 'high' as const,
          mitigation: 'Validate with potential customers early, pivot if needed',
        },
      ],
      financial: [
        {
          risk: 'Higher customer acquisition costs than projected',
          probability: 'medium' as const,
          impact: 'medium' as const,
          mitigation: 'Focus on organic channels, optimize conversion funnel',
        },
      ],
      mitigationStrategies: [
        'Maintain capital efficiency - bootstrap initially',
        'Build in public for free marketing',
        'Focus on product-led growth',
      ],
    },
    resourceRequirements: {
      team: [
        {
          role: 'Full-stack Developer',
          responsibilities: ['Build MVP', 'Deploy infrastructure', 'Customer support'],
          timeline: 'Full-time from week 1',
          cost: 'Sweat equity or $5K/mo',
        },
      ],
      tools: [
        { name: 'Vercel', purpose: 'Hosting and deployment', cost: '$20/mo' },
        { name: 'Stripe', purpose: 'Payment processing', cost: '2.9% + $0.30' },
      ],
      infrastructure: (selectedStrategy.resources || []).map((resource) => ({
        service: resource,
        purpose: 'Core platform functionality',
        estimatedCost: '$50-200/mo',
      })),
      budget: {
        initialInvestment: '$5,000',
        monthlyRunRate: '$500',
        breakdown: [
          { category: 'Development', amount: '$3000' },
          { category: 'Infrastructure', amount: '$200/mo' },
          { category: 'Marketing', amount: '$300/mo' },
        ],
      },
    },
    successMetrics: {
      kpis: [
        {
          metric: 'Monthly Recurring Revenue (MRR)',
          target: '$5,000',
          timeline: 'Month 6',
          measurement: 'Stripe dashboard',
        },
        {
          metric: 'Active Users',
          target: '100',
          timeline: 'Month 3',
          measurement: 'Analytics platform',
        },
        {
          metric: 'Customer Acquisition Cost (CAC)',
          target: '< $50',
          timeline: 'Ongoing',
          measurement: 'Marketing spend / new customers',
        },
      ],
      milestones: [
        { milestone: 'First paying customer', target: '1', deadline: 'Week 6' },
        { milestone: 'Break even', target: 'MRR > costs', deadline: 'Month 6' },
        { milestone: 'Product-market fit', target: 'NPS > 50', deadline: 'Month 9' },
      ],
      validationCriteria: [
        'Customers renewing after first month',
        'Organic referrals happening',
        'Usage growing week-over-week',
      ],
    },
  };
}
