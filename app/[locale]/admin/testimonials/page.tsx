'use client';

import { useAuth } from '@/lib/auth-context';
import { pb } from '@/lib/pocketbase';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useToast } from '@/lib/toast-context';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface Testimonial {
  id: string;
  full_name: string;
  description: string;
  created: string;
  updated: string;
}

export default function TestimonialsPage() {
  const { user } = useAuth();
  const t = useTranslations('admin.testimonials');
  const tCommon = useTranslations('admin.common');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, searchTerm]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const filter = searchTerm ? `full_name ~ "${searchTerm}" || description ~ "${searchTerm}"` : '';
      
      const result = await pb.collection('testimonials').getList(currentPage, itemsPerPage, {
        filter,
        sort: '-created',
        requestKey: null
      });

      setTestimonials(result.items as unknown as Testimonial[]);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await pb.collection('testimonials').delete(deleteId);
      fetchTestimonials();
      showToast('Deleted!', 'warning');
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
      showToast('Failed to delete testimonial', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('description')}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/testimonials/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('addNew')}
          </Link>
        </div>
      </div>

      <div className="max-w-md">
        <label htmlFor="search" className="sr-only">
          {t('searchLabel')}
        </label>
        <input
          type="text"
          id="search"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('table.fullName')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('table.description')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('table.date')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  {t('table.loadingTestimonials')}
                </td>
              </tr>
            ) : testimonials.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  {t('table.noResults')}
                </td>
              </tr>
            ) : (
              testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {testimonial.full_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">
                      {testimonial.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(testimonial.created)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/testimonials/edit/${testimonial.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {t('actions.edit')}
                    </Link>
                    <button
                      onClick={() => setDeleteId(testimonial.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t('actions.delete')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tCommon('previous')}
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tCommon('next')}
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tCommon('previous')}
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tCommon('next')}
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
        cancelText={tCommon('cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
} 