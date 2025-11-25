import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getUserNotifications,
  getUnreadCount,
  markAllAsRead,
  clearAllNotifications,
} from '@/lib/notifications';

// GET /api/notifications - Get all notifications for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await getUserNotifications(session.user.id);
    const unreadCount = await getUnreadCount(session.user.id);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Mark all as read
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await markAllAsRead(session.user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to mark notifications as read' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - Clear all notifications
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await clearAllNotifications(session.user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to clear notifications' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json(
      { error: 'Failed to clear notifications' },
      { status: 500 }
    );
  }
}
