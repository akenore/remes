'use client';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Card from '../card/Card';
import Navbar from '../Navbar';

const carouselSlides = [
  {
    headline: 'Un lieu de vie, de soin et de serenite',
    subheadline: 'Une résidence médicalisée haut de gamme en bord de mer, dédiée au confort, aux soins et à la sérénité.',
    buttonText: 'En savoir plus'
  },
  {
    headline: 'Un accompagnement personnalisé',
    subheadline: 'Des équipes médicales et paramédicales à votre écoute, pour un suivi adapté à chaque résident.',
    buttonText: 'En savoir plus'
  },
  {
    headline: 'Confort et sécurité au quotidien',
    subheadline: 'Des espaces de vie modernes, sécurisés et pensés pour le bien-être de tous.',
    buttonText: 'En savoir plus'
  }
];

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
  const [current, setCurrent] = useState(0);
  const total = carouselSlides.length;
  const goTo = (idx: number) => setCurrent((idx + total) % total);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 3500);
    return () => clearInterval(interval);
  }, [total]);

  return (
    <div className="w-full h-[1210px] lg:h-[1330px] bg-cover bg-top bg-[url('/hero-1/bg-mobile.jpg')] sm:bg-[url('/hero-1/bg-desktop.jpg')] bg-no-repeat">
      <Navbar />
      <div className='relative z-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center gap-6 px-4 pt-20 '>
        <div className='mb-20 max-h-80 sm:max-h-96 md:max-h-[28rem]'>
          {carouselSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute left-0 right-0 top-0 transition-opacity duration-700 ${current === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              style={{ minWidth: '100%' }}
            >
              <div className="h-64 flex flex-col justify-center">
                <h1 className="px-6 md:px-0 text-[2rem] md:text-[3.875rem] mb-6 text-gold leading-tight font-myanmar">{slide.headline}</h1>
                <p className="px-6 md:px-0 text-white text-[1rem] md:text-[1.2rem] mb-8 drop-shadow-lg">{slide.subheadline}</p>
              </div>
              {slide.buttonText && (
                <div className="mb-10">
                  <button className="bg-gold text-dark-blue font-semibold px-8 py-3 shadow hover:bg-transparent hover:text-gold hover:border-gold border border-gold transition-colors mt-8 mb-8">
                    {t('button')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
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
      </div>
      <div className="pt-40 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 justify-center items-stretch px-4 pb-12">
        <Card
          image="/card/card-1.jpg"
          title={t('home.cards.retirement.title')}
          description={t('home.cards.retirement.description')}
          buttonText={t('button')}
          buttonHref="/retirement-home"
        />
        <Card
          image="/card/card-1.jpg"
          title={t('home.cards.adapted.title')}
          description={t('home.cards.adapted.description')}
          buttonText={t('button')}
          buttonHref="/adapted-stay"
        />
      </div>
    </div>
  );
}
