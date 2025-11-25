import { TopicCategory, CategoryMatch, ArxivPaper } from '@/types/arxiv';

export interface ProfitStrategy {
  title: string;
  description: string;
  steps: string[];
  estimatedRevenue: string;
  timeToMarket: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ProfitInsights {
  category: TopicCategory;
  marketContext: string;
  strategies: ProfitStrategy[];
  quickWins: string[];
  resources: string[];
}

// Category-specific profit strategies
const PROFIT_STRATEGIES: Record<TopicCategory, (paper: ArxivPaper, keywords: string[]) => ProfitInsights> = {
  'agentic-coding': (paper, keywords) => ({
    category: 'agentic-coding',
    marketContext: 'The AI agent market is projected to reach $65B by 2030. Businesses are actively seeking automation solutions to reduce operational costs and increase productivity.',
    strategies: [
      {
        title: 'Build a Specialized AI Agent SaaS',
        description: 'Use techniques from this paper to create a domain-specific AI agent that automates repetitive tasks in a niche industry.',
        steps: [
          'Identify a niche with repetitive, well-defined tasks (e.g., real estate, legal, healthcare admin)',
          'Implement the agent architecture described in the paper using LangChain or CrewAI',
          'Create a simple web interface with auth and usage tracking',
          'Offer tiered pricing: Free (limited), Pro ($49/mo), Enterprise (custom)',
          'Market through LinkedIn content and niche communities'
        ],
        estimatedRevenue: '$5K-50K/month',
        timeToMarket: '4-8 weeks',
        difficulty: 'intermediate'
      },
      {
        title: 'Agent Development Consulting',
        description: 'Position yourself as an expert in implementing the methodologies from cutting-edge research.',
        steps: [
          'Create a detailed blog post explaining the paper\'s approach in practical terms',
          'Build a demo showcasing the technique applied to a business problem',
          'Offer implementation services at $150-300/hr',
          'Target funded startups and mid-size tech companies',
          'Package as fixed-price projects ($10K-50K)'
        ],
        estimatedRevenue: '$10K-30K/project',
        timeToMarket: '1-2 weeks',
        difficulty: 'intermediate'
      },
      {
        title: 'Open Source Framework + Premium Support',
        description: 'Build an open-source implementation and monetize through enterprise support and hosted solutions.',
        steps: [
          'Create a clean, well-documented open-source implementation',
          'Build community through Discord/Slack and GitHub engagement',
          'Offer paid support tiers and custom development',
          'Consider a cloud-hosted version for teams',
          'Monetize through sponsorships and enterprise licenses'
        ],
        estimatedRevenue: '$2K-20K/month',
        timeToMarket: '6-12 weeks',
        difficulty: 'advanced'
      }
    ],
    quickWins: [
      'Write a "practical implementation guide" blog post - can generate consulting leads',
      'Create a YouTube tutorial implementing the core concepts',
      'Build a simple demo and share on Twitter/X for visibility',
      'Offer "AI Agent Audit" services to review existing implementations'
    ],
    resources: [
      'LangChain/LangGraph for agent frameworks',
      'OpenAI or Anthropic APIs for the LLM backbone',
      'Supabase or Firebase for quick backend',
      'Vercel for deployment'
    ]
  }),

  'image-generation': (paper, keywords) => ({
    category: 'image-generation',
    marketContext: 'The AI image generation market is valued at $1.4B and growing 20%+ annually. Businesses, creators, and marketers need custom, high-quality visuals at scale.',
    strategies: [
      {
        title: 'Custom LoRA Training Service',
        description: 'Offer specialized model training for brands, characters, or styles based on techniques in this paper.',
        steps: [
          'Set up a training pipeline using the methodology described',
          'Create a simple order form for customers to upload reference images',
          'Price at $199-999 per custom model based on complexity',
          'Deliver models compatible with popular tools (ComfyUI, A1111)',
          'Market to game devs, brand agencies, and content creators'
        ],
        estimatedRevenue: '$3K-15K/month',
        timeToMarket: '2-4 weeks',
        difficulty: 'intermediate'
      },
      {
        title: 'AI Art Generation API',
        description: 'Build an API service implementing the paper\'s techniques for developers to integrate.',
        steps: [
          'Implement the model/technique as a REST API',
          'Deploy on RunPod Serverless for cost-effective scaling',
          'Create usage-based pricing ($0.01-0.10 per generation)',
          'Document the API and create SDKs for popular languages',
          'Market to app developers and no-code tool creators'
        ],
        estimatedRevenue: '$1K-20K/month',
        timeToMarket: '3-6 weeks',
        difficulty: 'advanced'
      },
      {
        title: 'Niche Image Generation Tool',
        description: 'Apply the technique to a specific vertical like real estate, fashion, or product photography.',
        steps: [
          'Pick a niche with clear pain points (e.g., real estate staging)',
          'Build a focused tool that solves one problem really well',
          'Charge $29-99/month subscription',
          'Partner with industry influencers for marketing',
          'Offer white-label solutions to agencies'
        ],
        estimatedRevenue: '$5K-30K/month',
        timeToMarket: '4-8 weeks',
        difficulty: 'intermediate'
      }
    ],
    quickWins: [
      'Create and sell LoRAs on Civitai - immediate revenue potential',
      'Offer "AI product photography" on Fiverr/Upwork',
      'Build a viral Twitter bot showcasing the technique',
      'Create a Gumroad course on implementing the method'
    ],
    resources: [
      'ComfyUI for flexible pipelines',
      'RunPod or Vast.ai for GPU compute',
      'HuggingFace for model hosting',
      'Replicate for easy API deployment'
    ]
  }),

  'video-generation': (paper, keywords) => ({
    category: 'video-generation',
    marketContext: 'Video content demand is exploding - 82% of internet traffic is video. AI video tools are disrupting the $45B video production industry.',
    strategies: [
      {
        title: 'Automated Social Media Video Service',
        description: 'Use the technique to create a service that generates short-form videos for brands.',
        steps: [
          'Build a pipeline for consistent, branded video generation',
          'Create templates for common formats (TikTok, Reels, Shorts)',
          'Offer packages: 10 videos/mo ($499), 30/mo ($999), unlimited ($2499)',
          'Target D2C brands, real estate agents, local businesses',
          'Automate as much as possible for scalability'
        ],
        estimatedRevenue: '$10K-50K/month',
        timeToMarket: '4-8 weeks',
        difficulty: 'intermediate'
      },
      {
        title: 'Video Enhancement/Upscaling API',
        description: 'Offer video improvement services using the paper\'s methods.',
        steps: [
          'Implement temporal consistency techniques from the paper',
          'Build batch processing for efficiency',
          'Price per minute of video processed',
          'Target video editors, YouTubers, and production houses',
          'Offer both API access and a simple web interface'
        ],
        estimatedRevenue: '$2K-15K/month',
        timeToMarket: '3-6 weeks',
        difficulty: 'advanced'
      },
      {
        title: 'AI Video Course Creator',
        description: 'Build a tool that transforms scripts or articles into educational videos.',
        steps: [
          'Combine text-to-video with text-to-speech',
          'Create avatar options for presenters',
          'Add automatic B-roll and graphics generation',
          'Target course creators, educators, corporate trainers',
          'Price at $79-299/month based on video length limits'
        ],
        estimatedRevenue: '$5K-30K/month',
        timeToMarket: '6-10 weeks',
        difficulty: 'advanced'
      }
    ],
    quickWins: [
      'Offer "AI video ads" creation on freelance platforms',
      'Create faceless YouTube channels with AI-generated content',
      'Sell video templates and presets to other creators',
      'Run a "video of the day" showcase to build audience'
    ],
    resources: [
      'RunPod for GPU-heavy video processing',
      'AnimateDiff or SVD for base video generation',
      'ElevenLabs for voiceovers',
      'Cloudflare Stream for video delivery'
    ]
  }),

  'ai-content-creators': (paper, keywords) => ({
    category: 'ai-content-creators',
    marketContext: 'The creator economy is worth $250B+. AI tools that help creators produce more content faster are in massive demand.',
    strategies: [
      {
        title: 'Voice Cloning Service for Creators',
        description: 'Offer custom voice model training for podcasters, YouTubers, and brands.',
        steps: [
          'Set up voice cloning using techniques from the paper',
          'Create packages: Basic ($299), Pro ($599), Enterprise ($1499+)',
          'Include usage rights and quality guarantees',
          'Target content creators with established audiences',
          'Offer ongoing "voice API" access for $99-299/mo'
        ],
        estimatedRevenue: '$5K-25K/month',
        timeToMarket: '2-4 weeks',
        difficulty: 'intermediate'
      },
      {
        title: 'AI Avatar/Digital Twin Service',
        description: 'Create digital avatars or twins for influencers and businesses.',
        steps: [
          'Combine face generation with voice synthesis',
          'Offer "digital spokesperson" packages for businesses',
          'Create multi-language support for global reach',
          'Target HR (training videos), marketing, and creator agencies',
          'Price at $2K-10K per avatar + monthly hosting'
        ],
        estimatedRevenue: '$10K-40K/month',
        timeToMarket: '6-10 weeks',
        difficulty: 'advanced'
      },
      {
        title: 'Music/Audio Generation Tool',
        description: 'Build a tool for royalty-free music and sound effects generation.',
        steps: [
          'Implement music generation optimized for content creators',
          'Focus on specific genres (lo-fi, corporate, cinematic)',
          'Offer subscription with commercial licensing included',
          'Price at $19-99/month for unlimited generations',
          'Partner with video editing tools for integrations'
        ],
        estimatedRevenue: '$3K-20K/month',
        timeToMarket: '4-8 weeks',
        difficulty: 'intermediate'
      }
    ],
    quickWins: [
      'Offer voice cloning on Fiverr - $50-200 per voice',
      'Create stock AI voices and sell licenses',
      'Make AI music and upload to royalty-free platforms',
      'Build a viral TikTok showcase of the technology'
    ],
    resources: [
      'Coqui or XTTS for voice cloning',
      'Suno or MusicGen for audio',
      'HeyGen or D-ID for avatars',
      'Stripe for subscriptions'
    ]
  }),

  'comfyui': (paper, keywords) => ({
    category: 'comfyui',
    marketContext: 'ComfyUI has 100K+ active users seeking custom nodes and workflows. The ecosystem is highly monetizable through tooling and education.',
    strategies: [
      {
        title: 'Premium ComfyUI Node Pack',
        description: 'Implement the paper\'s technique as a custom node pack with excellent UX.',
        steps: [
          'Build well-tested, documented custom nodes',
          'Create example workflows demonstrating value',
          'Sell on Gumroad or your own site for $29-99',
          'Offer updates and support for premium tier',
          'Build a free basic version to drive traffic'
        ],
        estimatedRevenue: '$1K-10K/month',
        timeToMarket: '2-4 weeks',
        difficulty: 'intermediate'
      },
      {
        title: 'ComfyUI Workflow Marketplace',
        description: 'Create and sell production-ready workflows using this technique.',
        steps: [
          'Build complete, optimized workflows',
          'Document with video tutorials',
          'Sell individual workflows ($19-49) or bundles ($99-199)',
          'Offer customization services for enterprises',
          'Build email list for repeat customers'
        ],
        estimatedRevenue: '$2K-15K/month',
        timeToMarket: '1-3 weeks',
        difficulty: 'beginner'
      },
      {
        title: 'ComfyUI Cloud Service',
        description: 'Offer a hosted ComfyUI environment with your nodes pre-installed.',
        steps: [
          'Set up ComfyUI on cloud GPUs',
          'Pre-install popular nodes including yours',
          'Charge by the hour ($0.50-2/hr) or subscription',
          'Target users without local GPU resources',
          'Add team collaboration features for agencies'
        ],
        estimatedRevenue: '$5K-30K/month',
        timeToMarket: '4-8 weeks',
        difficulty: 'advanced'
      }
    ],
    quickWins: [
      'Create free tutorial videos and monetize through Patreon',
      'Sell workflow JSON files directly - zero maintenance',
      'Offer "ComfyUI setup" consulting services',
      'Write implementation guides and include affiliate links'
    ],
    resources: [
      'ComfyUI Manager for distribution',
      'GitHub for open-source components',
      'Discord for community building',
      'Gumroad for sales'
    ]
  }),

  'runpod': (paper, keywords) => ({
    category: 'runpod',
    marketContext: 'The inference market is growing 35% annually. Developers need optimized, cost-effective model deployment solutions.',
    strategies: [
      {
        title: 'Optimized Model Deployment Service',
        description: 'Offer to deploy and optimize models using techniques from this paper.',
        steps: [
          'Master the optimization techniques described',
          'Create a productized service with clear deliverables',
          'Charge $500-5000 per model optimization',
          'Target AI startups and companies with inference costs',
          'Offer ongoing maintenance contracts'
        ],
        estimatedRevenue: '$5K-30K/month',
        timeToMarket: '2-4 weeks',
        difficulty: 'advanced'
      },
      {
        title: 'Pre-optimized Model Library',
        description: 'Create and sell already-optimized versions of popular models.',
        steps: [
          'Optimize popular open-source models',
          'Benchmark and document performance gains',
          'Sell access via API or downloadable files',
          'Price based on model size and optimization level',
          'Build a reputation for quality optimizations'
        ],
        estimatedRevenue: '$2K-20K/month',
        timeToMarket: '3-6 weeks',
        difficulty: 'advanced'
      },
      {
        title: 'Inference Cost Calculator + Optimization Tool',
        description: 'Build a tool that analyzes workloads and suggests optimizations.',
        steps: [
          'Create a calculator for inference costs across providers',
          'Add optimization recommendations based on workload',
          'Offer free tier with premium analysis features',
          'Monetize through affiliate partnerships and consulting',
          'Target engineering teams evaluating deployment options'
        ],
        estimatedRevenue: '$1K-10K/month',
        timeToMarket: '2-4 weeks',
        difficulty: 'intermediate'
      }
    ],
    quickWins: [
      'Write benchmark comparisons and include affiliate links',
      'Offer "inference cost audit" consulting calls',
      'Create deployment templates for common frameworks',
      'Build a Discord community around optimization'
    ],
    resources: [
      'RunPod Serverless for deployment',
      'vLLM, TGI for serving optimization',
      'GGUF/llama.cpp for quantization',
      'Modal or Beam for alternatives'
    ]
  }),

  'market-opportunity': (paper, keywords) => ({
    category: 'market-opportunity',
    marketContext: 'This paper shows strong commercial signals. Papers tagged with market opportunity often indicate practical, deployable techniques.',
    strategies: [
      {
        title: 'First-Mover Implementation',
        description: 'Be the first to productize the technique described in this paper.',
        steps: [
          'Deeply understand the paper\'s core innovation',
          'Identify the clearest commercial application',
          'Build an MVP in 2-4 weeks',
          'Validate with early customers before scaling',
          'Document your implementation journey for marketing'
        ],
        estimatedRevenue: 'Varies - high upside potential',
        timeToMarket: '2-6 weeks',
        difficulty: 'intermediate'
      },
      {
        title: 'Integration/Plugin Development',
        description: 'Integrate the technique into existing popular platforms.',
        steps: [
          'Identify platforms that would benefit from this capability',
          'Build plugins, extensions, or integrations',
          'Offer both free and premium tiers',
          'Market through platform\'s ecosystem',
          'Consider acquisition by the platform'
        ],
        estimatedRevenue: '$2K-25K/month',
        timeToMarket: '3-6 weeks',
        difficulty: 'intermediate'
      },
      {
        title: 'Technical Content + Affiliate',
        description: 'Create educational content and monetize through courses and affiliates.',
        steps: [
          'Write an in-depth implementation guide',
          'Create a video course on the technique',
          'Include affiliate links to relevant tools/services',
          'Build an email list for future products',
          'Offer consulting for premium implementation help'
        ],
        estimatedRevenue: '$500-10K/month',
        timeToMarket: '1-3 weeks',
        difficulty: 'beginner'
      }
    ],
    quickWins: [
      'Tweet thread explaining the business opportunity',
      'LinkedIn post targeting relevant industry',
      'Quick blog post for SEO capture',
      'Reach out to potential customers for validation'
    ],
    resources: [
      'Twitter/X and LinkedIn for distribution',
      'Notion or your blog for content',
      'Cal.com for consulting bookings',
      'Stripe for payments'
    ]
  }),

  'other': (paper, keywords) => ({
    category: 'other',
    marketContext: 'While not fitting a specific category, this research may have unique applications worth exploring.',
    strategies: [
      {
        title: 'Novel Application Discovery',
        description: 'Identify non-obvious applications of this research.',
        steps: [
          'Map the core technique to different industries',
          'Talk to potential users in various fields',
          'Build a proof-of-concept for the most promising application',
          'Validate market demand before full development',
          'Document the unique angle for marketing'
        ],
        estimatedRevenue: 'Varies based on application',
        timeToMarket: '4-12 weeks',
        difficulty: 'advanced'
      }
    ],
    quickWins: [
      'Share interesting findings on social media',
      'Connect with the paper\'s authors for insights',
      'Join communities discussing similar research'
    ],
    resources: [
      'Arxiv and Semantic Scholar for related work',
      'Twitter/X for research community',
      'Discord servers for AI practitioners'
    ]
  })
};

export function generateProfitInsights(
  paper: ArxivPaper,
  categoryMatches: CategoryMatch[]
): ProfitInsights | null {
  if (categoryMatches.length === 0) {
    return null;
  }

  const primaryMatch = categoryMatches[0];
  const generator = PROFIT_STRATEGIES[primaryMatch.category];

  if (!generator) {
    return null;
  }

  return generator(paper, primaryMatch.matchedKeywords);
}

export function getDifficultyColor(difficulty: ProfitStrategy['difficulty']): string {
  switch (difficulty) {
    case 'beginner':
      return '#10B981'; // Green
    case 'intermediate':
      return '#F59E0B'; // Amber
    case 'advanced':
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
  }
}

export function getDifficultyLabel(difficulty: ProfitStrategy['difficulty']): string {
  switch (difficulty) {
    case 'beginner':
      return 'Beginner Friendly';
    case 'intermediate':
      return 'Some Experience Needed';
    case 'advanced':
      return 'Technical Expertise Required';
    default:
      return 'Unknown';
  }
}
