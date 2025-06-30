'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const galleryImages = [
  '/home/gallery/1.png',
  '/home/gallery/2.png', 
  '/home/gallery/3.png',
  '/home/gallery/4.png',
  '/home/gallery/5.png'
];

export default function Masonary() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState('');

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
    <svg className="w-6 h-6 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ArrowRight = () => (
    <svg className="w-6 h-6 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CloseIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <>
      <div className="w-full min-h-[1610px] lg:min-h-[1750px] bg-cover bg-top bg-[url('/home/bg-m-2.jpg')] sm:bg-[url('/home/bg-d-2.jpg')] bg-no-repeat flex flex-col justify-between">
        <div className="container md:mx-4 xl:mx-auto pt-62 max-w-7xl">
          {/* Header with Navigation */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div className="mb-8 md:mb-0">
              <h2 className="text-[var(--gold)] text-[2.125rem] md:text-[3.25rem] font-[var(--font-myanmar)] text-center md:text-left">Notre Gallerie</h2>
              <p className="text-white text-[0.938rem] md:text-[1.375rem] max-w-md text-center md:text-left">
                A cat named mitedfsdfsdfsadasdasd
                dsfsf..s.df..sdfs
              </p>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center md:justify-end space-x-6">
              <button
                onClick={goToPrevious}
                className="text-white hover:text-[var(--gold)] transition-colors duration-300 p-2 md:p-3"
                aria-label="Previous images"
              >
                <ArrowLeft />
              </button>
              <button
                onClick={goToNext}
                className="text-white hover:text-[var(--gold)] transition-colors duration-300 p-2 md:p-3"
                aria-label="Next images"
              >
                <ArrowRight />
              </button>
            </div>
          </div>

          {/* Gallery Grid - Mobile: 2x2 Grid, Desktop: 3 Column Layout */}
          <div className="px-4 md:px-0">
            {/* Mobile Layout - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-4 h-[400px] lg:hidden">
              {/* Top Row - 2 images */}
              <div
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => openPopup(currentImages[0])}
              >
                <Image
                  src={currentImages[0]}
                  alt="Gallery image 1"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
              <div
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => openPopup(currentImages[1])}
              >
                <Image
                  src={currentImages[1]}
                  alt="Gallery image 2"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
              
              {/* Bottom Row - 2 images */}
              <div
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => openPopup(currentImages[2])}
              >
                <Image
                  src={currentImages[2]}
                  alt="Gallery image 3"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
              <div
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => openPopup(currentImages[3])}
              >
                <Image
                  src={currentImages[3]}
                  alt="Gallery image 4"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </div>

            {/* Mobile - 5th Image Below (Full width of grid) */}
            <div className="lg:hidden mt-4">
              <div
                className="relative overflow-hidden cursor-pointer group h-[200px]"
                onClick={() => openPopup(currentImages[4])}
              >
                <Image
                  src={currentImages[4]}
                  alt="Gallery image 5"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </div>

            {/* Desktop Layout: Left Big - Center (1 medium + 2 small) - Right Big */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-4 h-[600px]">
              {/* Left Big Image */}
              <div 
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => openPopup(currentImages[0])}
              >
                <Image
                  src={currentImages[0]}
                  alt="Gallery image 1"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>

              {/* Center Column - 1 Medium Top + 2 Small Bottom */}
              <div className="grid grid-rows-2 gap-4">
                {/* Top Medium Image */}
                <div
                  className="relative overflow-hidden cursor-pointer group"
                  onClick={() => openPopup(currentImages[1])}
                >
                  <Image
                    src={currentImages[1]}
                    alt="Gallery image 2"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>

                {/* Bottom Row - 2 Small Images */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="relative overflow-hidden cursor-pointer group"
                    onClick={() => openPopup(currentImages[2])}
                  >
                    <Image
                      src={currentImages[2]}
                      alt="Gallery image 3"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="16vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <div
                    className="relative overflow-hidden cursor-pointer group"
                    onClick={() => openPopup(currentImages[3])}
                  >
                    <Image
                      src={currentImages[3]}
                      alt="Gallery image 4"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="16vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                </div>
              </div>

              {/* Right Big Image */}
              <div 
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => openPopup(currentImages[4])}
              >
                <Image
                  src={currentImages[4]}
                  alt="Gallery image 5"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </div>
          </div>

          {/* Mobile Navigation - Bottom */}
          <div className="flex md:hidden items-center justify-center space-x-6 mt-8">
            <button
              onClick={goToPrevious}
              className="text-white hover:text-[var(--gold)] transition-colors duration-300 p-2"
              aria-label="Previous images"
            >
              <ArrowLeft />
            </button>
            <button
              onClick={goToNext}
              className="text-white hover:text-[var(--gold)] transition-colors duration-300 p-2"
              aria-label="Next images"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={closePopup}
              className="absolute -top-12 right-0 text-white hover:text-[var(--gold)] transition-colors duration-300"
              aria-label="Close popup"
            >
              <CloseIcon />
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={popupImage}
                alt="Gallery image full size"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}