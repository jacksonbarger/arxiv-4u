'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { NotificationSettings } from './NotificationSettings';
import { useTheme } from '@/contexts/ThemeContext';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { themeDefinition } = useTheme();
  const colors = themeDefinition.colors;

  if (status === 'loading') {
    return null;
  }

  if (!session) {
    return (
      <Link href="/login">
        <button
          className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Sign In
        </button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full transition-colors"
        style={{ backgroundColor: isOpen ? colors.backgroundSecondary : 'transparent' }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <svg
          className="w-5 h-5"
          style={{ color: colors.foregroundMuted }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute right-0 mt-2 w-48 rounded-2xl shadow-lg z-20 overflow-hidden"
            style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: colors.border }}
            >
              <p className="text-sm font-medium" style={{ color: colors.foreground }}>
                {session.user?.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: colors.foregroundMuted }}>
                {session.user?.email}
              </p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSettingsOpen(true);
              }}
              className="w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-2"
              style={{ color: colors.foreground }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.backgroundSecondary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Notification Settings
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full px-4 py-3 text-left text-sm transition-colors"
              style={{ color: colors.destructive }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = `${colors.destructive}15`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              Sign Out
            </button>
          </div>
        </>
      )}

      <NotificationSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
