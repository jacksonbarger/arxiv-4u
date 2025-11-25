import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { Resend } from 'resend';
import { getVerificationEmailHtml, getVerificationEmailText } from '@/lib/email-templates';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate username (alphanumeric, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters (letters, numbers, underscores)' },
        { status: 400 }
      );
    }

    // Validate password (min 6 chars)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Create user with verification token
    const user = await createUser(email, username, password, verificationToken, verificationTokenExpiry);

    if (!user) {
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Signup failed' },
      { status: 500 }
    );
  }
}
