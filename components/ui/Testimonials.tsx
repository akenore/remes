'use client'
import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { pb } from '@/lib/pocketbase';

interface Testimonial {
  id: string;
  full_name: string;
  description: string;
  description_fr: string;
  created: string;
  updated: string;
}

// Arrow components
const PrevArrow = () => (
  <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="var(--dark-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NextArrow = () => (
  <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6L15 12L9 18" stroke="var(--dark-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Testimonials() {
  const t = useTranslations('frontend');
  const locale = useLocale();
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const total = testimonials.length;

  // Refs to measure individual slide heights
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [maxSlideHeight, setMaxSlideHeight] = useState<number>(0);

  // Function to get localized content with fallback
  const getLocalizedContent = (testimonial: Testimonial) => {
    const isFrench = locale === 'fr';
    return {
      description: isFrench && testimonial.description_fr 
        ? testimonial.description_fr 
        : testimonial.description
    };
  };

  // Fetch testimonials data from PocketBase
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const result = await pb.collection('testimonials').getList(1, 50, {
        sort: '-created', // Get newest first
        requestKey: null, // Prevent caching issues
      });

      const testimonialsData: Testimonial[] = result.items.map((item: any) => ({
        id: item.id,
        full_name: item.full_name || '',
        description: item.description || '',
        description_fr: item.description_fr || '',
        created: item.created,
        updated: item.updated,
      }));

      setTestimonials(testimonialsData);
    } catch (error) {
      console.error('Failed to fetch testimonials data:', error);
      // Fallback to empty array to prevent errors
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Calculate the tallest slide on mount & whenever the window resizes
  useEffect(() => {
    const calcHeight = () => {
      const heights = slideRefs.current.map((el) => el?.offsetHeight || 0);
      setMaxSlideHeight(Math.max(...heights));
    };

    // Initial calculation
    calcHeight();

    // Re-calculate on resize to keep responsiveness
    window.addEventListener('resize', calcHeight);
    return () => window.removeEventListener('resize', calcHeight);
  }, []);

  // Auto-rotate every 6s (optional) - only if we have testimonials
  useEffect(() => {
    if (total > 1) {
      const id = setInterval(() => setCurrent((prev) => (prev + 1) % total), 6000);
      return () => clearInterval(id);
    }
  }, [total]);

  const goTo = (idx: number) => setCurrent((idx + total) % total);

  return (
    <section className="max-w-7xl mx-5 md:mx-auto px-5 md:px-8 my-24 md:my-32">
      {/* Section heading */}
      <div className="mb-12 md:mb-20 max-w-3xl">
        <h2 className="text-[2rem] text-center md:text-left md:text-[2.5rem] text-dark-blue font-myanmar mb-4">
          {t('home.testimonials.title')}
        </h2>
        <p className="text-gray text-center md:text-left leading-relaxed text-[1.063rem] md:max-w-lg w-full">
          {t('home.testimonials.subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-center">
        {/* Left fixed image – hidden on mobile, visible from md */}
        <div className="hidden md:block">
          <Image
            src="/home/left-h.jpg"
            alt="Résident jouant"
            width={610}
            height={648}
            className="w-full h-auto object-cover rounded"
            priority
          />
        </div>

        {/* Right slider */}
        <div
          className="relative flex flex-col md:pl-8 lg:pl-12 xl:pl-16 max-w-xl mx-auto md:mx-0"
          style={{ minHeight: maxSlideHeight > 0 ? maxSlideHeight : 'auto' }}
        >
          {loading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-gold"></div>
              <p className="text-gray text-sm mt-4">{t('common.loading')}</p>
            </div>
          ) : testimonials.length === 0 ? (
            // Fallback when no testimonials available
            <div className="py-20 text-center md:text-left">
              <p className="text-[1.063rem] text-gray mb-10 leading-relaxed">
                {t('home.testimonials.fallback.message')}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-5 items-center text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-4 sm:mb-0 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">👤</span>
                </div>
                <div>
                  <h3 className="text-dark-blue font-semibold">{t('home.testimonials.fallback.author')}</h3>
                  <span className="text-sm text-gray">{t('home.testimonials.fallback.role')}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Slides */}
              {testimonials.map((testimonial, idx) => {
                const localizedContent = getLocalizedContent(testimonial);
                return (
                  <div
                    ref={(el) => {
                      slideRefs.current[idx] = el;
                    }}
                    key={testimonial.id}
                    className={`transition-opacity duration-700 ease-in-out ${
                      current === idx
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none absolute'
                    }`}
                  >
                    <p className="text-[1.063rem] text-gray mb-10 leading-relaxed text-center md:text-left">
                      "{localizedContent.description}"
                    </p>

                    {/* Author */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-5 items-center text-center sm:text-left">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mb-4 sm:mb-0 flex items-center justify-center shadow-lg">
                        <span className="text-gray-600 text-sm">👤</span>
                      </div>
                      <div>
                        <h3 className="text-dark-blue font-semibold">{testimonial.full_name}</h3>
                        <span className="text-sm text-gray">{t('home.testimonials.clientLabel')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Arrows - only show if we have multiple testimonials */}
              {testimonials.length > 1 && (
                <div className="flex justify-center md:justify-start space-x-8 mt-8 md:mb-6 order-last md:order-first">
                  <button
                    aria-label={t('home.testimonials.previous')}
                    onClick={() => goTo(current - 1)}
                    className="hover:scale-110 transition-transform"
                  >
                    <PrevArrow />
                  </button>
                  <button
                    aria-label={t('home.testimonials.next')}
                    onClick={() => goTo(current + 1)}
                    className="hover:scale-110 transition-transform"
                  >
                    <NextArrow />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
