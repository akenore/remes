'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { pb } from '@/lib/pocketbase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '@/components/ui/admin/RichTextEditor';

interface Category {
  id: string;
  title: string;
}

export default function AddPostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savingAs, setSavingAs] = useState<'draft' | 'published' | null>(null);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    published: false,
    categories: [] as string[],
    cover_image: null as File | null,
  });
  const [isSlugEditable, setIsSlugEditable] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await pb.collection('categories').getFullList({
        sort: 'title',
      });
      setCategories(result.map((item) => ({
        id: item.id,
        title: item.title as string,
      })));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
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

  const generateUniqueSlug = async (baseSlug: string) => {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      try {
        // Check if slug exists in the database
        const existingPosts = await pb.collection('posts').getList(1, 1, {
          filter: `slug = "${slug}"`,
        });

        if (existingPosts.totalItems === 0) {
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
    // Clear error when user starts typing
    if (error) setError('');
    
    setFormData(prev => ({ ...prev, title }));
    
    // Only auto-update slug if it's not being manually edited
    if (!isSlugEditable) {
      const baseSlug = generateSlug(title);
      const uniqueSlug = await generateUniqueSlug(baseSlug);
      setFormData(prev => ({ ...prev, slug: uniqueSlug }));
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    // Clear error when user interacts with categories
    if (error) setError('');
    
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error when user selects an image
    if (error) setError('');
    
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, cover_image: file }));
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, cover_image: null }));
  };

  const handleSave = async (publishStatus: boolean) => {
    setLoading(true);
    setSavingAs(publishStatus ? 'published' : 'draft');
    setError('');

    try {
      // Client-side validation with specific error messages
      const errors = [];
      
      if (!formData.title.trim()) {
        errors.push('Title is required');
      }
      
      if (!formData.slug.trim()) {
        errors.push('Slug is required');
      }
      
      if (!formData.content.trim()) {
        errors.push('Content is required');
      }
      
      if (!user?.id) {
        errors.push('You must be logged in to create a post');
      }
      
      // Check if categories are required (based on PocketBase schema)
      if (formData.categories.length === 0) {
        errors.push('At least one category is required');
      }
      
      // Check if cover image is required (based on PocketBase schema)
      if (!formData.cover_image) {
        errors.push('Cover image is required');
      }
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('slug', formData.slug);
      data.append('content', formData.content);
      data.append('author', user?.id || '');
      data.append('published', publishStatus.toString());
      
      // Always add cover image (now required)
      if (formData.cover_image) {
        data.append('cover_image', formData.cover_image);
      }
      
      // Add categories (now required - at least one)
      formData.categories.forEach(categoryId => {
        data.append('categories', categoryId);
      });

      await pb.collection('posts').create(data);
      
      // Clear any previous errors on success
      setError('');
      
      // Update the form state to reflect the published status
      setFormData(prev => ({ ...prev, published: publishStatus }));
      
      router.push('/admin/posts');
    } catch (err: any) {
      // Only log server errors, not client-side validation errors
      if (err.message && (err.message.includes('required') || err.message.includes(','))) {
        // This is our client-side validation error - no need to log extensively
        console.log('Validation error:', err.message);
      } else {
        // This is likely a server/network error - log details for debugging
        console.error('Server error:', err);
        console.error('Error data:', err?.data);
        console.error('Error response:', err?.response);
      }
      
      let errorMessage = '';
      
      // Handle PocketBase validation errors
      if (err?.data && typeof err.data === 'object') {
        const fieldErrors: string[] = [];
        
        // Check for field-specific validation errors
        Object.keys(err.data).forEach(field => {
          const fieldError = err.data[field];
          if (fieldError && fieldError.message) {
            fieldErrors.push(`${field}: ${fieldError.message}`);
          } else if (fieldError && typeof fieldError === 'string') {
            fieldErrors.push(`${field}: ${fieldError}`);
          } else if (fieldError && Array.isArray(fieldError)) {
            fieldErrors.push(`${field}: ${fieldError.join(', ')}`);
          }
        });
        
        if (fieldErrors.length > 0) {
          errorMessage = fieldErrors.join('. ');
        }
      }
      
      // Check for nested error structure (err.response.data.data)
      if (!errorMessage && err?.response?.data?.data && typeof err.response.data.data === 'object') {
        const fieldErrors: string[] = [];
        
        Object.keys(err.response.data.data).forEach(field => {
          const fieldError = err.response.data.data[field];
          if (fieldError && fieldError.message) {
            fieldErrors.push(`${field}: ${fieldError.message}`);
          } else if (fieldError && typeof fieldError === 'string') {
            fieldErrors.push(`${field}: ${fieldError}`);
          }
        });
        
        if (fieldErrors.length > 0) {
          errorMessage = fieldErrors.join('. ');
        }
      }
      
      // If no field errors found, use the main error message
      if (!errorMessage) {
        if (err?.message) {
          errorMessage = err.message;
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = 'Failed to create post. Please check your data and try again.';
        }
      }
      
      // Add common error explanations
      if (errorMessage.includes('slug')) {
        errorMessage += ' (Slug must be unique and contain only letters, numbers, and hyphens)';
      }
      if (errorMessage.includes('author')) {
        errorMessage += ' (Please make sure you are logged in)';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setSavingAs(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Post</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new blog post or article
          </p>
        </div>
        <Link
          href="/admin/posts"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          ← Back to Posts
        </Link>
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
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following issues:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error.includes(',') ? (
                  <ul className="list-disc list-inside space-y-1">
                    {error.split(',').map((err, index) => (
                      <li key={index}>{err.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WordPress-style Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area (Left) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Title */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <input
                type="text"
                placeholder="Add title"
                className="block w-full text-2xl font-bold border-0 p-0 placeholder-gray-400 focus:ring-0 focus:outline-none resize-none"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Permalink */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permalink
              </label>
              <div className="mt-1">
                {!isSlugEditable ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 font-mono">http://127.0.0.1:3000/posts/</span>
                      <span className="font-semibold text-indigo-600">{formData.slug || 'post-slug'}</span>
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
                      <span className="text-gray-500 font-mono text-sm">http://127.0.0.1:3000/posts/</span>
                      <input
                        type="text"
                        className="flex-1 border-0 p-0 text-sm font-semibold text-indigo-600 placeholder-gray-400 focus:ring-0 focus:outline-none bg-transparent"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="post-slug"
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
                          generateUniqueSlug(baseSlug).then(uniqueSlug => {
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
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <RichTextEditor
                value={formData.content}
                onChange={(value) => {
                  // Clear error when user starts typing
                  if (error) setError('');
                  setFormData(prev => ({ ...prev, content: value }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Publish Box */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publish</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-gray-900">
                    {savingAs === 'published' || (savingAs === null && formData.published) ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Visibility:</span>
                  <span className="font-medium text-gray-900">Public</span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex flex-col space-y-3">
                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    disabled={loading}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                  >
                    {loading && savingAs === 'draft' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving as Draft...
                      </>
                    ) : (
                      'Save as Draft'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    disabled={loading}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-colors"
                  >
                    {loading && savingAs === 'published' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </>
                    ) : (
                      'Publish'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Categories <span className="text-red-500">*</span>
              </h3>
              
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <label
                      key={category.id}
                      className="relative flex items-start cursor-pointer"
                    >
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={formData.categories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <span className="font-medium text-gray-700">{category.title}</span>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-red-600">
                    No categories available. At least one category is required.{' '}
                    <Link href="/admin/categories" className="text-indigo-600 hover:text-indigo-500 underline">
                      Create categories first
                    </Link>
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/admin/categories"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  + Add New Category
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Featured Image <span className="text-red-500">*</span>
              </h3>
              
              {!formData.cover_image ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-4">
                    <label htmlFor="cover_image" className="cursor-pointer">
                      <span className="block text-sm font-medium text-gray-900">
                        Click to upload
                      </span>
                      <span className="block text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </span>
                      <input
                        id="cover_image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(formData.cover_image)}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="mt-3">
                    <label htmlFor="cover_image_change" className="cursor-pointer">
                      <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Change Image
                      </span>
                      <input
                        id="cover_image_change"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 