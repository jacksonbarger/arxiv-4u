import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { kv } from '@vercel/kv';
import { User } from '@/lib/auth';

// GET /api/user/preferences - Get current user's notification preferences
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from KV
    const user = await kv.get<User>(`user:email:${session.user.email}`);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      emailNotifications: user.emailNotifications,
      notificationFrequency: user.notificationFrequency,
      notificationCategories: user.notificationCategories || [],
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// PUT /api/user/preferences - Update user's notification preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { emailNotifications, notificationFrequency, notificationCategories } = await request.json();

    // Validate input
    if (typeof emailNotifications !== 'boolean') {
      return NextResponse.json(
        { error: 'emailNotifications must be a boolean' },
        { status: 400 }
      );
    }

    if (notificationFrequency !== 'daily' && notificationFrequency !== 'weekly') {
      return NextResponse.json(
        { error: 'notificationFrequency must be "daily" or "weekly"' },
        { status: 400 }
      );
    }

    if (!Array.isArray(notificationCategories)) {
      return NextResponse.json(
        { error: 'notificationCategories must be an array' },
        { status: 400 }
      );
    }

    // Get user from KV
    const user = await kv.get<User>(`user:email:${session.user.email}`);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user preferences
    user.emailNotifications = emailNotifications;
    user.notificationFrequency = notificationFrequency;
    user.notificationCategories = notificationCategories;

    // Save to all KV keys
    await kv.set(`user:email:${user.email}`, user);
    await kv.set(`user:username:${user.username}`, user);
    await kv.set(`user:id:${user.id}`, user);

    return NextResponse.json({
      success: true,
      preferences: {
        emailNotifications: user.emailNotifications,
        notificationFrequency: user.notificationFrequency,
        notificationCategories: user.notificationCategories,
      },
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
