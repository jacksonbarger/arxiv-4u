'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid username or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
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
            Welcome Back
          </h1>
          <p style={{ color: '#718096' }}>
            Sign in to your Arxiv-4U account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              htmlFor="username"
              className="block text-sm font-medium mb-2"
              style={{ color: '#4A5568' }}
            >
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p style={{ color: '#718096' }}>
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-medium transition-colors"
              style={{ color: '#9EDCE1' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#7DC5CA'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9EDCE1'}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
