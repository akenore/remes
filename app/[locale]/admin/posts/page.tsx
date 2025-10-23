'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { pb } from '@/lib/pocketbase';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useToast } from '@/lib/toast-context';
import ConfirmDialog from '@/components/ui/admin/ConfirmDialog';

interface Post {
  id: string;
  title: string;
  title_fr: string;
  slug: string;
  slug_fr?: string;
  content: string;
  content_fr: string;
  author: string;
  published: boolean;
  categories: string[];
  cover_image: string | null;
  created: string;
  updated: string;
  collectionId?: string;
  collectionName?: string;
  expand?: {
    author?: {
      name?: string;
      email: string;
    };
    categories?: Array<{
      id: string;
      title: string;
      title_fr?: string;
    }>;
  };
}

const getCoverImageUrl = (post: Post) => {
  if (!post.cover_image || typeof post.cover_image !== 'string') {
    return '';
  }
  const collectionSegment = post.collectionId || post.collectionName || 'posts';
  return `${pb.baseURL}/api/files/${collectionSegment}/${post.id}/${post.cover_image}`;
};

export default function PostsPage() {
  const locale = useLocale();
  const t = useTranslations('admin.posts');
  const tCommon = useTranslations('admin.common');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Function to get localized post title with fallback
  const getLocalizedTitle = (post: Post) => {
    const isFrench = locale === 'fr';
    if (isFrench && post.title_fr && post.title_fr.trim() !== '') {
      return post.title_fr;
    }
    return post.title || 'No title available';
  };

  // Function to get localized category title with fallback
  const getLocalizedCategoryTitle = (category: { title: string; title_fr?: string }) => {
    const isFrench = locale === 'fr';
    if (isFrench && category.title_fr && category.title_fr.trim() !== '') {
      return category.title_fr;
    }
    return category.title || 'No category title';
  };

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      let filter = '';
      const filters = [];
      
      // Always exclude rich text images from the main posts list
      filters.push('title !~ "[RICH_TEXT_IMG]"');
      
      if (searchTerm) {
        filters.push(`title ~ "${searchTerm}" || content ~ "${searchTerm}"`);
      }
      
      if (statusFilter === 'published') {
        filters.push('published = true');
      } else if (statusFilter === 'draft') {
        filters.push('published = false');
      }
      
      filter = filters.join(' && ');

      const result = await pb.collection('posts').getList(currentPage, postsPerPage, {
        filter,
        sort: '-created',
        expand: 'author,categories',
        // Add requestKey to prevent caching issues
        requestKey: null,
      });

      // Manually fetch author info for posts where expansion failed
      const postsWithAuthors = await Promise.all(
        result.items.map(async (post: unknown) => {
          // Type guard to ensure post is an object
          if (!post || typeof post !== 'object') {
            return post;
          }
          
          const postObj = post as Record<string, unknown>;
          
          // If expansion worked, keep as is
          if (postObj.expand && typeof postObj.expand === 'object' && 'author' in postObj.expand) {
            return post;
          }
          
          // If no expansion but we have an author ID, try to fetch manually
          if (postObj.author && typeof postObj.author === 'string') {
            console.log(`Fetching author for post ${postObj.id}, author ID: ${postObj.author}`);
            try {
              // Try regular users first
              const user = await pb.collection('users').getOne(postObj.author as string);
              console.log(`Found user:`, user);
              postObj.expand = { 
                ...(postObj.expand as Record<string, unknown>), 
                author: { 
                  name: user.name || user.username || user.email?.split('@')[0], 
                  email: user.email 
                } 
              };
            } catch (userError: unknown) {
              const errorMessage = userError && typeof userError === 'object' && 'message' in userError && typeof userError.message === 'string'
                ? userError.message
                : 'Unknown error';
              console.log(`User not found in users collection:`, errorMessage);
              // If not found in users, try admin users
              try {
                const admin = await pb.admins.getOne(postObj.author as string);
                console.log(`Found admin:`, admin);
                postObj.expand = { 
                  ...(postObj.expand as Record<string, unknown>), 
                  author: { 
                    name: admin.name || admin.email?.split('@')[0], 
                    email: admin.email 
                  } 
                };
                              } catch (adminError: unknown) {
                  const errorMessage = adminError && typeof adminError === 'object' && 'message' in adminError && typeof adminError.message === 'string'
                    ? adminError.message
                    : 'Unknown error';
                  console.log(`Admin not found:`, errorMessage);
                // If still not found, leave as is (will show fallback)
              }
            }
          }
          
          return post;
        })
      );

      const normalizedPosts = (postsWithAuthors as Array<Record<string, any>>).map((item) => ({
        id: item.id as string,
        title: item.title || '',
        title_fr: item.title_fr || '',
        slug: item.slug || '',
        slug_fr: item.slug_fr || '',
        content: item.content || '',
        content_fr: item.content_fr || '',
        author: item.author as string,
        published: Boolean(item.published),
        categories: Array.isArray(item.expand?.categories) ? item.expand?.categories : [],
        cover_image: item.cover_image || null,
        created: item.created as string,
        updated: item.updated as string,
        expand: item.expand,
        collectionId: item.collectionId as string | undefined,
        collectionName: item.collectionName as string | undefined,
      }));

      setPosts(normalizedPosts as Post[]);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(t('errors.fetchFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, postsPerPage, t]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await pb.collection('posts').delete(deleteId);
      fetchPosts();
      showToast('Deleted!', 'warning');
    } catch (err) {
      setError(t('errors.deleteFailed'));
      console.error(err);
      showToast('Failed to delete post', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const handleTogglePublished = async (postId: string, currentStatus: boolean) => {
    try {
      await pb.collection('posts').update(postId, {
        published: !currentStatus,
      });
      fetchPosts(); // Refresh the list
    } catch (err) {
      setError(t('errors.updateStatusFailed'));
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isTranslated = (post: Post) => {
    return post.title_fr && post.title_fr.trim() !== '' && 
           post.content_fr && post.content_fr.trim() !== '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('description')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/posts/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('addNew')}
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              {t('searchLabel')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">{t('filters.all')}</option>
              <option value="published">{t('filters.published')}</option>
              <option value="draft">{t('filters.drafts')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-500">{t('table.loadingPosts')}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2">{t('table.noResults')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.title')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.author')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.categories')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.status')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tCommon('translation')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.date')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {(() => {
                            const coverImageUrl = getCoverImageUrl(post);
                            if (!coverImageUrl) {
                              return null;
                            }
                            return (
                              <div className="flex-shrink-0 h-10 w-10 relative">
                                <Image
                                  src={coverImageUrl}
                                  alt={getLocalizedTitle(post)}
                                  fill
                                  sizes="40px"
                                  unoptimized
                                  className="rounded-lg object-cover"
                                />
                              </div>
                            );
                          })()}
                          <div className={post.cover_image ? 'ml-4' : ''}>
                            <div className="text-sm font-medium text-gray-900">
                              {getLocalizedTitle(post)}
                            </div>
                            <div className="text-sm text-gray-500">
                              /{post.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(() => {
                          // Handle expanded author data (from users collection)
                          if (post.expand?.author?.name && post.expand.author.name.trim() !== '') {
                            return post.expand.author.name;
                          }
                          if (post.expand?.author?.email) {
                            return post.expand.author.email.split('@')[0]; // Show username part of email
                          }
                          // Handle author ID directly (fallback) - this should rarely trigger now
                          if (post.author && post.author.trim() !== '') {
                            console.log(`Showing fallback for author ID: ${post.author}, expand data:`, post.expand?.author);
                            return `User ${post.author.slice(-6)}`; // Show last 6 chars of ID
                          }
                          // Unknown author
                          return t('table.unknownAuthor') || 'Unknown Author';
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {post.expand?.categories?.map((category) => (
                            <span
                              key={category.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {getLocalizedCategoryTitle(category)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublished(post.id, post.published)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            post.published
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                          title={t('status.togglePublish')}
                        >
                          {post.published ? t('status.published') : t('status.draft')}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇬🇧</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isTranslated(post)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                                                         🇫🇷 {isTranslated(post) ? tCommon('translated') : tCommon('missing')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(post.created)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/posts/edit/${post.id}`}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          >
                            {t('actions.edit')}
                          </Link>
                          <button
                            onClick={() => setDeleteId(post.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            {t('actions.delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    {t('pagination.previous')}
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    {t('pagination.next')}
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      {t('pagination.page', { current: currentPage, total: totalPages })}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <span className="sr-only">{t('pagination.previous')}</span>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <span className="sr-only">{t('pagination.next')}</span>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}

            <ConfirmDialog
              open={Boolean(deleteId)}
              title={t('deleteConfirm')}
              message=""
              confirmText={t('actions.delete')}
              cancelText={t('pagination.previous')}
              onConfirm={confirmDelete}
              onCancel={() => setDeleteId(null)}
            />
          </>
        )}
      </div>
    </div>
  );
} 
