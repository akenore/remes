'use client';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Hero3 from "../ui/hero/Hero3";
import Footer from "../ui/Footer";
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

export default function SearchView() {
     const t = useTranslations('frontend');
     const locale = useLocale();
     const searchParams = useSearchParams();
     const router = useRouter();
     const [posts, setPosts] = useState<Post[]>([]);
     const [categories, setCategories] = useState<Category[]>([]);
     const [loading, setLoading] = useState(true);
     const [currentPage, setCurrentPage] = useState(1);
     const [totalPages, setTotalPages] = useState(1);
     const [searchQuery, setSearchQuery] = useState('');
     const [totalItems, setTotalItems] = useState(0);
     const postsPerPage = 6;

     // Get search query from URL params
     useEffect(() => {
          const query = searchParams.get('q') || '';
          setSearchQuery(query);
          setCurrentPage(1); // Reset page when search changes
     }, [searchParams]);

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

     // Search posts and categories
     const searchData = async () => {
          try {
               setLoading(true);
               
               if (!searchQuery.trim()) {
                    setPosts([]);
                    setTotalPages(1);
                    setTotalItems(0);
                    setLoading(false);
                    return;
               }

               // Create search filter for both English and French content
               const searchFilter = `(title ~ "${searchQuery}" || title_fr ~ "${searchQuery}" || content ~ "${searchQuery}" || content_fr ~ "${searchQuery}") && published = true`;
               
               // Fetch search results
               const postsResult = await pb.collection('posts').getList(currentPage, postsPerPage, {
                    filter: searchFilter,
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
                    status: item.published || false,
                    created: item.created,
                    updated: item.updated,
                    collectionName: item.collectionName,
                    collectionId: item.collectionId,
               }));

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

               setPosts(postsData);
               setCategories(categoriesData);
               setTotalPages(Math.ceil(postsResult.totalItems / postsPerPage));
               setTotalItems(postsResult.totalItems);
          } catch (error) {
               console.error('Failed to search posts:', error);
               setPosts([]);
               setCategories([]);
               setTotalPages(1);
               setTotalItems(0);
          } finally {
               setLoading(false);
          }
     };

     // Search data when query or page changes
     useEffect(() => {
          searchData();
     }, [searchQuery, currentPage]);

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

     // Handle new search from search input
     const handleSearch = (newQuery: string) => {
          if (newQuery.trim()) {
               router.push(`/${locale}/search?q=${encodeURIComponent(newQuery.trim())}`);
          }
     };

     // Handle pagination
     const handlePageChange = (page: number) => {
          setCurrentPage(page);
          // Scroll to top when page changes
          window.scrollTo({ top: 0, behavior: 'smooth' });
     };

     return (
          <>
               <Hero3
                    title={searchQuery ? `${t('search.resultsFor')} "${searchQuery}"` : t('search.title')}
                    description={searchQuery ? `${totalItems} ${t('search.resultsFound')}` : t('search.description')}
                    bgMobile="/hero-4/bg-mobile.jpeg"
                    bgDesktop="/hero-4/bg-desktop.jpeg"
               />
               
               <main>
                    <section className="relative w-full overflow-hidden bg-white">
                         <div className="w-full pb-12 md:pb-16 lg:pb-24">
                              <div className="max-w-3xl md:max-w-3xl lg:max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-24">
                                   
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

                                   {/* Search Input */}
                                   <div className="mb-12">
                                        <form 
                                             onSubmit={(e) => {
                                                  e.preventDefault();
                                                  const formData = new FormData(e.currentTarget);
                                                  const query = formData.get('search') as string;
                                                  handleSearch(query);
                                             }}
                                             className="max-w-xl mx-auto"
                                        >
                                             <div className="relative">
                                                  <input
                                                       type="text"
                                                       name="search"
                                                       defaultValue={searchQuery}
                                                       placeholder={t('search.placeholder') || 'Search articles...'}
                                                       className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-dark-gold text-dark-blue"
                                                  />
                                                  <button
                                                       type="submit"
                                                       className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-blue hover:text-dark-gold transition-colors"
                                                       aria-label="Search"
                                                  >
                                                       <svg width="20" height="20" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="10.2243" cy="10.3776" r="8.98856" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M16.476 17.0961L20 20.611" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                       </svg>
                                                  </button>
                                             </div>
                                        </form>
                                   </div>

                                   {/* Search Results */}
                                   {loading ? (
                                        <div className="flex flex-col items-center justify-center py-20">
                                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-gold"></div>
                                             <p className="text-gray text-sm mt-4">{t('common.loading')}</p>
                                        </div>
                                   ) : !searchQuery.trim() ? (
                                        <div className="text-center py-20">
                                             <div className="mb-8">
                                                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                  </svg>
                                                  <h2 className="text-dark-blue text-2xl font-myanmar mb-4">{t('search.title')}</h2>
                                                  <p className="text-gray text-lg">{t('search.enterQuery')}</p>
                                             </div>
                                        </div>
                                   ) : posts.length === 0 ? (
                                        <div className="text-center py-20">
                                             <div className="mb-8">
                                                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.008-5.684-2.646" />
                                                  </svg>
                                                  <h2 className="text-dark-blue text-2xl font-myanmar mb-4">{t('search.noResults')}</h2>
                                                  <p className="text-gray text-lg">{t('search.tryDifferent')}</p>
                                             </div>
                                        </div>
                                   ) : (
                                        <>
                                             {/* Results summary */}
                                             <div className="mb-8">
                                                  <p className="text-gray text-lg">
                                                       {totalItems} {t('search.resultsFound')} {searchQuery && `${t('search.for')} "${searchQuery}"`}
                                                  </p>
                                             </div>

                                             {/* Results grid */}
                                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
                                                  {posts.map((post) => {
                                                       const localizedContent = getLocalizedContent(post);
                                                       const categoryNames = getPostCategoryNames(post.categories);
                                                       
                                                       // Get proper image URL with fallback
                                                       const getImageUrl = () => {
                                                            if (post.cover_image !== null && 
                                                                post.cover_image !== undefined && 
                                                                typeof post.cover_image === 'string' && 
                                                                post.cover_image.trim() !== '') {
                                                                 try {
                                                                      const imageUrl = pb.files.getURL(post, post.cover_image);
                                                                      
                                                                      if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
                                                                           return imageUrl;
                                                                      }
                                                                 } catch (error) {
                                                                      console.warn('Error getting image URL for post:', post.id, 'image:', post.cover_image, 'error:', error);
                                                                      try {
                                                                           return `${pb.baseURL}/api/files/${post.collectionName}/${post.id}/${post.cover_image}`;
                                                                      } catch (e2) {
                                                                           console.warn('Manual URL construction failed:', e2);
                                                                      }
                                                                 }
                                                            }
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
                                                  <div className="flex justify-center items-center mt-16 space-x-2">
                                                       <button
                                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                            disabled={currentPage === 1}
                                                            className="px-4 py-2 text-sm font-medium text-dark-blue bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                       >
                                                            {t('common.previous') || 'Previous'}
                                                       </button>

                                                       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                            <button
                                                                 key={page}
                                                                 onClick={() => handlePageChange(page)}
                                                                 className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                                                      currentPage === page
                                                                           ? 'text-white bg-dark-gold'
                                                                           : 'text-dark-blue bg-white border border-gray-300 hover:bg-gray-50'
                                                                 }`}
                                                            >
                                                                 {page}
                                                            </button>
                                                       ))}

                                                       <button
                                                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                            disabled={currentPage === totalPages}
                                                            className="px-4 py-2 text-sm font-medium text-dark-blue bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                       >
                                                            {t('common.next') || 'Next'}
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