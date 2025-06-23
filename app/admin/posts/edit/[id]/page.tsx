'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { pb } from '@/lib/pocketbase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  title: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  published: boolean;
  categories: string[];
  cover_image: string;
  created: string;
  updated: string;
}

export default function EditPostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [originalPost, setOriginalPost] = useState<Post | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    published: false,
    categories: [] as string[],
    cover_image: null as File | null,
    current_cover_image: '',
  });
  const [isSlugEditable, setIsSlugEditable] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchCategories();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const post = await pb.collection('posts').getOne(postId, {
        expand: 'categories',
      });
      
      const typedPost: Post = {
        id: post.id,
        title: post.title as string,
        slug: post.slug as string,
        content: post.content as string,
        author: post.author as string,
        published: post.published as boolean,
        categories: post.categories as string[] || [],
        cover_image: post.cover_image as string,
        created: post.created as string,
        updated: post.updated as string,
      };
      
      setOriginalPost(typedPost);
      setFormData({
        title: typedPost.title,
        slug: typedPost.slug,
        content: typedPost.content,
        published: typedPost.published,
        categories: typedPost.categories,
        cover_image: null,
        current_cover_image: typedPost.cover_image,
      });
    } catch (err) {
      setError('Failed to load post');
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

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

  const generateUniqueSlug = async (baseSlug: string, excludeId?: string) => {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      try {
        // Check if slug exists in the database
        const filter = excludeId 
          ? `slug = "${slug}" && id != "${excludeId}"`
          : `slug = "${slug}"`;
        
        const existingPosts = await pb.collection('posts').getList(1, 1, {
          filter: filter,
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
    setFormData(prev => ({ ...prev, title }));
    
    // Only auto-update slug if it's not being manually edited
    if (!isSlugEditable) {
      const baseSlug = generateSlug(title);
      const uniqueSlug = await generateUniqueSlug(baseSlug, postId);
      setFormData(prev => ({ ...prev, slug: uniqueSlug }));
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, cover_image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }
      if (formData.categories.length === 0) {
        throw new Error('At least one category is required');
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('slug', formData.slug);
      data.append('content', formData.content);
      data.append('published', formData.published.toString());
      
      // Add categories as separate form fields
      formData.categories.forEach(categoryId => {
        data.append('categories', categoryId);
      });

      // Only add cover image if a new one was selected
      if (formData.cover_image) {
        data.append('cover_image', formData.cover_image);
      }

      await pb.collection('posts').update(postId, data);
      
      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!originalPost) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Post Not Found</h1>
          <p className="mt-2 text-gray-600">The post you're looking for doesn't exist.</p>
          <Link
            href="/admin/posts"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Post</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update your blog post or article
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
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title..."
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
                            generateUniqueSlug(baseSlug, postId).then(uniqueSlug => {
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
                  The permalink is the permanent URL for this post.
                </p>
              </div>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content *
              </label>
              <textarea
                id="content"
                rows={12}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your post content here..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                You can use HTML tags for formatting.
              </p>
            </div>

            {/* Cover Image */}
            <div>
              <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">
                Cover Image
              </label>
              
              {/* Current Image */}
              {formData.current_cover_image && !formData.cover_image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Current image:</p>
                  <img
                    src={`${process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'}/api/files/posts/${postId}/${formData.current_cover_image}`}
                    alt="Current cover"
                    className="h-32 w-48 object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}

              <div className="mt-2">
                <input
                  type="file"
                  id="cover_image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to keep current image, or select a new image to replace it
                </p>
              </div>
              
              {/* New Image Preview */}
              {formData.cover_image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">New image preview:</p>
                  <img
                    src={URL.createObjectURL(formData.cover_image)}
                    alt="New cover preview"
                    className="h-32 w-48 object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categories * (Select at least one)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.map((category) => (
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
                ))}
              </div>
              {categories.length === 0 && (
                <p className="text-sm text-gray-500">
                  No categories available.{' '}
                  <Link href="/admin/categories" className="text-indigo-600 hover:text-indigo-500">
                    Create some categories first
                  </Link>
                </p>
              )}
            </div>

            {/* Published Status */}
            <div className="flex items-center">
              <input
                id="published"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                Published
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/posts"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 