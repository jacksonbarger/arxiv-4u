import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@vercel/postgres';

// Generate a unique referral code
function generateReferralCode(email: string): string {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const emailPart = email.substring(0, 3).toUpperCase();
  return `${emailPart}${randomPart}`;
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Get or create user
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `;

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // Get or create referral code for user
    let referralCodeResult = await sql`
      SELECT
        id,
        referral_code,
        total_referrals,
        successful_referrals,
        total_rewards_earned
      FROM user_referral_codes
      WHERE user_id = ${userId}
    `;

    // Create referral code if doesn't exist
    if (referralCodeResult.rows.length === 0) {
      const newCode = generateReferralCode(userEmail);

      await sql`
        INSERT INTO user_referral_codes (user_id, referral_code)
        VALUES (${userId}, ${newCode})
      `;

      referralCodeResult = await sql`
        SELECT
          id,
          referral_code,
          total_referrals,
          successful_referrals,
          total_rewards_earned
        FROM user_referral_codes
        WHERE user_id = ${userId}
      `;
    }

    const referralCode = referralCodeResult.rows[0];

    // Get recent referrals
    const recentReferralsResult = await sql`
      SELECT
        referee_email as email,
        status,
        created_at
      FROM referrals
      WHERE referrer_user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Get pending rewards count
    const pendingRewardsResult = await sql`
      SELECT COUNT(*) as count
      FROM referral_rewards
      WHERE user_id = ${userId}
      AND status = 'pending'
    `;

    return NextResponse.json({
      referralCode: referralCode.referral_code,
      totalReferrals: referralCode.total_referrals || 0,
      successfulReferrals: referralCode.successful_referrals || 0,
      totalRewardsEarned: referralCode.total_rewards_earned || 0,
      pendingRewards: parseInt(pendingRewardsResult.rows[0].count) || 0,
      recentReferrals: recentReferralsResult.rows.map(row => ({
        email: row.email,
        status: row.status,
        createdAt: row.created_at,
      })),
    });

  } catch (error) {
    console.error('Referral stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch referral stats' }, { status: 500 });
  }
}
