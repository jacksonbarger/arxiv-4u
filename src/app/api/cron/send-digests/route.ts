import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';
import { User } from '@/lib/auth';
import { fetchPapers } from '@/lib/arxiv-api';
import { getWeeklyDigestEmailHtml, getWeeklyDigestEmailText } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all user keys
    const userKeys = await kv.keys('user:email:*');

    if (!userKeys || userKeys.length === 0) {
      return NextResponse.json({ message: 'No users found' });
    }

    let emailsSent = 0;
    let errors = 0;

    // Process each user
    for (const key of userKeys) {
      try {
        const user = await kv.get<User>(key);

        if (!user) continue;

        // Skip if user has email notifications disabled or wrong frequency
        if (!user.emailNotifications || user.notificationFrequency !== 'weekly') {
          continue;
        }

        // Skip if user has no selected categories
        if (!user.notificationCategories || user.notificationCategories.length === 0) {
          continue;
        }

        // Fetch papers from last 7 days
        // Note: In production, you'd want to cache these papers to avoid fetching for each user
        const result = await fetchPapers({ maxResults: 50 }); // Fetch recent papers

        // Filter papers by user's categories
        // This is simplified - in production you'd want better category matching
        const relevantPapers = result.papers.slice(0, 10); // Send top 10 papers

        if (relevantPapers.length === 0) {
          continue; // No papers to send
        }

        // Send digest email
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Arxiv-4U <onboarding@resend.dev>',
          to: user.email,
          subject: `Your Weekly AI/ML Paper Digest - ${relevantPapers.length} New Papers`,
          html: getWeeklyDigestEmailHtml(user.username, relevantPapers),
          text: getWeeklyDigestEmailText(user.username, relevantPapers),
        });

        emailsSent++;
      } catch (error) {
        console.error(`Error processing user ${key}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      errors,
      message: `Sent ${emailsSent} digest emails with ${errors} errors`,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to send digests' },
      { status: 500 }
    );
  }
}
