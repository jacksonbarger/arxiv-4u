import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { markAsRead, deleteNotification } from '@/lib/notifications';

// PUT /api/notifications/[id] - Mark notification as read
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const notificationId = params.id;

    const success = await markAsRead(notificationId, session.user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Notification not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id] - Delete notification
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const notificationId = params.id;

    const success = await deleteNotification(notificationId, session.user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Notification not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
