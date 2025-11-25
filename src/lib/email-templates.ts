import { ArxivPaper } from '@/types/arxiv';

export function getVerificationEmailHtml(username: string, verificationUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #4A5568; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F3EF;">
  <div style="background-color: #FFFFFF; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 64px; height: 64px; background-color: #9EDCE1; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      </div>
      <h1 style="color: #4A5568; font-size: 24px; font-weight: 700; margin: 0;">Arxiv-4U</h1>
    </div>

    <!-- Content -->
    <div style="margin-bottom: 32px;">
      <h2 style="color: #4A5568; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Welcome, ${username}!</h2>
      <p style="margin-bottom: 16px;">Thank you for signing up for Arxiv-4U. To complete your registration and start discovering AI/ML research papers, please verify your email address.</p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${verificationUrl}" style="display: inline-block; background-color: #9EDCE1; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 24px; font-weight: 600; font-size: 16px;">Verify Email Address</a>
    </div>

    <!-- Alternative link -->
    <div style="margin-bottom: 32px; padding: 16px; background-color: #F5F3EF; border-radius: 8px;">
      <p style="margin: 0; font-size: 14px; color: #718096;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="margin: 8px 0 0 0; font-size: 14px;"><a href="${verificationUrl}" style="color: #9EDCE1; word-break: break-all;">${verificationUrl}</a></p>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #E2E8F0; padding-top: 24px; text-align: center;">
      <p style="font-size: 14px; color: #718096; margin: 0;">This verification link will expire in 24 hours.</p>
      <p style="font-size: 14px; color: #718096; margin: 8px 0 0 0;">If you didn't create an account, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getVerificationEmailText(username: string, verificationUrl: string): string {
  return `
Welcome to Arxiv-4U, ${username}!

Thank you for signing up. To complete your registration and start discovering AI/ML research papers, please verify your email address.

Verify your email by clicking this link:
${verificationUrl}

This verification link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

---
Arxiv-4U - AI/ML Research Papers
  `.trim();
}

export function getWeeklyDigestEmailHtml(username: string, papers: ArxivPaper[]): string {
  const paperListHtml = papers.map(paper => `
    <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #E2E8F0;">
      <h3 style="color: #4A5568; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
        <a href="https://arxiv.org/abs/${paper.id}" style="color: #4A5568; text-decoration: none;">${paper.title}</a>
      </h3>
      <p style="color: #718096; font-size: 14px; margin: 0 0 8px 0;">${paper.authors.slice(0, 3).map(a => a.name).join(', ')}${paper.authors.length > 3 ? ' et al.' : ''}</p>
      <p style="color: #718096; font-size: 14px; margin: 0 0 12px 0; line-height: 1.5;">${paper.summary.substring(0, 200)}...</p>
      <a href="https://arxiv.org/abs/${paper.id}" style="display: inline-block; color: #9EDCE1; text-decoration: none; font-size: 14px; font-weight: 600;">Read More →</a>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Weekly Paper Digest</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #4A5568; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F3EF;">
  <div style="background-color: #FFFFFF; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #4A5568; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">Your Weekly Digest</h1>
      <p style="color: #718096; font-size: 14px; margin: 0;">New papers matching your interests</p>
    </div>

    <!-- Greeting -->
    <div style="margin-bottom: 24px;">
      <p style="margin: 0;">Hi ${username},</p>
      <p style="margin: 8px 0 0 0;">Here are ${papers.length} new research papers from the past week that match your interests:</p>
    </div>

    <!-- Papers List -->
    <div style="margin-bottom: 32px;">
      ${paperListHtml}
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" style="display: inline-block; background-color: #9EDCE1; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 24px; font-weight: 600; font-size: 16px;">View All Papers</a>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #E2E8F0; padding-top: 24px; text-align: center;">
      <p style="font-size: 14px; color: #718096; margin: 0;">You're receiving this because you enabled weekly email notifications.</p>
      <p style="font-size: 14px; color: #718096; margin: 8px 0 0 0;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" style="color: #9EDCE1; text-decoration: none;">Manage your notification preferences</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getWeeklyDigestEmailText(username: string, papers: ArxivPaper[]): string {
  const paperListText = papers.map(paper => `
${paper.title}
By: ${paper.authors.slice(0, 3).map(a => a.name).join(', ')}${paper.authors.length > 3 ? ' et al.' : ''}
${paper.summary.substring(0, 200)}...
Read more: https://arxiv.org/abs/${paper.id}
  `).join('\n---\n');

  return `
Your Weekly Digest - Arxiv-4U

Hi ${username},

Here are ${papers.length} new research papers from the past week that match your interests:

${paperListText}

View all papers: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}

---
You're receiving this because you enabled weekly email notifications.
Manage your preferences: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}
  `.trim();
}
