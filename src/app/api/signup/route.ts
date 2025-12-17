import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { Resend } from 'resend';
import { getVerificationEmailHtml, getVerificationEmailText } from '@/lib/email-templates';
import crypto from 'crypto';
import {
  applyRateLimit,
  signupSchema,
  validateRequestBody,
  logAuthSuccess,
  logAuthFailure,
  getClientInfo,
} from '@/lib/security';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting for signup (3 attempts per minute)
    const rateLimitResponse = await applyRateLimit(request, 'auth:signup');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Validate input with Zod schema
    const validation = await validateRequestBody(request.clone(), signupSchema);
    if (!validation.success) {
      return validation.response;
    }

    const { email, username, password } = validation.data;

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Create user with verification token
    const user = await createUser(email, username, password, verificationToken, verificationTokenExpiry);

    if (!user) {
      // Log failed signup attempt (duplicate user)
      await logAuthFailure(request, 'auth:signup', email, 'Email or username already exists');

      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 409 }
      );
    }

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify?token=${verificationToken}`;

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Arxiv-4U <onboarding@resend.dev>',
        to: email,
        subject: 'Verify your email - Arxiv-4U',
        html: getVerificationEmailHtml(username, verificationUrl),
        text: getVerificationEmailText(username, verificationUrl),
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail signup if email fails - user can request resend
    }

    // Log successful signup
    await logAuthSuccess(request, 'auth:signup', user.id, email);

    return NextResponse.json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);

    // Log signup error
    try {
      const body = await request.clone().json().catch(() => ({}));
      const email = body.email || 'unknown';
      await logAuthFailure(
        request,
        'auth:signup',
        email,
        error instanceof Error ? error.message : 'Unknown error'
      );
    } catch {
      // Ignore audit log errors
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Signup failed' },
      { status: 500 }
    );
  }
}
