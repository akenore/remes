'use client'
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Hero2 from "@/components/ui/hero/Hero2";
import Footer from "@/components/ui/Footer";
import { pb } from '@/lib/pocketbase';

interface Post {
  id: string;
  title: string;
  title_fr: string;
  slug: string;
  content: string;
  content_fr: string;
  cover_image: string | null;
  categories: any[];
  status: boolean;
  created: string;
  updated: string;
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

  const slug = params?.slug as string;

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
      
      // Fetch single post by slug
      const postResult = await pb.collection('posts').getFirstListItem(`slug="${slug}"`, {
        expand: 'categories',
        requestKey: null,
      });

      // Check if post is published (status is boolean)
      if (postResult.status !== true) {
        setNotFound(true);
        return;
      }

      const postData: Post = {
        id: postResult.id,
        title: postResult.title || '',
        title_fr: postResult.title_fr || '',
        slug: postResult.slug || '',
        content: postResult.content || '',
        content_fr: postResult.content_fr || '',
        cover_image: postResult.cover_image || null,
        categories: postResult.expand?.categories || [],
        status: postResult.status || false,
        created: postResult.created,
        updated: postResult.updated,
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
    if (slug) {
      fetchPostData();
    }
  }, [slug]);

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
        <Hero2
          title={t('magazine.hero.title')}
          description={t('magazine.hero.description')}
          cards={null}
          bgMobile="/hero-4/bg-mobile.jpg"
          bgDesktop="/hero-4/bg-desktop.jpg"
        />
        <main className="pt-10">
          <section className="relative w-full overflow-hidden bg-white">
            <div className="w-full pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-20 lg:pb-24">
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
        <Hero2
          title={t('magazine.hero.title')}
          description={t('magazine.hero.description')}
          cards={null}
          bgMobile="/hero-4/bg-mobile.jpg"
          bgDesktop="/hero-4/bg-desktop.jpg"
        />
        <main className="pt-10">
          <section className="relative w-full overflow-hidden bg-white">
            <div className="w-full pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-20 lg:pb-24">
              <div className="max-w-3xl md:max-w-3xl lg:max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-24">
                <div className="text-center py-20">
                  <h1 className="text-dark-blue text-3xl font-myanmar mb-4">Article non trouvé</h1>
                  <p className="text-gray text-lg mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
                  <button
                    onClick={() => router.push(`/${locale}/magazine`)}
                    className="bg-dark-blue text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Retour au magazine
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

  return (
    <>
      <Hero2
        title={localizedContent.title}
        description={categoryNames || t('magazine.blog.uncategorized')}
        cards={null}
        bgMobile="/hero-4/bg-mobile.jpg"
        bgDesktop="/hero-4/bg-desktop.jpg"
      />
      <main className="pt-10">
        <section className="relative w-full overflow-hidden bg-white">
          <div className="w-full pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-20 lg:pb-24">
            <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-24">
              
              {/* Back to magazine link */}
              <div className="mb-8">
                <button
                  onClick={() => router.push(`/${locale}/magazine`)}
                  className="flex items-center text-dark-blue hover:text-dark-gold transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('magazine.backToMagazine')}
                </button>
              </div>

              {/* Article metadata */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray mb-4">
                  {categoryNames && (
                    <span className="bg-dark-gold text-white px-3 py-1 rounded-full text-xs">
                      {categoryNames}
                    </span>
                  )}
                  <span>{formatDate(post.created)}</span>
                </div>
                <h1 className="text-dark-blue text-3xl sm:text-4xl md:text-5xl font-myanmar mb-6">
                  {localizedContent.title}
                </h1>
              </div>

              {/* Featured image */}
              {post.cover_image && 
               typeof post.cover_image === 'string' && 
               post.cover_image.trim() !== '' && (
                <div className="mb-12">
                  <Image
                    src={pb.files.getURL(post, post.cover_image)}
                    alt={localizedContent.title}
                    width={1200}
                    height={600}
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                    priority
                  />
                </div>
              )}

              {/* Article content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: localizedContent.content }}
                />
              </div>

              {/* Back to magazine button */}
              <div className="mt-16 text-center">
                <button
                  onClick={() => router.push(`/${locale}/magazine`)}
                  className="bg-dark-blue text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
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