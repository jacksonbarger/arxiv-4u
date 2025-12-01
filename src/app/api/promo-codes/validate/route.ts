import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const { code, tier } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Promo code is required', valid: false }, { status: 400 });
    }

    // Get session for user tracking (optional)
    const session = await auth();
    const userEmail = session?.user?.email;

    // Fetch promo code from database
    const promoResult = await sql`
      SELECT
        id,
        code,
        discount_type,
        discount_value,
        max_uses,
        uses_count,
        max_uses_per_user,
        applicable_tiers,
        min_purchase_amount,
        valid_from,
        valid_until,
        is_active
      FROM promo_codes
      WHERE UPPER(code) = UPPER(${code})
      AND is_active = TRUE
    `;

    if (promoResult.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid promo code', valid: false }, { status: 404 });
    }

    const promo = promoResult.rows[0];

    // Validate expiry
    const now = new Date();
    if (promo.valid_until && new Date(promo.valid_until) < now) {
      return NextResponse.json({ error: 'Promo code has expired', valid: false }, { status: 400 });
    }

    if (promo.valid_from && new Date(promo.valid_from) > now) {
      return NextResponse.json({ error: 'Promo code is not yet valid', valid: false }, { status: 400 });
    }

    // Validate usage limits
    if (promo.max_uses && promo.uses_count >= promo.max_uses) {
      return NextResponse.json({ error: 'Promo code has reached maximum uses', valid: false }, { status: 400 });
    }

    // Check if applicable to tier
    if (tier && promo.applicable_tiers) {
      const applicableTiers = promo.applicable_tiers as string[];
      if (!applicableTiers.includes(tier)) {
        return NextResponse.json({ error: `Promo code not applicable to ${tier} tier`, valid: false }, { status: 400 });
      }
    }

    // Check user-specific usage if logged in
    if (userEmail) {
      const usageResult = await sql`
        SELECT COUNT(*) as usage_count
        FROM promo_code_usage pcu
        JOIN users u ON pcu.user_id = u.id
        WHERE pcu.promo_code_id = ${promo.id}
        AND u.email = ${userEmail}
      `;

      const userUsageCount = parseInt(usageResult.rows[0].usage_count);
      if (promo.max_uses_per_user && userUsageCount >= promo.max_uses_per_user) {
        return NextResponse.json({ error: 'You have already used this promo code', valid: false }, { status: 400 });
      }
    }

    // Promo code is valid
    return NextResponse.json({
      valid: true,
      code: promo.code,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      min_purchase_amount: promo.min_purchase_amount,
    });

  } catch (error) {
    console.error('Promo code validation error:', error);
    return NextResponse.json({ error: 'Failed to validate promo code', valid: false }, { status: 500 });
  }
}
