'use client'

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import { pb } from '@/lib/pocketbase';
import type { ClientResponseError } from 'pocketbase';

interface Post {
  id: string;
  title: string;
  title_fr: string;
  slug: string;
  slug_fr?: string;
  content: string;
  content_fr: string;
  cover_image: string | null;
  categories: any[];
  status: boolean;
  created: string;
  updated: string;
  collectionName?: string;
  collectionId?: string;
}

interface Category {
  id: string;
  title: string;
  title_fr: string;
}

export default function PostDetailPage() {
  const t = useTranslations('frontend');
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const slugParam = (params?.slug as string) ?? (params?.slug_fr as string);

  // Function to decode HTML entities
  const decodeHtmlEntities = (text: string): string => {
    if (typeof window === 'undefined') return text; // Server-side fallback
    
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  // Function to get localized content with fallback
  const getLocalizedContent = (post: Post) => {
    const isFrench = locale === 'fr';
    const content = isFrench && post.content_fr ? post.content_fr : post.content;
    
    return {
      title: isFrench && post.title_fr ? post.title_fr : post.title,
      content: content // Keep as HTML - dangerouslySetInnerHTML should handle entities
    };
  };

  const getLocalizedCategoryTitle = (category: Category) => {
    const isFrench = locale === 'fr';
    return isFrench && category.title_fr ? category.title_fr : category.title;
  };

  // Fetch post and categories
  const fetchPostData = async () => {
    try {
      setLoading(true);
      setNotFound(false);
      
      if (!slugParam) {
        setNotFound(true);
        return;
      }

      const filtersToTry = locale === 'fr'
        ? [`slug_fr="${slugParam}"`, `slug="${slugParam}"`]
        : [`slug="${slugParam}"`, `slug_fr="${slugParam}"`];

      let postResult: any = null;

      for (const filter of filtersToTry) {
        try {
          postResult = await pb.collection('posts').getFirstListItem(filter, {
            expand: 'categories',
            requestKey: null,
          });
          if (postResult) break;
        } catch (error: unknown) {
          const err = error as ClientResponseError;
          if (!err?.status || err.status !== 404) {
            throw error;
          }
        }
      }

      if (!postResult) {
        setNotFound(true);
        return;
      }

      // Check if post is published (published is boolean)
      if (postResult.published !== true) {
        setNotFound(true);
        return;
      }

      const postData: Post = {
        id: postResult.id,
        title: postResult.title || '',
        title_fr: postResult.title_fr || '',
        slug: postResult.slug || '',
        slug_fr: postResult.slug_fr || '',
        content: postResult.content || '',
        content_fr: postResult.content_fr || '',
        cover_image: postResult.cover_image || null,
        categories: postResult.expand?.categories || [],
        status: postResult.published || false,
        created: postResult.created,
        updated: postResult.updated,
        collectionName: postResult.collectionName,
        collectionId: postResult.collectionId,
      };

      // Fetch categories for display
      const categoriesResult = await pb.collection('categories').getList(1, 50, {
        sort: 'title',
        requestKey: null,
      });

      const categoriesData: Category[] = categoriesResult.items.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        title_fr: item.title_fr || '',
      }));

      setPost(postData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch post data:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (slugParam) {
      fetchPostData();
    }
  }, [slugParam]);

  useEffect(() => {
    if (typeof window === 'undefined' || !post) return;
    (window as typeof window & {
      __remesActiveSlugs?: { slug: string; slug_fr?: string };
    }).__remesActiveSlugs = {
      slug: post.slug,
      slug_fr: post.slug_fr || post.slug,
    };

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as typeof window & { __remesActiveSlugs?: unknown }).__remesActiveSlugs;
      }
    };
  }, [post]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get post category names
  const getPostCategoryNames = (postCategories: any[]) => {
    if (!postCategories || postCategories.length === 0) return '';
    return postCategories.map(cat => {
      const category = categories.find(c => c.id === cat.id);
      return category ? getLocalizedCategoryTitle(category) : '';
    }).filter(Boolean).join(', ');
  };

  // Handle loading state
  if (loading) {
    return (
      <>
        <Hero3
          title={t('magazine.hero.title')}
          description={t('magazine.hero.description')}
          bgMobile="/hero-4/bg-mobile.jpg"
          bgDesktop="/hero-4/bg-desktop.jpg"
        />
        <main>
          <section className="relative w-full overflow-hidden bg-white">
            <div className="w-full pb-12 md:pb-16 lg:pb-24">
              <div className="max-w-3xl md:max-w-3xl lg:max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-24">
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-gold"></div>
                  <p className="text-gray text-sm mt-4">{t('common.loading')}</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <div className="bg-dark-blue pb-10">
          <Footer />
        </div>
      </>
    );
  }

  // Handle not found
  if (notFound || !post) {
    return (
      <>
        <Hero3
          title={t('magazine.hero.title')}
          description={t('magazine.hero.description')}
          bgMobile="/hero-4/bg-mobile.jpg"
          bgDesktop="/hero-4/bg-desktop.jpg"
        />
        <main>
          <section className="relative w-full overflow-hidden bg-white">
            <div className="w-full pt-8 pb-12 md:pb-16 lg:pb-24">
              <div className="max-w-3xl md:max-w-3xl lg:max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-24">
                <div className="text-center py-20">
                  <h1 className="text-dark-blue text-3xl font-myanmar mb-4">Article non trouvé</h1>
                  <p className="text-gray text-lg mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
                  <button
                    onClick={() => router.push(`/${locale}/magazine`)}
                    className="bg-dark-blue text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer"
                  >
                    {t('magazine.backToMagazine')}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <div className="bg-dark-blue pb-10">
          <Footer />
        </div>
      </>
    );
  }

  const localizedContent = getLocalizedContent(post);
  const categoryNames = getPostCategoryNames(post.categories);
  const canonicalSlug = locale === 'fr' ? (post.slug_fr || post.slug) : post.slug;

  // Get proper image URL with fallback
  const getImageUrl = () => {
    // Check if cover_image exists and is a valid string
    if (post.cover_image !== null && 
        post.cover_image !== undefined && 
        typeof post.cover_image === 'string' && 
        post.cover_image.trim() !== '') {
      try {
        const recordRef = {
          id: post.id,
          collectionId: post.collectionId,
          collectionName: post.collectionName,
        };
        const imageUrl = pb.files.getURL(recordRef as any, post.cover_image);
        
        // Double check the URL is valid and not empty
        if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
          return imageUrl;
        }
      } catch (error) {
        console.warn('Error getting image URL for post:', post.id, 'image:', post.cover_image, 'error:', error);
        // Fallback to manual URL construction
        try {
          const collectionSegment = post.collectionId || post.collectionName || 'posts';
          return `${pb.baseURL}/api/files/${collectionSegment}/${post.id}/${post.cover_image}`;
        } catch (e2) {
          console.warn('Manual URL construction failed:', e2);
        }
      }
    }
    // Always return a valid fallback image
    return '/form.jpg';
  };

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": localizedContent.title,
    "image": post.cover_image ? getImageUrl() : null,
    "author": {
      "@type": "Organization",
      "name": "Resort Medical"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "Resort Medical",
      "logo": {
        "@type": "ImageObject",
        "url": "/icon-remes.png"
      }
    },
    "datePublished": post.created,
    "dateModified": post.updated,
    "description": categoryNames || t('magazine.blog.uncategorized'),
    "articleBody": localizedContent.content.replace(/<[^>]*>/g, ''),
    "keywords": categoryNames,
    "url": `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/magazine/${canonicalSlug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/magazine/${canonicalSlug}`
    }
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Hero3
        title={localizedContent.title}
        description={categoryNames || t('magazine.blog.uncategorized')}
        bgMobile="/hero-4/bg-mobile.jpg"
        bgDesktop="/hero-4/bg-desktop.jpg"
      />
      <main>
        <section className="relative w-full overflow-hidden bg-white">
          <div className="w-full pb-12 md:pb-16 lg:pb-24">
            <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-24">
              
              {/* Navigation breadcrumb */}
              <nav className="mb-8" aria-label="Breadcrumb">
                <button
                  onClick={() => router.push(`/${locale}/magazine`)}
                  className="flex items-center text-dark-blue hover:text-dark-gold transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('magazine.backToMagazine')}
                </button>
              </nav>

              {/* Article */}
              <article itemScope itemType="https://schema.org/BlogPosting">
                {/* Article header */}
                <header className="mb-8">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray mb-4">
                    {categoryNames && (
                      <span className="bg-dark-gold text-white px-3 py-1 rounded-full text-xs" itemProp="keywords">
                        {categoryNames}
                      </span>
                    )}
                    <time dateTime={post.created} itemProp="datePublished" className="text-gray">
                      {formatDate(post.created)}
                    </time>
                    <meta itemProp="dateModified" content={post.updated} />
                  </div>
                  <h1 className="text-dark-blue text-3xl sm:text-4xl md:text-5xl font-myanmar mb-6" itemProp="headline">
                    {localizedContent.title}
                  </h1>
                </header>

                {/* Featured image */}
                {post.cover_image && 
                 typeof post.cover_image === 'string' && 
                 post.cover_image.trim() !== '' && (
                  <figure className="mb-12">
                    <Image
                      src={getImageUrl()}
                      alt={localizedContent.title}
                      width={1200}
                      height={600}
                      className="w-full h-auto object-cover rounded-lg shadow-lg"
                      unoptimized
                      priority
                      itemProp="image"
                    />
                  </figure>
                )}

                {/* Article content */}
                <div className="prose prose-lg max-w-none" itemProp="articleBody">
                  <div 
                    className="text-gray leading-relaxed text-lg prose-headings:text-dark-blue prose-a:text-dark-gold hover:prose-a:text-gold"
                    dangerouslySetInnerHTML={{ __html: localizedContent.content }}
                  />
                </div>
              </article>

              {/* Back to magazine navigation */}
              <nav className="mt-16 text-center">
                <button
                  onClick={() => router.push(`/${locale}/magazine`)}
                  className="bg-dark-blue text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer"
                >
                  {t('magazine.backToMagazine')}
                </button>
              </nav>
            </div>
          </div>
        </section>
      </main>

      <div className="bg-dark-blue pb-10">
        <Footer />
      </div>
    </>
  );
} 
