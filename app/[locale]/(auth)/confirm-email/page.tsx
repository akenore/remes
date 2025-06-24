'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { pb } from '@/lib/pocketbase';

export default function ConfirmEmailPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  const t = useTranslations('auth.confirmEmail');

  useEffect(() => {
    // Get token from URL parameters
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid confirmation link. Token is missing.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!token) {
      setError('Invalid confirmation link. Token is missing.');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Password is required to confirm email change.');
      setIsLoading(false);
      return;
    }

    try {
      // Confirm email change using PocketBase API
      await pb.collection('users').confirmEmailChange(token, password);
      
      setSuccess('Email address updated successfully! You will be logged out for security reasons.');
      
      // Wait 3 seconds then logout for security (as all tokens are invalidated)
      setTimeout(() => {
        logout();
        router.push('/login?message=email-changed');
      }, 3000);
      
    } catch (err: any) {
      console.error('Email confirmation error:', err);
      
      if (err?.data && typeof err.data === 'object') {
        const fieldErrors: string[] = [];
        
        Object.keys(err.data).forEach(field => {
          const fieldError = err.data[field];
          if (fieldError && fieldError.message) {
            fieldErrors.push(`${field}: ${fieldError.message}`);
          } else if (fieldError && typeof fieldError === 'string') {
            fieldErrors.push(`${field}: ${fieldError}`);
          }
        });
        
        if (fieldErrors.length > 0) {
          setError(fieldErrors.join('. '));
        } else {
          setError('Failed to confirm email change. Please check your password and try again.');
        }
      } else {
        setError(err?.message || 'Failed to confirm email change. Please check your password and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Confirm Email Change
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your current password to confirm your new email address.
          </p>
        </div>
        
        {success ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {success}
                </p>
                <p className="mt-1 text-sm text-green-700">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your current password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                This is required to verify your identity and confirm the email change.
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || !token}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirming...
                  </>
                ) : (
                  'Confirm Email Change'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 