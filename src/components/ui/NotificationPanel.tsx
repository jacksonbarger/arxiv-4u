'use client';

import { useState, useEffect } from 'react';
import { Notification } from '@/types/notification';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const clearAll = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
      });
      if (response.ok) {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="absolute right-0 mt-2 w-96 max-h-[600px] rounded-2xl shadow-xl z-40 overflow-hidden flex flex-col"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <h3 className="font-semibold" style={{ color: '#4A5568' }}>
            Notifications
          </h3>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="text-xs px-2 py-1 rounded transition-colors"
                style={{ color: '#9EDCE1' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F3EF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className="text-xs px-2 py-1 rounded transition-colors"
                style={{ color: '#EF4444' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1">
          {isLoading ? (
            <div className="p-8 text-center" style={{ color: '#718096' }}>
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: '#C0E5E8' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p style={{ color: '#718096' }}>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-3 border-b transition-colors cursor-pointer relative"
                style={{
                  borderColor: '#E2E8F0',
                  backgroundColor: notification.read ? 'transparent' : '#F5F3EF',
                }}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: '#4A5568' }}
                    >
                      {notification.paperTitle}
                    </p>
                    <p
                      className="text-xs mb-2"
                      style={{ color: '#718096' }}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="p-1 rounded transition-colors"
                    style={{ color: '#9CA3AF' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#EF4444';
                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9CA3AF';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {!notification.read && (
                  <div
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#9EDCE1' }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
