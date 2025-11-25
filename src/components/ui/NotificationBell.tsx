'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface NotificationBellProps {
  onOpenPanel: () => void;
  isOpen: boolean;
}

export function NotificationBell({ onOpenPanel, isOpen }: NotificationBellProps) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session?.user) return;

    // Fetch unread count
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnreadCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [session]);

  // Don't show bell if not logged in
  if (!session?.user) {
    return null;
  }

  return (
    <button
      onClick={onOpenPanel}
      className="relative p-2 rounded-full transition-colors"
      style={{ backgroundColor: isOpen ? '#EFECE6' : 'transparent' }}
      onMouseEnter={(e) => {
        if (!isOpen) e.currentTarget.style.backgroundColor = '#EFECE6';
      }}
      onMouseLeave={(e) => {
        if (!isOpen) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <svg
        className="w-5 h-5"
        style={{ color: '#718096' }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-xs font-bold rounded-full px-1"
          style={{ backgroundColor: '#9EDCE1', color: '#FFFFFF' }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
