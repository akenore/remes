'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Icons from '../CardsIcons';
import { useTranslations } from 'next-intl';

const galleryImages = [
  '/home/gallery/1.jpeg',
  '/home/gallery/2.jpeg',
  '/home/gallery/3.jpeg',
  '/home/gallery/4.jpeg',
  '/home/gallery/5.jpeg',
  '/home/gallery/6.jpeg',
  '/home/gallery/7.jpeg',
  '/home/gallery/8.jpeg',
  '/home/gallery/9.jpeg',
  '/home/gallery/10.jpeg'
];

interface MasonaryProps {
  showIcons?: boolean;
  showVideo?: boolean;
}

export default function Masonary({ showIcons = true }: MasonaryProps) {
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

  // Get images for current view
  const getCurrentImages = () => {
    const images = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentIndex + i) % galleryImages.length;
      images.push(galleryImages[index]);
    }
    return images;
  };

  const currentImages = getCurrentImages();

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

  const CloseIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      <section className="relative w-full min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/home/bg-m-2.jpg')] sm:bg-[url('/home/bg-d-2.jpg')]">
        <div className="w-full min-h-screen pt-20 pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <header className="text-center lg:text-left mb-12 lg:mb-16">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-gold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-myanmar mb-4 pt-20">
                    {t('title')}
                  </h2>
                  <p className="text-white text-sm sm:text-base lg:text-lg xl:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    {/* A cat named mitedfsdfsdfsadasdasd dsfsf..s.df..sdfs */}
                  </p>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-4">
                  <button
                    onClick={goToPrevious}
                    className="group p-3 text-white hover:text-gold transition-all duration-300 hover:scale-105"
                    aria-label="Previous images"
                  >
                    <ArrowLeft />
                  </button>
                  <button
                    onClick={goToNext}
                    className="group p-3 text-white hover:text-gold transition-all duration-300 hover:scale-105"
                    aria-label="Next images"
                  >
                    <ArrowRight />
                  </button>
                </nav>
              </div>
            </header>
            <div className="w-full">

              {/* Mobile Layout: 2x2 + 1 full width (up to md) */}
              <div className="block md:hidden">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                  {currentImages.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square w-full overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.98]"
                      onClick={() => openPopup(image)}
                    >
                      <Image
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw"
                        quality={75}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>

                {/* Fifth image full width */}
                <div
                  className="group relative aspect-16/10 w-full overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.99]"
                  onClick={() => openPopup(currentImages[4])}
                >
                  <Image
                    src={currentImages[4]}
                    alt="Gallery image 5"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Tablet Layout: 2 columns with different arrangements (md to lg) */}
              <div className="hidden md:block lg:hidden">
                <div className="grid grid-cols-2 gap-6 h-[70vh] max-h-[600px]">

                  {/* Left Column */}
                  <div className="flex flex-col gap-4">
                    <div
                      className="group relative flex-1 overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.98]"
                      onClick={() => openPopup(currentImages[0])}
                    >
                      <Image
                        src={currentImages[0]}
                        alt="Gallery image 1"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(min-width: 768px) and (max-width: 1024px) 50vw"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div
                      className="group relative flex-1 overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.98]"
                      onClick={() => openPopup(currentImages[1])}
                    >
                      <Image
                        src={currentImages[1]}
                        alt="Gallery image 2"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(min-width: 768px) and (max-width: 1024px) 50vw"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col gap-4">
                    <div
                      className="group relative flex-2 overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.98]"
                      onClick={() => openPopup(currentImages[2])}
                    >
                      <Image
                        src={currentImages[2]}
                        alt="Gallery image 3"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(min-width: 768px) and (max-width: 1024px) 50vw"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div
                        className="group relative overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.98]"
                        onClick={() => openPopup(currentImages[3])}
                      >
                        <Image
                          src={currentImages[3]}
                          alt="Gallery image 4"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(min-width: 768px) and (max-width: 1024px) 25vw"
                          quality={85}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div
                        className="group relative overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.98]"
                        onClick={() => openPopup(currentImages[4])}
                      >
                        <Image
                          src={currentImages[4]}
                          alt="Gallery image 5"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(min-width: 768px) and (max-width: 1024px) 25vw"
                          quality={85}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout: 3 columns masonry (lg+) */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-3 gap-6 h-[75vh] max-h-[700px]">

                  {/* Left Big Image */}
                  <div
                    className="group relative overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.98]"
                    onClick={() => openPopup(currentImages[0])}
                  >
                    <Image
                      src={currentImages[0]}
                      alt="Gallery image 1"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(min-width: 1024px) 33vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Center Column */}
                  <div className="flex flex-col gap-4">
                    <div
                      className="group relative flex-3 overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.98]"
                      onClick={() => openPopup(currentImages[1])}
                    >
                      <Image
                        src={currentImages[1]}
                        alt="Gallery image 2"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(min-width: 1024px) 33vw"
                        quality={90}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="flex-2 grid grid-cols-2 gap-4">
                      <div
                        className="group relative overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.98]"
                        onClick={() => openPopup(currentImages[2])}
                      >
                        <Image
                          src={currentImages[2]}
                          alt="Gallery image 3"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(min-width: 1024px) 16vw"
                          quality={90}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div
                        className="group relative overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.98]"
                        onClick={() => openPopup(currentImages[3])}
                      >
                        <Image
                          src={currentImages[3]}
                          alt="Gallery image 4"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(min-width: 1024px) 16vw"
                          quality={90}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Right Big Image */}
                  <div
                    className="group relative overflow-hidden rounded-sm bg-gray-800 cursor-pointer transition-transform duration-300 hover:scale-[0.98]"
                    onClick={() => openPopup(currentImages[4])}
                  >
                    <Image
                      src={currentImages[4]}
                      alt="Gallery image 5"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(min-width: 1024px) 33vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>
            <nav className="lg:hidden flex items-center justify-center gap-6 mt-8">
              <button
                onClick={goToPrevious}
                className="group p-3 text-white hover:text-gold transition-all duration-300 hover:scale-105"
                aria-label="Previous images"
              >
                <ArrowLeft />
              </button>
              <button
                onClick={goToNext}
                className="group p-3 text-white hover:text-gold transition-all duration-300 hover:scale-105"
                aria-label="Next images"
              >
                <ArrowRight />
              </button>
            </nav>
          </div>
          {showIcons && <Icons />}
        </div>
      </section>

      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closePopup}
        >
          <div className="relative max-w-6xl max-h-[95vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closePopup}
              className="absolute -top-12 right-0 z-10 text-white hover:text-gold transition-colors duration-300 p-2"
              aria-label="Close popup"
            >
              <CloseIcon />
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
    </>
  );
}