'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Card from '../card/Card';
import Navbar from '../Navbar';
import KoalendarButton from '../../KoalendarButton';
import type { HomeSlide } from '@/lib/home-data';

interface HeroProps {
  initialSlides?: HomeSlide[];
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

export default function Hero({ initialSlides = [] }: HeroProps) {
  const t = useTranslations('frontend');
  const locale = useLocale();
  const [current, setCurrent] = useState(0);
  const [slides] = useState<HomeSlide[]>(initialSlides);
  const total = slides.length;
  const goTo = (idx: number) => setCurrent((idx + total) % total);

  const getLocalizedContent = (slide: HomeSlide) => {
    const isFrench = locale === 'fr';
    return {
      title: isFrench && slide.title_fr ? slide.title_fr : slide.title,
      description: isFrench && slide.description_fr ? slide.description_fr : slide.description
    };
  };

  useEffect(() => {
    if (total > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [total]);

  return (
    <div className="relative w-full h-[1210px] lg:h-[1330px]">
      <Image
        src="/hero-1/bg-desktop.jpeg"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-top -z-10 hidden sm:block"
      />
      <Image
        src="/hero-1/bg-mobile.jpeg"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-top -z-10 sm:hidden"
      />
      <Navbar />
      <div className='relative z-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center gap-6 px-4 pt-20 '>
        <div className='mb-20 max-h-80 sm:max-h-96 md:max-h-112'>
          {slides.length === 0 ? (
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
                  <div className="my-10">
                    <KoalendarButton className='cursor-pointer bg-gold text-dark-blue font-semibold px-8 py-3 shadow hover:bg-transparent hover:text-gold hover:border-gold border border-gold transition-colors mt-8 mb-8' />
                  </div>
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
