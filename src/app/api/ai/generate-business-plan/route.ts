import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateBusinessPlan, BusinessPlanContext } from '@/lib/ai/business-plan-generator';
import {
  getUserByEmail,
  createBusinessPlan,
  createOneTimePurchase,
  updateOneTimePurchaseStatus,
  hasAccessToBusinessPlan,
} from '@/lib/db';
import {
  checkBusinessPlanAccess,
  consumeFreeGeneration,
  recordPaidGeneration,
  trackUsageEvent,
} from '@/lib/usage';
import {
  applyRateLimit,
  businessPlanInputSchema,
  validateRequestBody,
  auditLog,
  getClientInfo,
} from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting (5 requests per minute for AI endpoints)
    const session = await auth();
    const rateLimitResponse = await applyRateLimit(
      req,
      'ai:business-plan',
      session?.user?.id
    );
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Check authentication
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate request body with Zod schema
    const validation = await validateRequestBody(req.clone(), businessPlanInputSchema);
    if (!validation.success) {
      return validation.response;
    }

    const { paper, categoryMatch, selectedStrategy, userInputs, paymentIntentId } = validation.data;

    // Get user from database
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check access to this specific paper's business plan
    const alreadyHasAccess = await hasAccessToBusinessPlan(user.id, paper.id);
    if (alreadyHasAccess) {
      // User already has access, just return the existing plan
      // (In a real implementation, you'd fetch and return it)
      return NextResponse.json({
        error: 'Already generated',
        message: 'You already have a business plan for this paper',
      });
    }

    // Check if user can generate a business plan
    const accessCheck = await checkBusinessPlanAccess(user, paper.id);

    if (!accessCheck.canGenerate) {
      // User needs to either pay $0.99 or upgrade
      if (accessCheck.requiresPayment && !paymentIntentId) {
        return NextResponse.json(
          {
            error: 'Payment required',
            message: accessCheck.reason,
            freeRemaining: accessCheck.freeRemaining,
            requiresUpgrade: accessCheck.requiresUpgrade,
          },
          { status: 402 }
        );
      }

      if (accessCheck.requiresUpgrade && !paymentIntentId) {
        return NextResponse.json(
          {
            error: 'Upgrade required',
            message: accessCheck.reason,
            tier: user.subscription_tier,
          },
          { status: 403 }
        );
      }
    }

    // Determine purchase type
    let purchaseType: 'free' | 'one_time' | 'subscription' = 'free';
    let amountPaid = 0;
    let stripePaymentIntentId: string | undefined;

    if (user.subscription_tier === 'pro' || user.subscription_tier === 'enterprise') {
      purchaseType = 'subscription';
    } else if (paymentIntentId) {
      purchaseType = 'one_time';
      amountPaid = 99; // $0.99 in cents
      stripePaymentIntentId = paymentIntentId;
    } else if (accessCheck.freeRemaining > 0) {
      purchaseType = 'free';
    }

    // Track usage event
    await trackUsageEvent(user.id, 'business_plan_generation_started', {
      paperId: paper.id,
      purchaseType,
    });

    // Generate business plan using AI
    const context: BusinessPlanContext = {
      paper,
      categoryMatch,
      selectedStrategy,
      userInputs: userInputs || {},
    };

    const planData = await generateBusinessPlan(context);

    // Save business plan to database
    const savedPlan = await createBusinessPlan({
      userId: user.id,
      paperId: paper.id,
      paperTitle: paper.title,
      planData,
      category: categoryMatch.category,
      strategyTitle: selectedStrategy.title,
      purchaseType,
      amountPaid,
      stripePaymentIntentId,
    });

    // Update usage tracking
    if (purchaseType === 'free') {
      await consumeFreeGeneration(user.id);
    } else {
      await recordPaidGeneration(user.id);
    }

    // If this was a paid purchase, update the purchase record
    if (stripePaymentIntentId) {
      await updateOneTimePurchaseStatus(
        stripePaymentIntentId,
        'succeeded',
        savedPlan.id
      );
    }

    // Track completion event
    await trackUsageEvent(user.id, 'business_plan_generated', {
      paperId: paper.id,
      planId: savedPlan.id,
      purchaseType,
    });

    // Audit log successful generation
    const { ip, requestId } = getClientInfo(req);
    await auditLog({
      action: purchaseType === 'one_time' ? 'business_plan:purchased' : 'business_plan:generated',
      userId: user.id,
      email: session.user.email,
      ip,
      requestId,
      metadata: {
        paperId: paper.id,
        planId: savedPlan.id,
        purchaseType,
        amountPaid,
      },
      success: true,
    });

    return NextResponse.json({
      success: true,
      plan: savedPlan,
      planData,
    });
  } catch (error) {
    console.error('Error generating business plan:', error);

    // Audit log failed generation (only if we have session)
    try {
      const session = await auth();
      if (session?.user) {
        const { ip, requestId } = getClientInfo(req);
        await auditLog({
          action: 'business_plan:generated',
          userId: session.user.id,
          email: session.user.email || undefined,
          ip,
          requestId,
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    } catch {
      // Ignore audit log errors
    }

    return NextResponse.json(
      { error: 'Failed to generate business plan' },
      { status: 500 }
    );
  }
}
