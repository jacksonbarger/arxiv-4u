/**
 * Create ARXIV4FREE Promo Code
 *
 * This creates a special promo code that gives users:
 * - 1 week of Premium tier access
 * - Requires card information (for subscription after trial)
 * - 100% discount for the trial period
 *
 * Usage: npx tsx scripts/create-promo-arxiv4free.ts
 */

import { sql } from '@vercel/postgres';

async function createPromoCode() {
  try {
    console.log('🚀 Creating ARXIV4FREE promo code...\n');

    // Check if promo code already exists
    const existing = await sql`
      SELECT id FROM promo_codes WHERE UPPER(code) = 'ARXIV4FREE'
    `;

    if (existing.rows.length > 0) {
      console.log('⚠️  ARXIV4FREE promo code already exists!');
      console.log('   Use the existing code or delete it first.');
      return;
    }

    // Create the promo code
    // Note: This gives 100% off, effectively making it a free trial
    // The trial period and card requirement should be handled in your Stripe checkout logic
    const result = await sql`
      INSERT INTO promo_codes (
        code,
        discount_type,
        discount_value,
        max_uses,
        max_uses_per_user,
        applicable_tiers,
        description,
        valid_from,
        valid_until,
        is_active
      ) VALUES (
        'ARXIV4FREE',
        'percentage',
        100,
        NULL,
        1,
        '["premium"]'::jsonb,
        '1 week free trial of Premium tier - Card required, auto-renews at $39/month',
        NOW(),
        NULL,
        true
      )
      RETURNING id, code, discount_value, discount_type
    `;

    const promo = result.rows[0];

    console.log('✅ Successfully created promo code!\n');
    console.log('📋 Promo Code Details:');
    console.log('   Code: ARXIV4FREE');
    console.log('   Discount: 100% off first week');
    console.log('   Applicable Tier: Premium (highest tier)');
    console.log('   Uses Per User: 1');
    console.log('   Total Uses: Unlimited');
    console.log('   Status: Active\n');

    console.log('🎯 How to use:');
    console.log('   1. Go to /pricing page');
    console.log('   2. Enter code: ARXIV4FREE');
    console.log('   3. Select Premium tier');
    console.log('   4. Enter card information (required for trial)');
    console.log('   5. Get 100% off first week!\n');

    console.log('💡 Integration Note:');
    console.log('   - Set up a 7-day trial in Stripe with this promo code');
    console.log('   - Require card on file for the trial');
    console.log('   - After trial: $39/month (or $390/year)');
    console.log('   - Users can cancel anytime via Settings → Subscription\n');

  } catch (error) {
    console.error('❌ Error creating promo code:', error);
    throw error;
  }
}

// Run the script
createPromoCode()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create promo code:', error);
    process.exit(1);
  });
