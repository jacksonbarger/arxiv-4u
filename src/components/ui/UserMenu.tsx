'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === 'loading') {
    return null;
  }

  if (!session) {
    return (
      <Link href="/login">
        <button
          className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={{ backgroundColor: '#9EDCE1', color: '#FFFFFF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7DC5CA'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9EDCE1'}
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
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: '#E2E8F0' }}>
              <p className="text-sm font-medium" style={{ color: '#4A5568' }}>
                {session.user?.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#718096' }}>
                {session.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full px-4 py-3 text-left text-sm transition-colors"
              style={{ color: '#EF4444' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
