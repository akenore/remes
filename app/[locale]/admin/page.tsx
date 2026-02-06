'use client';

import { useAuth } from '@/lib/auth-context';
import { pb } from '@/lib/pocketbase';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function AdminPage() {
  const { user } = useAuth();
  const t = useTranslations('admin.dashboard');
  const tCommon = useTranslations('common');
  const [showWelcome, setShowWelcome] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    loading: true,
  });

  // Check if welcome message should be shown (only once per login session)
  useEffect(() => {
    if (user) {
      const welcomeShown = sessionStorage.getItem('welcome_shown');
      if (!welcomeShown) {
        queueMicrotask(() => {
          setShowWelcome(true);
          sessionStorage.setItem('welcome_shown', 'true');
        });
      }
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch posts data, excluding rich text image posts
      const realPostsFilter = 'title !~ "[RICH_TEXT_IMG]"';
      const [allPosts, publishedPosts, draftPosts, categories] = await Promise.all([
        pb.collection('posts').getList(1, 1, { filter: realPostsFilter, requestKey: null }),
        pb.collection('posts').getList(1, 1, { filter: `published = true && ${realPostsFilter}`, requestKey: null }),
        pb.collection('posts').getList(1, 1, { filter: `published = false && ${realPostsFilter}`, requestKey: null }),
        pb.collection('categories').getList(1, 1, { requestKey: null })
      ]);

      setStats({
        totalPosts: allPosts.totalItems,
        publishedPosts: publishedPosts.totalItems,
        draftPosts: draftPosts.totalItems,
        totalCategories: categories.totalItems,
        loading: false,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  // Fetch dashboard statistics
  useEffect(() => {
    queueMicrotask(() => fetchStats());
  }, []);

  // Auto-hide welcome message after 5 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        sessionStorage.setItem('welcome_shown', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem('welcome_shown', 'true');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      {showWelcome && (
        <div className="relative bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="shrink-0">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-white">
                    {t('welcome', { name: user?.name || user?.email?.split('@')[0] || 'User' })}
                  </h2>
                  <p className="text-indigo-100 mt-1">
                    {t('welcomeDescription')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseWelcome}
                className="text-indigo-100 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t('description')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {t('stats.totalPosts')}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.loading ? tCommon('loading') : stats.totalPosts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {t('stats.categories')}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.loading ? tCommon('loading') : stats.totalCategories}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {t('stats.publishedPosts')}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.loading ? tCommon('loading') : stats.publishedPosts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {t('stats.draftPosts')}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.loading ? tCommon('loading') : stats.draftPosts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('quickActions.title')}
          </h3>
          <div className="mt-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/admin/posts/add"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('quickActions.createPost')}
              </Link>
              <Link
                href="/admin/categories"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {t('quickActions.manageCategories')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('accountInfo.title')}
          </h3>
          <div className="mt-5">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('accountInfo.email')}</dt>
                <dd className="mt-1 text-sm text-gray-900 break-all">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('accountInfo.userId')}</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{user?.id}</dd>
              </div>
              {user?.name && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('accountInfo.name')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">{t('accountInfo.accountType')}</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {t('accountInfo.admin')}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
