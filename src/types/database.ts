// Database types for Vercel Postgres

export type SubscriptionTier = 'free' | 'standard' | 'pro' | 'enterprise';

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'expired'
  | 'unpaid'
  | 'incomplete';

export type PurchaseType = 'free' | 'one_time' | 'subscription';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';

export type ImplementationDifficulty = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;

  // Email verification
  email_verified: boolean;
  verification_token?: string;
  verification_token_expiry?: string;

  // Subscription
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  trial_ends_at?: string;
  subscription_period_end?: string;

  // Stripe
  stripe_customer_id?: string;
  stripe_subscription_id?: string;

  // Preferences
  email_notifications: boolean;
  notification_frequency: 'daily' | 'weekly';
  notification_categories: string[];

  // Usage
  business_plans_generated: number;
  free_business_plans_remaining: number;
  last_business_plan_generated_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  stripe_price_id: string;

  status: SubscriptionStatus;
  tier: 'free' | 'standard' | 'pro' | 'enterprise';

  current_period_start: string;
  current_period_end: string;
  trial_start?: string;
  trial_end?: string;
  canceled_at?: string;
  ended_at?: string;

  created_at: string;
  updated_at: string;
}

export interface BusinessPlan {
  id: string;
  user_id: string;
  paper_id: string;
  paper_title: string;

  // Plan content
  plan_data: BusinessPlanData;

  // Metadata
  category?: string;
  strategy_title?: string;

  // Purchase
  purchase_type: PurchaseType;
  amount_paid: number; // cents
  stripe_payment_intent_id?: string;

  // Versioning
  version: number;
  parent_plan_id?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
  last_viewed_at?: string;
}

export interface BusinessPlanData {
  executiveSummary: {
    opportunity: string;
    solution: string;
    marketSize: string;
    revenue: string;
    askOrNext: string;
  };

  technologyOverview: {
    paperSummary: string;
    keyInnovation: string;
    technicalAdvantages: string[];
    implementationComplexity: ImplementationDifficulty;
  };

  marketAnalysis: {
    tam: { value: string; description: string };
    sam: { value: string; description: string };
    som: { value: string; description: string };
    trends: string[];
    painPoints: string[];
    existingAlternatives: string[];
  };

  competitiveLandscape: {
    directCompetitors: Array<{
      name: string;
      description: string;
      strengths: string[];
      weaknesses: string[];
    }>;
    indirectCompetitors: Array<{
      name: string;
      description: string;
    }>;
    competitiveAdvantages: string[];
    threats: string[];
  };

  productStrategy: {
    mvpFeatures: Array<{
      name: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    phase1Features: string[];
    phase2Features: string[];
    roadmap: Array<{
      phase: string;
      timeline: string;
      goals: string[];
    }>;
  };

  revenueModel: {
    pricingStrategy: string;
    tiers: Array<{
      name: string;
      price: string;
      features: string[];
      targetCustomer: string;
    }>;
    unitEconomics: {
      cac: string;
      ltv: string;
      ltvCacRatio: number;
      grossMargin: string;
    };
    revenueStreams: string[];
  };

  goToMarket: {
    targetCustomer: {
      persona: string;
      demographics: string;
      painPoints: string[];
      buyingBehavior: string;
    };
    acquisitionChannels: Array<{
      channel: string;
      strategy: string;
      expectedCac: string;
    }>;
    contentStrategy: string[];
    partnerships: string[];
    launchPlan: Array<{
      phase: string;
      duration: string;
      activities: string[];
      successMetrics: string[];
    }>;
  };

  financialProjections: {
    assumptions: Array<{
      assumption: string;
      value: string;
      rationale: string;
    }>;
    yearOne: {
      months: Array<{
        month: number;
        revenue: number;
        costs: number;
        profit: number;
        users: number;
      }>;
    };
    breakEven: {
      month: number;
      mrr: string;
      users: number;
    };
  };

  implementationTimeline: {
    weeks: Array<{
      week: number;
      focus: string;
      deliverables: string[];
      resources: string[];
    }>;
    criticalPath: string[];
    dependencies: Array<{
      task: string;
      dependsOn: string[];
    }>;
  };

  riskAnalysis: {
    technical: Array<{
      risk: string;
      probability: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      mitigation: string;
    }>;
    market: Array<{
      risk: string;
      probability: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      mitigation: string;
    }>;
    financial: Array<{
      risk: string;
      probability: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      mitigation: string;
    }>;
    mitigationStrategies: string[];
  };

  resourceRequirements: {
    team: Array<{
      role: string;
      responsibilities: string[];
      timeline: string;
      cost: string;
    }>;
    tools: Array<{
      name: string;
      purpose: string;
      cost: string;
    }>;
    infrastructure: Array<{
      service: string;
      purpose: string;
      estimatedCost: string;
    }>;
    budget: {
      initialInvestment: string;
      monthlyRunRate: string;
      breakdown: Array<{
        category: string;
        amount: string;
      }>;
    };
  };

  successMetrics: {
    kpis: Array<{
      metric: string;
      target: string;
      timeline: string;
      measurement: string;
    }>;
    milestones: Array<{
      milestone: string;
      target: string;
      deadline: string;
    }>;
    validationCriteria: string[];
  };
}

export interface OneTimePurchase {
  id: string;
  user_id: string;
  paper_id: string;

  product_type: 'business_plan';

  stripe_payment_intent_id: string;
  amount: number; // cents
  currency: string;
  status: PaymentStatus;

  business_plan_id?: string;

  created_at: string;
  updated_at: string;
}

export interface PaperCache {
  id: string;
  paper_id: string;

  summary?: string;
  marketing_insights?: Record<string, unknown>;
  commercial_score?: number;
  key_findings?: string[];
  target_audience?: string;
  implementation_difficulty?: ImplementationDifficulty;

  analyzed_at: string;
  expires_at: string;
  analysis_version: number;
}

export interface Bookmark {
  id: string;
  user_id: string;
  paper_id: string;

  notes?: string;
  collection_name?: string;

  created_at: string;
}

export interface ReadingHistory {
  id: string;
  user_id: string;
  paper_id: string;

  first_viewed_at: string;
  last_viewed_at: string;
  view_count: number;
  read_duration_seconds: number;
}

export interface Notification {
  id: string;
  user_id: string;

  type: string;
  title: string;
  message: string;

  paper_id?: string;
  action_url?: string;

  read: boolean;
  created_at: string;
}

export interface UsageAnalytics {
  id: string;
  user_id: string;

  event_type: string;
  event_data?: Record<string, unknown>;

  created_at: string;
}
