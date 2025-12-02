import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;

    // Validate required fields
    if (!name || !email || !company || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email notification to your team
    const teamEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    await resend.emails.send({
      from: teamEmail,
      to: [email], // Send confirmation to user
      replyTo: email,
      subject: 'Enterprise Inquiry Received - Arxiv-4U',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for your Enterprise inquiry!</h2>
          <p>Hi ${name},</p>
          <p>We received your message and will get back to you within 24 hours.</p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Inquiry Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <p>In the meantime, feel free to explore our platform and check out the Pro plan features.</p>

          <p>Best regards,<br/>
          The Zentrex & Arxiv-4U Team</p>
        </div>
      `,
    });

    // Also send notification to your team (optional - you can configure this separately)
    // await resend.emails.send({
    //   from: teamEmail,
    //   to: ['your-team-email@zentrex.com'],
    //   subject: `New Enterprise Inquiry from ${company}`,
    //   html: `... team notification template ...`,
    // });

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
    });
  } catch (error) {
    console.error('Error processing enterprise contact:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
