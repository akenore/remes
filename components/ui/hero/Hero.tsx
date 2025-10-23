'use client';
import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Card from '../card/Card';
import Navbar from '../Navbar';
import { pb } from '@/lib/pocketbase';

interface HomeSlide {
  id: string;
  title: string;
  title_fr: string;
  description: string;
  description_fr: string;
  created: string;
  updated: string;
}

const NextArrow = () => (
  <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.0333 9.66667L30.5667 23.2L17.0333 36.7333" stroke="white" strokeWidth="2.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PrevArrow = () => (
  <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.9667 36.7334L16.4333 23.2L29.9667 9.66669" stroke="white" strokeWidth="2.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Hero() {
  const t = useTranslations('frontend');
  const locale = useLocale();
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<HomeSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const total = slides.length;
  const goTo = (idx: number) => setCurrent((idx + total) % total);

  // Function to get localized content with fallback
  const getLocalizedContent = (slide: HomeSlide) => {
    const isFrench = locale === 'fr';
    return {
      title: isFrench && slide.title_fr ? slide.title_fr : slide.title,
      description: isFrench && slide.description_fr ? slide.description_fr : slide.description
    };
  };

  // Fetch home slider data from PocketBase
  const fetchSlides = async () => {
    try {
      setLoading(true);
      const result = await pb.collection('home_slider').getList(1, 50, {
        sort: '-created', // Get newest first
        requestKey: null, // Prevent caching issues
      });

      const slidesData: HomeSlide[] = result.items.map((item: any) => ({
        id: item.id,
        title: item.title || '',
        title_fr: item.title_fr || '',
        description: item.description || '',
        description_fr: item.description_fr || '',
        created: item.created,
        updated: item.updated,
      }));

      setSlides(slidesData);
    } catch (error) {
      console.error('Failed to fetch home slider data:', error);
      // Fallback to empty array to prevent errors
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch slides on component mount
  useEffect(() => {
    fetchSlides();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (total > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, 5000); // Slightly longer interval for better UX
      return () => clearInterval(interval);
    }
  }, [total]);

  return (
    <div className="w-full h-[1210px] lg:h-[1330px] bg-cover bg-top bg-[url('/hero-1/bg-mobile.jpeg')] sm:bg-[url('/hero-1/bg-desktop.jpeg')] bg-no-repeat">
      <Navbar />
      <div className='relative z-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center gap-6 px-4 pt-20 '>
        <div className='mb-20 max-h-80 sm:max-h-96 md:max-h-112'>
          {loading ? (
            // Loading state
            <div className="absolute left-0 right-0 top-0 h-64 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
              <p className="text-white text-sm mt-4">Loading...</p>
            </div>
          ) : slides.length === 0 ? (
            // Fallback when no slides available
            <div className="absolute left-0 right-0 top-0 h-64 flex flex-col justify-center">
              <h1 className="px-6 md:px-0 text-[2rem] md:text-[3.875rem] mb-6 text-gold leading-tight font-myanmar">
                {t('home.hero.fallback.title')}
              </h1>
              <p className="px-6 md:px-0 text-white text-[1rem] md:text-[1.2rem] mb-8 drop-shadow-lg">
                {t('home.hero.fallback.description')}
              </p>
              <div className="my-10">
                <Link href="/" className="bg-gold text-dark-blue font-semibold px-8 py-3 shadow hover:bg-transparent hover:text-gold hover:border-gold border border-gold transition-colors mt-8 mb-8">
                  {t('button')}
                </Link>
              </div>
            </div>
          ) : (
            slides.map((slide, idx) => {
              const localizedContent = getLocalizedContent(slide);
              return (
                <div
                  key={slide.id}
                  className={`absolute left-0 right-0 top-0 transition-opacity duration-700 ${current === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  style={{ minWidth: '100%' }}
                >
                  <div className="h-64 flex flex-col justify-center">
                    <h1 className="px-6 md:px-0 text-[2rem] md:text-[3.875rem] mb-6 text-gold leading-tight font-myanmar">
                      {localizedContent.title}
                    </h1>
                    <p className="px-6 md:px-0 text-white text-[1rem] md:text-[1.2rem] mb-8 drop-shadow-lg">
                      {localizedContent.description}
                    </p>
                  </div>
                  {/* <div className="my-10">
                    <Link href="/" className="bg-gold text-dark-blue font-semibold px-8 py-3 shadow hover:bg-transparent hover:text-gold hover:border-gold border border-gold transition-colors mt-8 mb-8">
                      {t('button')}
                    </Link>
                  </div> */}
                </div>
              );
            })
          )}
        </div>
        {slides.length > 1 && (
          <div className="pt-52 md:pt-72">
            <button
              aria-label={t('home.hero.previous')}
              onClick={() => goTo(current - 1)}
              className="p-2 transition-colors cursor-pointer"
            >
              <PrevArrow />
            </button>
            <button
              aria-label={t('home.hero.next')}
              onClick={() => goTo(current + 1)}
              className="p-2 transition-colors cursor-pointer"
            >
              <NextArrow />
            </button>
          </div>
        )}
      </div>
      <div className="pt-40 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 justify-center items-stretch px-4 pb-12">
        <Card
          image="/card/card-1.jpeg"
          title={t('home.cards.retirement.title')}
          description={t('home.cards.retirement.description')}
          buttonText={t('button')}
          buttonHref="/nursing-home"
        />
        <Card
          image="/card/card-2.jpeg"
          title={t('home.cards.adapted.title')}
          description={t('home.cards.adapted.description')}
          buttonText={t('button')}
          buttonHref="/adapted-stay"
        />
      </div>
    </div>
  );
}
