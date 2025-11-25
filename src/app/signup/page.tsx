'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Create account
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        setIsLoading(false);
        return;
      }

      // Show success message instead of auto-login
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Show success state
  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ backgroundColor: '#F5F3EF' }}
      >
        <div
          className="w-full max-w-md p-8 rounded-3xl shadow-lg text-center"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#9EDCE1' }}>
            <svg
              className="w-8 h-8"
              style={{ color: '#FFFFFF' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#4A5568' }}>
            Check Your Email
          </h1>
          <p className="mb-6" style={{ color: '#718096' }}>
            We&apos;ve sent a verification link to <strong>{email}</strong>. Please check your email and click the link to verify your account.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-full font-medium transition-colors"
            style={{ backgroundColor: '#9EDCE1', color: '#FFFFFF' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7DC5CA'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9EDCE1'}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#F5F3EF' }}
    >
      <div
        className="w-full max-w-md p-8 rounded-3xl shadow-lg"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: '#4A5568' }}
          >
            Create Account
          </h1>
          <p style={{ color: '#718096' }}>
            Join Arxiv-4U to save and organize papers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className="p-4 rounded-xl text-sm"
              style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: '#4A5568' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: '#E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#4A5568'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#9EDCE1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
              style={{ color: '#4A5568' }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              pattern="[a-zA-Z0-9_]{3,20}"
              title="3-20 characters (letters, numbers, underscores)"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: '#E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#4A5568'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#9EDCE1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
            />
            <p className="mt-1 text-xs" style={{ color: '#718096' }}>
              3-20 characters (letters, numbers, underscores)
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: '#4A5568' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: '#E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#4A5568'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#9EDCE1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
            />
            <p className="mt-1 text-xs" style={{ color: '#718096' }}>
              At least 6 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
              style={{ color: '#4A5568' }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: '#E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#4A5568'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#9EDCE1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: isLoading ? '#DEEBEB' : '#9EDCE1',
              color: '#FFFFFF',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#7DC5CA';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#9EDCE1';
            }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p style={{ color: '#718096' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium transition-colors"
              style={{ color: '#9EDCE1' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#7DC5CA'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9EDCE1'}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
