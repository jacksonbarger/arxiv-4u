'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    // Call verification API
    fetch(`/api/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          // Redirect to login after 3 seconds
          setTimeout(() => router.push('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
        setMessage('An error occurred during verification');
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F3EF' }}>
      <div className="max-w-md w-full mx-4">
        <div className="rounded-3xl p-8 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {status === 'loading' && (
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#9EDCE1' }}>
                <svg
                  className="w-8 h-8 animate-spin"
                  style={{ color: '#FFFFFF' }}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#9EDCE1' }}>
                <svg
                  className="w-8 h-8"
                  style={{ color: '#FFFFFF' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EF4444' }}>
                <svg
                  className="w-8 h-8"
                  style={{ color: '#FFFFFF' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-4" style={{ color: '#4A5568' }}>
            {status === 'loading' && 'Verifying Your Email'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>

          {/* Message */}
          <p className="text-center mb-6" style={{ color: '#718096' }}>
            {status === 'loading' && 'Please wait while we verify your email address...'}
            {status === 'success' && (
              <>
                {message}
                <br />
                <span className="text-sm">Redirecting to login...</span>
              </>
            )}
            {status === 'error' && message}
          </p>

          {/* Action button */}
          {status !== 'loading' && (
            <div className="text-center">
              {status === 'success' ? (
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 rounded-full font-medium transition-colors"
                  style={{ backgroundColor: '#9EDCE1', color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7DC5CA'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9EDCE1'}
                >
                  Go to Login
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="inline-block px-6 py-3 rounded-full font-medium transition-colors"
                  style={{ backgroundColor: '#9EDCE1', color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7DC5CA'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9EDCE1'}
                >
                  Back to Sign Up
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="text-center" style={{ color: '#718096' }}>Loading...</div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
