'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { pb } from '@/lib/pocketbase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '@/components/ui/admin/RichTextEditor';
import CoverImageSelector from '@/components/ui/admin/CoverImageSelector';
import HorizontalAccordion from '@/components/ui/admin/HorizontalAccordion';
import { useTranslations, useLocale } from 'next-intl';

interface Category {
  id: string;
  title: string;
  title_fr?: string;
}

export default function AddPostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin.posts.add');
  const tCommon = useTranslations('admin.common');
  const [loading, setLoading] = useState(false);
  const [savingAs, setSavingAs] = useState<'draft' | 'published' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savedPostId, setSavedPostId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    title_fr: '',
    slug: '',
    slug_fr: '',
    content: '',
    content_fr: '',
    published: false,
    categories: [] as string[],
    cover_image: null as File | null,
    cover_image_url: '' as string, // For images selected from library
  });
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [isSlugFrEditable, setIsSlugFrEditable] = useState(false);

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
        title_fr: item.title_fr as string,
      })));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Function to get localized category title
  const getLocalizedCategoryTitle = (category: Category) => {
    const isFrench = locale === 'fr';
    if (isFrench && category.title_fr && category.title_fr.trim() !== '') {
      return category.title_fr;
    }
    return category.title;
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const generateUniqueSlug = async (baseSlug: string, field: 'slug' | 'slug_fr') => {
    if (!baseSlug) {
      return '';
    }
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      try {
        // Check if slug exists in the database
        const existingPosts = await pb.collection('posts').getList(1, 1, {
          filter: `${field} = "${slug}"`,
        });

        if (existingPosts.totalItems === 0) {
          return slug; // Slug is unique
        }

        // If slug exists, try with a counter
        slug = `${baseSlug}-${counter}`;
        counter++;
      } catch (err) {
        console.error(`Error checking ${field} uniqueness:`, err);
        return baseSlug; // Return original if error
      }
    }
  };

  const handleTitleChange = async (title: string) => {
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
    
    setFormData(prev => ({ ...prev, title }));
    
    // Only auto-update slug if it's not being manually edited
    if (!isSlugEditable) {
      const baseSlug = generateSlug(title);
      if (!baseSlug) {
        setFormData(prev => ({ ...prev, slug: '' }));
        if (!isSlugFrEditable && !(formData.title_fr?.trim())) {
          setFormData(prev => ({ ...prev, slug_fr: '' }));
        }
        return;
      }
      const uniqueSlug = await generateUniqueSlug(baseSlug, 'slug');
      setFormData(prev => ({ ...prev, slug: uniqueSlug }));
      if (!isSlugFrEditable && !(formData.title_fr?.trim())) {
        const uniqueSlugFr = await generateUniqueSlug(baseSlug, 'slug_fr');
        setFormData(prev => ({ ...prev, slug_fr: uniqueSlugFr }));
      }
    }
  };

  const handleFrenchTitleChange = async (title: string) => {
    if (error) setError('');
    if (success) setSuccess('');

    setFormData(prev => ({ ...prev, title_fr: title }));

    if (!isSlugFrEditable) {
      const sourceTitle = title.trim() ? title : formData.title;
      const baseSlug = generateSlug(sourceTitle);
      if (!baseSlug) {
        setFormData(prev => ({ ...prev, slug_fr: '' }));
        return;
      }
      const uniqueSlugFr = await generateUniqueSlug(baseSlug, 'slug_fr');
      setFormData(prev => ({ ...prev, slug_fr: uniqueSlugFr }));
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    // Clear messages when user interacts with categories
    if (error) setError('');
    if (success) setSuccess('');
    
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleImageChange = (file: File | null, url?: string) => {
    // Clear messages when user selects an image
    if (error) setError('');
    if (success) setSuccess('');
    
    if (file) {
      // File upload
      setFormData(prev => ({ ...prev, cover_image: file, cover_image_url: '' }));
    } else if (url) {
      // Library selection
      setFormData(prev => ({ ...prev, cover_image: null, cover_image_url: url }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, cover_image: null, cover_image_url: '' }));
  };

  const handleSave = async (publishStatus: boolean) => {
    setLoading(true);
    setSavingAs(publishStatus ? 'published' : 'draft');
    setError('');
    setSuccess('');

    try {
      // Client-side validation with specific error messages
      const errors = [];
      
      if (!formData.title.trim()) {
        errors.push(t('validation.titleRequired'));
      }
      
      if (!formData.slug.trim()) {
        errors.push(t('validation.slugRequired'));
      }
      
      if (!formData.content.trim()) {
        errors.push(t('validation.contentRequired'));
      }
      
      if (!user?.id) {
        errors.push(t('validation.loginRequired'));
      }
      
      // Check if categories are required (based on PocketBase schema)
      if (formData.categories.length === 0) {
        errors.push(t('validation.categoriesRequired'));
      }
      
      // Check if cover image is required (based on PocketBase schema)
      if (!formData.cover_image && !formData.cover_image_url) {
        errors.push(t('validation.coverImageRequired'));
      }
      
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('title_fr', formData.title_fr);
      data.append('slug', formData.slug);
      data.append('slug_fr', formData.slug_fr);
      data.append('content', formData.content);
      data.append('content_fr', formData.content_fr);
      data.append('author', user?.id || '');
      data.append('published', publishStatus.toString());
      
      // Always add cover image (now required)
      if (formData.cover_image) {
        data.append('cover_image', formData.cover_image);
      } else if (formData.cover_image_url) {
        // For library images, fetch the image and convert to blob
        try {
          const response = await fetch(formData.cover_image_url);
          const blob = await response.blob();
          const urlParts = formData.cover_image_url.split('/');
          const filename = urlParts[urlParts.length - 1];
          data.append('cover_image', blob, filename);
        } catch (err) {
          throw new Error('Failed to process selected image from library');
        }
      }
      
      // Add categories (now required - at least one)
      formData.categories.forEach(categoryId => {
        data.append('categories', categoryId);
      });

      const createdPost = await pb.collection('posts').create(data);
      
      // Clear any previous errors on success
      setError('');
      
      // Update the form state to reflect the published status
      setFormData(prev => ({ ...prev, published: publishStatus }));
      setSavedPostId(createdPost.id);
      
      // Show success message and stay on page (WordPress-style)
      setSuccess(publishStatus 
        ? t('success.published')
        : t('success.savedAsDraft')
      );
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);

    } catch (err: any) {
      // Only log actual server/network errors, not our validation errors
      if (err.response || err.status) {
        console.error('Server error creating post:', err);
          }
      setError(err.message || (publishStatus ? t('validation.publishFailed') : t('validation.saveFailed')));
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
        </div>
        <Link
          href="/admin/posts"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToPosts')}
        </Link>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">
                {success}
                {savedPostId && (
                  <span className="ml-2">
                    <Link
                      href={`/admin/posts/edit/${savedPostId}`}
                      className="font-medium underline hover:text-green-600"
                    >
                      {t('success.links.editPost')}
                    </Link>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <div className="text-sm text-red-800">
                {error.includes('\n') ? (
                  <ul className="list-disc list-inside space-y-1">
                    {error.split('\n').map((err, index) => (
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

      <form className="space-y-6">
      {/* WordPress-style Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area (Left) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Title - English & French */}
          <HorizontalAccordion
            englishLabel="Title (English)"
            englishValue={formData.title}
            englishPlaceholder={t('form.titlePlaceholder')}
            onEnglishChange={handleTitleChange}
            englishRequired={true}
            frenchLabel="Title (French)"
            frenchValue={formData.title_fr}
            frenchPlaceholder="Titre en français"
            onFrenchChange={handleFrenchTitleChange}
            frenchRequired={false}
            fieldType="text"
            uniqueId="post-title"
            textInputClassName="text-2xl font-bold border-0 p-0 placeholder-gray-400 focus:ring-0 focus:outline-none"
          />

          {/* Permalink */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.slug')}
              </label>
              <div className="mt-1">
                {!isSlugEditable ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 font-mono">{process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://127.0.0.1:3000'}/posts/</span>
                      <span className="font-semibold text-indigo-600">{formData.slug || 'post-slug'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSlugEditable(true)}
                      className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                        {tCommon('edit')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white border border-gray-300 rounded-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                      <span className="text-gray-500 font-mono text-sm">{process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://127.0.0.1:3000'}/posts/</span>
                      <input
                        type="text"
                        className="flex-1 border-0 p-0 text-sm font-semibold text-indigo-600 placeholder-gray-400 focus:ring-0 focus:outline-none bg-transparent"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder={t('form.slugPlaceholder')}
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsSlugEditable(false)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                      >
                          {tCommon('save')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const baseSlug = generateSlug(formData.title);
                          generateUniqueSlug(baseSlug, 'slug').then(uniqueSlug => {
                            setFormData(prev => ({ ...prev, slug: uniqueSlug }));
                          });
                          setIsSlugEditable(false);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                          {tCommon('cancel')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.slugFr')}
                </label>
                <div className="mt-1">
                  {!isSlugFrEditable ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 font-mono">{process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://127.0.0.1:3000'}/fr/posts/</span>
                        <span className="font-semibold text-indigo-600">{formData.slug_fr || t('form.slugFrPlaceholder')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSlugFrEditable(true)}
                        className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                      >
                          {tCommon('edit')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-white border border-gray-300 rounded-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                        <span className="text-gray-500 font-mono text-sm">{process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://127.0.0.1:3000'}/fr/posts/</span>
                        <input
                          type="text"
                          className="flex-1 border-0 p-0 text-sm font-semibold text-indigo-600 placeholder-gray-400 focus:ring-0 focus:outline-none bg-transparent"
                          value={formData.slug_fr}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug_fr: e.target.value }))}
                            placeholder={t('form.slugFrPlaceholder')}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsSlugFrEditable(false)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                        >
                            {tCommon('save')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const baseSlug = generateSlug(formData.title_fr || formData.title);
                            generateUniqueSlug(baseSlug, 'slug_fr').then(uniqueSlug => {
                              setFormData(prev => ({ ...prev, slug_fr: uniqueSlug }));
                            });
                            setIsSlugFrEditable(false);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            {tCommon('cancel')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    {t('form.slugFrHelp')}
                </p>
              </div>
            </div>
          </div>

          {/* Content - English & French */}
          <HorizontalAccordion
            englishLabel="Content (English)"
            englishValue={formData.content}
            englishPlaceholder={t('form.contentPlaceholder')}
            onEnglishChange={(content) => {
              if (error) setError('');
              if (success) setSuccess('');
              setFormData(prev => ({ ...prev, content }));
            }}
            englishRequired={true}
            frenchLabel="Content (French)"
            frenchValue={formData.content_fr}
            frenchPlaceholder="Contenu en français"
            onFrenchChange={(content) => {
              if (error) setError('');
              if (success) setSuccess('');
              setFormData(prev => ({ ...prev, content_fr: content }));
            }}
            frenchRequired={false}
            fieldType="richtext"
            uniqueId="post-content"
            RichTextComponent={RichTextEditor}
          />
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Publish Box */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{tCommon('actions')}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('form.status')}:</span>
                  <span className="font-medium text-gray-900">
                      {savingAs === 'published' || (savingAs === null && formData.published) ? tCommon('published') : tCommon('draft')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('form.visibility')}:</span>
                    <span className="font-medium text-gray-900">{t('form.public')}</span>
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
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                          {t('actions.savingDraft')}
                      </>
                    ) : (
                        t('actions.saveDraft')
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
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                          {t('actions.publishing')}
                      </>
                    ) : (
                        t('actions.publish')
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('form.categories')}</h3>
              
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
                        <span className="font-medium text-gray-700">{getLocalizedCategoryTitle(category)}</span>
                      </div>
                    </label>
                  ))
                ) : (
                    <p className="text-sm text-gray-500">
                      {t('form.noCategoriesMessage')}{' '}
                      <Link href="/admin/categories" className="text-indigo-600 hover:text-indigo-500">
                        {t('form.createCategoriesFirst')}
                    </Link>
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/admin/categories"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                    {t('form.addNewCategory')}
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <CoverImageSelector
            currentImageUrl={formData.cover_image ? URL.createObjectURL(formData.cover_image) : formData.cover_image_url || null}
            onImageChange={handleImageChange}
            onImageRemove={removeImage}
          />
        </div>
      </div>
      </form>
    </div>
  );
} 
