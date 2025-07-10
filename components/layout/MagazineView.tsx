'use client';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import Hero2 from "../ui/hero/Hero2";
import Footer from "../ui/Footer";
import VerticalGallery from "../ui/gallery/Vertical";
import VideosCarousel from "../ui/gallery/Videos";
import Card4 from '../ui/card/Card4';
import { pb } from '@/lib/pocketbase';

interface Post {
  id: string;
  title: string;
  title_fr: string;
  slug: string;
  content: string;
  content_fr: string;
  cover_image: string | null;
  categories: string[];
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

export default function MagazineView() {
     const t = useTranslations('frontend');
     const locale = useLocale();
     const [posts, setPosts] = useState<Post[]>([]);
     const [categories, setCategories] = useState<Category[]>([]);
     const [loading, setLoading] = useState(true);
     const [currentPage, setCurrentPage] = useState(1);
     const [totalPages, setTotalPages] = useState(1);
     const postsPerPage = 6;

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
          return {
               title: isFrench && post.title_fr ? post.title_fr : post.title,
               content: isFrench && post.content_fr ? post.content_fr : post.content
          };
     };

     const getLocalizedCategoryTitle = (category: Category) => {
          const isFrench = locale === 'fr';
          return isFrench && category.title_fr ? category.title_fr : category.title;
     };

     // Fetch posts and categories
     const fetchData = async () => {
          try {
               setLoading(true);
               
               // Fetch published posts (published is boolean field)
               const postsResult = await pb.collection('posts').getList(currentPage, postsPerPage, {
                    filter: 'published = true',
                    sort: '-created',
                    expand: 'categories',
                    requestKey: null,
               });

               const postsData: Post[] = postsResult.items.map((item: any) => ({
                         id: item.id,
                         title: item.title || '',
                         title_fr: item.title_fr || '',
                         slug: item.slug || '',
                         content: item.content || '',
                         content_fr: item.content_fr || '',
                         cover_image: item.cover_image || null,
                         categories: item.expand?.categories || [],
                         status: item.published || false, // Use the published boolean field
                         created: item.created,
                         updated: item.updated,
                         collectionName: item.collectionName,
                         collectionId: item.collectionId,
                    }));

               // Fetch categories
               const categoriesResult = await pb.collection('categories').getList(1, 50, {
                    sort: 'title',
                    requestKey: null,
               });

               const categoriesData: Category[] = categoriesResult.items.map((item: any) => ({
                    id: item.id,
                    title: item.title || '',
                    title_fr: item.title_fr || '',
               }));

               setPosts(postsData);
               setCategories(categoriesData);
               setTotalPages(Math.ceil(postsResult.totalItems / postsPerPage));
          } catch (error) {
               console.error('Failed to fetch posts data:', error);
               setPosts([]);
               setCategories([]);
          } finally {
               setLoading(false);
          }
     };

     // Fetch data on component mount and page change
     useEffect(() => {
          fetchData();
     }, [currentPage]);

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

     // Truncate content for preview
     const truncateContent = (content: string, maxLength: number = 150) => {
          // Strip HTML tags and decode HTML entities
          const strippedContent = content.replace(/<[^>]*>/g, '');
          const decodedContent = decodeHtmlEntities(strippedContent);
          
          if (decodedContent.length <= maxLength) return decodedContent;
          return decodedContent.substring(0, maxLength).trim() + '...';
     };

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
                    <section>
                         <VerticalGallery />
                    </section>
                    <section className="pt-10">
                         <VideosCarousel />
                    </section>
                    <section className="relative w-full overflow-hidden bg-white">
                         <div className="w-full pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-20 lg:pb-24">
                              <div className="max-w-3xl md:max-w-3xl lg:max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-24">
                                   <div className="mb-4 md:mb-8">
                                        <div className="text-center lg:text-left">
                                             <h2 className="text-dark-blue text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-myanmar mb-2 md:mb-4">
                                                  {t('magazine.blog.title')}
                                             </h2>
                                             <p className="text-gray text-sm sm:text-base md:text-lg xl:text-xl max-w-md md:max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                                  {t('magazine.blog.description')}
                                             </p>
                                        </div>
                                   </div>

                                   {loading ? (
                                        <div className="flex flex-col items-center justify-center py-20">
                                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-gold"></div>
                                             <p className="text-gray text-sm mt-4">{t('common.loading')}</p>
                                        </div>
                                   ) : posts.length === 0 ? (
                                        <div className="text-center py-20">
                                             <p className="text-gray text-lg">{t('magazine.blog.noPosts')}</p>
                                        </div>
                                   ) : (
                                        <>
                                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
                                                  {posts.map((post) => {
                                                       const localizedContent = getLocalizedContent(post);
                                                       const categoryNames = getPostCategoryNames(post.categories);
                                                       
                                                       // Get proper image URL with fallback
                                                       const getImageUrl = () => {
                                                            // Check if cover_image exists and is a valid string
                                                            if (post.cover_image !== null && 
                                                                post.cover_image !== undefined && 
                                                                typeof post.cover_image === 'string' && 
                                                                post.cover_image.trim() !== '') {
                                                                 try {
                                                                      // Use the correct PocketBase method (getURL, not getUrl)
                                                                      const imageUrl = pb.files.getURL(post, post.cover_image);
                                                                      
                                                                      // Double check the URL is valid and not empty
                                                                      if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
                                                                           return imageUrl;
                                                                      }
                                                                 } catch (error) {
                                                                      console.warn('Error getting image URL for post:', post.id, 'image:', post.cover_image, 'error:', error);
                                                                      // Fallback to manual URL construction
                                                                      try {
                                                                           return `${pb.baseURL}/api/files/${post.collectionName}/${post.id}/${post.cover_image}`;
                                                                      } catch (e2) {
                                                                           console.warn('Manual URL construction failed:', e2);
                                                                      }
                                                                 }
                                                            }
                                                            // Always return a valid fallback image
                                                            return '/form.jpg';
                                                       };

                                                       return (
                                                            <Card4
                                                                 key={post.id}
                                                                 image={getImageUrl()}
                                                                 category={categoryNames || t('magazine.blog.uncategorized')}
                                                                 date={formatDate(post.created)}
                                                                 title={localizedContent.title}
                                                                 description={truncateContent(localizedContent.content)}
                                                                 buttonText={t('button')}
                                                                 buttonHref={`/${locale}/magazine/${post.slug}`}
                                                            />
                                                       );
                                                  })}
                                             </div>

                                             {/* Pagination */}
                                             {totalPages > 1 && (
                                                  <div className="flex justify-center items-center space-x-4 mt-12">
                                                       <button
                                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                            disabled={currentPage === 1}
                                                            className={`px-4 py-2 rounded-lg border ${
                                                                 currentPage === 1
                                                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                      : 'bg-white text-dark-blue border-dark-blue hover:bg-dark-blue hover:text-white'
                                                            } transition-colors`}
                                                       >
                                                            {t('magazine.pagination.previous')}
                                                       </button>

                                                       <span className="text-gray">
                                                            {t('magazine.pagination.page', { current: currentPage, total: totalPages })}
                                                       </span>

                                                       <button
                                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                            disabled={currentPage === totalPages}
                                                            className={`px-4 py-2 rounded-lg border ${
                                                                 currentPage === totalPages
                                                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                      : 'bg-white text-dark-blue border-dark-blue hover:bg-dark-blue hover:text-white'
                                                            } transition-colors`}
                                                       >
                                                            {t('magazine.pagination.next')}
                                                       </button>
                                                  </div>
                                             )}
                                        </>
                                   )}
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