'use client';
import React, { useState } from 'react';
import Image from 'next/image';
// import Icons from '../CardsIcons';
import { useTranslations } from 'next-intl';

const galleryImages = [
  '/home/gallery/1.png',
  '/home/gallery/2.png',
  '/home/gallery/3.png',
  '/home/gallery/4.png',
  '/home/gallery/5.png'
];


export default function VerticalGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState('');
  const t = useTranslations('frontend.gallery');

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const openPopup = (imageSrc: string) => {
    setPopupImage(imageSrc);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupImage('');
  };

  const ArrowLeft = () => (
    <svg className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const ArrowRight = () => (
    <svg className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Desktop: vertical thumbs left, main image right; Mobile: main image, horizontal thumbs below
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="w-full pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-3xl md:max-w-3xl lg:max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-24">
          {/* Header (mobile: centered, desktop: left + right arrows) */}
          <div className="mb-4 md:mb-8">
            <div className="text-center lg:text-left">
              <h2 className="text-dark-blue text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-myanmar mb-2 md:mb-4">
                {t('title')}
              </h2>
              <p className="text-gray text-sm sm:text-base md:text-lg xl:text-xl max-w-md md:max-w-lg mx-auto lg:mx-0 leading-relaxed">
                {/* A cat named mitedfsdfsdfsadasdasd dsfsf..s.df..sdfs */}
              </p>
            </div>
            {/* Desktop arrows top right */}
            <nav className="hidden lg:flex items-center gap-4 justify-end mt-4">
              <button
                onClick={goToPrevious}
                className="group p-3 text-dark-blue hover:text-gold transition-all duration-300 hover:scale-105"
                aria-label="Previous images"
              >
                <ArrowLeft />
              </button>
              <button
                onClick={goToNext}
                className="group p-3 text-dark-blue hover:text-gold transition-all duration-300 hover:scale-105"
                aria-label="Next images"
              >
                <ArrowRight />
              </button>
            </nav>
          </div>
          {/* Main gallery layout */}
          <div className="flex flex-col items-center lg:flex-row lg:items-start gap-4 md:gap-8">
            {/* Thumbnails (vertical on desktop, horizontal on mobile) */}
            <div className="hidden lg:flex flex-col gap-4 w-28">
              {galleryImages.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setCurrentIndex(idx)}
                  className={`overflow-hidden rounded-md border-2 ${idx === currentIndex ? 'border-gold' : 'border-transparent'} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold`}
                  style={{ opacity: idx === currentIndex ? 1 : 0.5 }}
                  aria-label={`Show image ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    width={100}
                    height={70}
                    className="object-cover w-full h-20"
                  />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="w-full flex flex-col items-center">
              <div className="relative w-full aspect-4/3 sm:aspect-video bg-gray-100 rounded-md overflow-hidden max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
                <Image
                  src={galleryImages[currentIndex]}
                  alt={`Gallery image ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 70vw, (min-width: 768px) 80vw, 100vw"
                  quality={90}
                  onClick={() => openPopup(galleryImages[currentIndex])}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              {/* Mobile thumbnails and arrows below image */}
              <div className="flex flex-col gap-2 w-full lg:hidden">
                <div className="flex gap-2 mt-3 md:mt-4 overflow-x-auto w-full justify-center">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => setCurrentIndex(idx)}
                      className={`shrink-0 w-14 h-10 sm:w-16 sm:h-12 md:w-20 md:h-16 rounded-md border-2 ${idx === currentIndex ? 'border-gold' : 'border-transparent'} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold`}
                      style={{ opacity: idx === currentIndex ? 1 : 0.5 }}
                      aria-label={`Show image ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        width={80}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
                <nav className="flex items-center justify-center gap-4 mt-2 md:mt-3">
                  <button
                    onClick={goToPrevious}
                    className="group p-3 text-dark-blue hover:text-gold transition-all duration-300 hover:scale-105"
                    aria-label="Previous images"
                  >
                    <ArrowLeft />
                  </button>
                  <button
                    onClick={goToNext}
                    className="group p-3 text-dark-blue hover:text-gold transition-all duration-300 hover:scale-105"
                    aria-label="Next images"
                  >
                    <ArrowRight />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup for full image */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closePopup}
        >
          <div className="relative max-w-6xl max-h-[95vh] w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={closePopup}
              className="absolute -top-12 right-0 z-10 text-white hover:text-gold transition-colors duration-300 p-2"
              aria-label="Close popup"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="relative w-full h-[85vh] overflow-hidden rounded-sm">
              <Image
                src={popupImage}
                alt="Gallery image full size"
                fill
                className="object-contain"
                sizes="100vw"
                quality={95}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}