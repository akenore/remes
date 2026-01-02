'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Card from '../card/Card';
import Navbar from '../Navbar';
import KoalendarButton from '../../KoalendarButton';
import { HiOutlineSparkles } from 'react-icons/hi';
import { FaStar, FaShieldAlt, FaHeart, FaCalendar, FaArrowRight } from 'react-icons/fa';
import { IoAirplane } from 'react-icons/io5';
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

  const staticContent = {
    badge: t('home.hero.badge'),
    subtitle: t('home.hero.subtitle'),
    points: [
      { icon: <FaStar className="text-gold" />, text: t('home.hero.points.p1') },
      { icon: <FaShieldAlt className="text-gold" />, text: t('home.hero.points.p2') },
      { icon: <FaHeart className="text-gold" />, text: t('home.hero.points.p3') }
    ]
  };

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

  const renderSlideContent = (title: string, description: string) => (
    <div className="flex flex-col items-center md:items-start text-center md:text-left transition-all duration-700">
      <span className="max-w-fit inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium text-gold bg-dark-gold/10 border border-gold/30 shadow-[0_0_0_1px_rgba(251,191,36,0.15),0_0_20px_rgba(251,191,36,0.15)] backdrop-blur-sm mb-6 animate-fade-in">
        <HiOutlineSparkles className="w-4 h-4" />
        {staticContent.badge}
      </span>

      <h1 className="px-6 md:px-0 text-[2rem] mb-4 text-gold leading-tight font-myanmar max-w-2xl drop-shadow-md">
        {title}
      </h1>

      <p className="px-6 md:px-0 text-white text-[1.1rem] md:text-[1.5rem] mb-4 font-medium max-w-2xl drop-shadow-lg">
        {staticContent.subtitle}
      </p>

      <p className="px-6 md:px-0 text-slate-200 text-[1rem] md:text-[1.2rem] mb-10 drop-shadow-lg max-w-xl leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10 px-4 md:px-0">
        {staticContent.points.map((point, i) => (
          <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm transition-hover hover:border-white/20">
            {point.icon}
            <span className="text-white text-xs md:text-sm font-medium whitespace-nowrap">{point.text}</span>
          </div>
        ))}
      </div>

      <div className="mb-8 px-6 md:px-0">
        <KoalendarButton className='bg-gold hover:bg-dark-blue hover:text-white cursor-pointer text-dark-blue font-bold text-[1.1rem] py-4 px-10 rounded-full flex items-center gap-3 transition-all duration-300 shadow-lg shadow-amber-500/20 transform hover:scale-105'>
          <FaCalendar /> {t('home.hero.buttonCTA')} <FaArrowRight />
        </KoalendarButton>
      </div>
    </div>
  );

  return (
    <div className="relative w-full flex flex-col overflow-visible pb-12 ">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-1/bg-desktop.jpeg"
          alt=""
          fill
          priority
          fetchPriority="high"
          className="object-cover object-top hidden sm:block"
        />
        <Image
          src="/hero-1/bg-mobile.jpeg"
          alt=""
          fill
          priority
          fetchPriority="high"
          className="object-cover object-top sm:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
      </div>

      <Navbar />

      <div className='relative z-10 w-full max-w-7xl mx-auto px-4 md:-mt-32'>
        <div className='min-h-[850px] md:min-h-[800px] lg:min-h-[750px] relative flex items-center pb-32 md:pb-0'>
          {slides.length === 0 ? (
            <div className="relative w-full flex flex-col items-center md:items-start justify-center">
              {renderSlideContent(t('home.hero.fallback.title'), t('home.hero.fallback.description'))}
            </div>
          ) : (
            slides.map((slide, idx) => {
              const localizedContent = getLocalizedContent(slide);
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col items-center md:items-start justify-center ${current === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                >
                  <div className="pb-12 md:pb-0">
                    {renderSlideContent(localizedContent.title, localizedContent.description)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {slides.length > 1 && (
          <div className="flex justify-center md:justify-start gap-8 mt-12 mb-20 px-6 md:px-0">
            <button
              aria-label={t('home.hero.previous')}
              onClick={() => goTo(current - 1)}
              className="group p-3 rounded-full border border-white/30 hover:border-gold transition-colors duration-300"
            >
              <PrevArrow />
            </button>
            <button
              aria-label={t('home.hero.next')}
              onClick={() => goTo(current + 1)}
              className="group p-3 rounded-full border border-white/30 hover:border-gold transition-colors duration-300"
            >
              <NextArrow />
            </button>
          </div>
        )}
      </div>

      {/* <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 justify-center items-stretch px-4">
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
      </div> */}
    </div>
  );
}
