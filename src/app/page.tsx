'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function MaintenancePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Arxiv-4U"
            width={200}
            height={60}
            className="h-16 w-auto"
            priority
          />
        </div>

        {/* Main message */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
            We&apos;re Building Something Amazing
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Arxiv-4U is undergoing a major update to bring you an even better experience for discovering and analyzing AI research papers.
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            We&apos;ll be back after Christmas with exciting new features!
          </p>
        </div>

        {/* Thank you message */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
          <p className="text-slate-700 dark:text-slate-200 font-medium mb-4">
            Thank you so much for your interest in Arxiv-4U! 🙏
          </p>

          {/* Email signup */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Get notified when we&apos;re back:
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#9EDCE1] focus:border-transparent"
                disabled={status === 'loading' || status === 'success'}
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="px-4 py-2 bg-[#9EDCE1] text-white font-medium rounded-lg hover:bg-[#7fcfd6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? '...' : 'Notify Me'}
              </button>
            </div>
            {status === 'success' && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Thanks! We&apos;ll let you know when we&apos;re back.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Arxiv-4U. See you soon!
        </p>
      </div>
    </div>
  );
}
