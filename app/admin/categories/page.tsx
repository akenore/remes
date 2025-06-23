'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { pb } from '@/lib/pocketbase';

interface Category {
  id: string;
  title: string;
  slug: string;
  created: string;
  updated: string;
}

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const categoriesPerPage = 10;
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
  });
  const [isSlugEditable, setIsSlugEditable] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [searchTerm, currentPage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      let filter = '';
      if (searchTerm) {
        filter = `title ~ "${searchTerm}" || slug ~ "${searchTerm}"`;
      }

      const result = await pb.collection('categories').getList(currentPage, categoriesPerPage, {
        filter,
        sort: '-created',
      });
      setCategories(result.items.map((item) => ({
        id: item.id,
        title: item.title as string,
        slug: item.slug as string,
        created: item.created as string,
        updated: item.updated as string,
      })));
      setTotalPages(result.totalPages);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const generateUniqueSlug = async (baseSlug: string, excludeId?: string) => {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      try {
        // Check if slug exists in the database
        const filter = excludeId 
          ? `slug = "${slug}" && id != "${excludeId}"`
          : `slug = "${slug}"`;
        
        const existingCategories = await pb.collection('categories').getList(1, 1, {
          filter: filter,
        });

        if (existingCategories.totalItems === 0) {
          return slug; // Slug is unique
        }

        // If slug exists, try with a counter
        slug = `${baseSlug}-${counter}`;
        counter++;
      } catch (err) {
        console.error('Error checking slug uniqueness:', err);
        return baseSlug; // Return original if error
      }
    }
  };

  const handleTitleChange = async (title: string) => {
    setFormData(prev => ({ ...prev, title }));
    
    // Only auto-update slug if it's not being manually edited
    if (!isSlugEditable) {
      const baseSlug = generateSlug(title);
      const uniqueSlug = await generateUniqueSlug(baseSlug, editingCategory?.id);
      setFormData(prev => ({ ...prev, slug: uniqueSlug }));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', slug: '' });
    setEditingCategory(null);
    setShowAddForm(false);
    setIsSlugEditable(false);
    setError('');
  };

  const handleAddCategory = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setFormData({
      title: category.title,
      slug: category.slug,
    });
    setEditingCategory(category);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.slug.trim()) {
        throw new Error('Slug is required');
      }

      const data = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
      };

      if (editingCategory) {
        await pb.collection('categories').update(editingCategory.id, data);
      } else {
        await pb.collection('categories').create(data);
      }

      await fetchCategories();
      resetForm();
    } catch (err: any) {
      setError(err.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await pb.collection('categories').delete(categoryId);
      await fetchCategories();
    } catch (err) {
      setError('Failed to delete category');
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

  const filteredCategories = categories;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize your content with categories
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddCategory}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {showAddForm ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="category-title" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="category-title"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter category name..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permalink
                    </label>
                    <div className="mt-1">
                      {!isSlugEditable ? (
                        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 font-mono">http://127.0.0.1:3000/categories/</span>
                            <span className="font-semibold text-indigo-600">{formData.slug || 'category-slug'}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsSlugEditable(true)}
                            className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center p-3 bg-white border border-gray-300 rounded-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                            <span className="text-gray-500 font-mono text-sm">http://127.0.0.1:3000/categories/</span>
                            <input
                              type="text"
                              className="flex-1 border-0 p-0 text-sm font-semibold text-indigo-600 placeholder-gray-400 focus:ring-0 focus:outline-none bg-transparent"
                              value={formData.slug}
                              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                              placeholder="category-slug"
                              required
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => setIsSlugEditable(false)}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const baseSlug = generateSlug(formData.title);
                                generateUniqueSlug(baseSlug, editingCategory?.id).then(uniqueSlug => {
                                  setFormData(prev => ({ ...prev, slug: uniqueSlug }));
                                });
                                setIsSlugEditable(false);
                              }}
                              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      The permalink is the permanent URL for this category.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      {editingCategory ? 'Update Category' : 'Add Category'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    Click "Add New Category" to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-6">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-500">Loading categories...</p>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {searchTerm ? 'No categories found' : 'No categories'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating a new category.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {filteredCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{category.title}</h4>
                          <p className="text-sm text-gray-500">/{category.slug}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Created {formatDate(category.created)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id, category.title)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing page <span className="font-medium">{currentPage}</span> of{' '}
                            <span className="font-medium">{totalPages}</span>
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                            >
                              <span className="sr-only">Previous</span>
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                                  page === currentPage
                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                            >
                              <span className="sr-only">Next</span>
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 