import { kv } from '@vercel/kv';
import { Notification } from '@/types/notification';

/**
 * KV Storage Structure for Notifications:
 * - `notification:{notificationId}` → Notification object
 * - `user:notifications:{userId}` → Set of notification IDs
 * - `user:unread:{userId}` → Number (unread count)
 */

// Create a new notification
export async function createNotification(
  userId: string,
  paperId: string,
  paperTitle: string,
  type: 'new_paper' | 'matching_paper',
  message: string
): Promise<Notification> {
  const notification: Notification = {
    id: crypto.randomUUID(),
    userId,
    paperId,
    paperTitle,
    type,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };

  // Store notification
  await kv.set(`notification:${notification.id}`, notification);

  // Add to user's notification set
  await kv.sadd(`user:notifications:${userId}`, notification.id);

  // Increment unread count
  await kv.incr(`user:unread:${userId}`);

  return notification;
}

// Get all notifications for a user
export async function getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
  try {
    // Get all notification IDs for user
    const notificationIds = await kv.smembers(`user:notifications:${userId}`);

    if (!notificationIds || notificationIds.length === 0) {
      return [];
    }

    // Fetch all notifications
    const notifications = await Promise.all(
      notificationIds.map((id) => kv.get<Notification>(`notification:${id}`))
    );

    // Filter out nulls and sort by createdAt (newest first)
    const validNotifications = notifications
      .filter((n): n is Notification => n !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return validNotifications;
  } catch (error) {
    console.error('Error getting user notifications:', error);
    return [];
  }
}

// Get unread count for a user
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const count = await kv.get<number>(`user:unread:${userId}`);
    return count || 0;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

// Mark notification as read
export async function markAsRead(notificationId: string, userId: string): Promise<boolean> {
  try {
    const notification = await kv.get<Notification>(`notification:${notificationId}`);

    if (!notification || notification.userId !== userId) {
      return false;
    }

    if (!notification.read) {
      // Update notification
      notification.read = true;
      await kv.set(`notification:${notificationId}`, notification);

      // Decrement unread count
      const currentCount = await getUnreadCount(userId);
      if (currentCount > 0) {
        await kv.set(`user:unread:${userId}`, currentCount - 1);
      }
    }

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

// Mark all notifications as read for a user
export async function markAllAsRead(userId: string): Promise<boolean> {
  try {
    const notifications = await getUserNotifications(userId);

    await Promise.all(
      notifications
        .filter((n) => !n.read)
        .map((n) => markAsRead(n.id, userId))
    );

    return true;
  } catch (error) {
    console.error('Error marking all as read:', error);
    return false;
  }
}

// Delete a notification
export async function deleteNotification(notificationId: string, userId: string): Promise<boolean> {
  try {
    const notification = await kv.get<Notification>(`notification:${notificationId}`);

    if (!notification || notification.userId !== userId) {
      return false;
    }

    // If unread, decrement count
    if (!notification.read) {
      const currentCount = await getUnreadCount(userId);
      if (currentCount > 0) {
        await kv.set(`user:unread:${userId}`, currentCount - 1);
      }
    }

    // Remove from user's notification set
    await kv.srem(`user:notifications:${userId}`, notificationId);

    // Delete notification
    await kv.del(`notification:${notificationId}`);

    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
}

// Clear all notifications for a user
export async function clearAllNotifications(userId: string): Promise<boolean> {
  try {
    const notificationIds = await kv.smembers(`user:notifications:${userId}`);

    if (!notificationIds || notificationIds.length === 0) {
      return true;
    }

    // Delete all notifications
    await Promise.all(
      notificationIds.map((id) => kv.del(`notification:${id}`))
    );

    // Delete user's notification set and unread count
    await kv.del(`user:notifications:${userId}`);
    await kv.del(`user:unread:${userId}`);

    return true;
  } catch (error) {
    console.error('Error clearing all notifications:', error);
    return false;
  }
}
