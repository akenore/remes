'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ImagePickerModal from './ImagePickerModal';

interface CoverImageSelectorProps {
  currentImageUrl?: string | null;
  onImageChange: (file: File | null, url?: string) => void;
  onImageRemove: () => void;
}

export default function CoverImageSelector({ 
  currentImageUrl, 
  onImageChange, 
  onImageRemove 
}: CoverImageSelectorProps) {
  const t = useTranslations('admin.posts');
  const locale = useLocale();
  const [showImageModal, setShowImageModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);
  };

  const handleImageFromLibrary = (url: string, title: string) => {
    // When selecting from library, we don't have a File object, just the URL
    onImageChange(null, url);
    setShowImageModal(false);
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('add.form.coverImage')}
          </h3>
          
          {!currentImageUrl ? (
            <div className="space-y-4">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <label htmlFor="cover_image_upload" className="cursor-pointer">
                    <span className="block text-sm font-medium text-gray-900">
                      {t('add.form.clickToUpload')}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {t('add.form.imageFormats')}
                    </span>
                    <input
                      id="cover_image_upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {locale === 'fr' ? 'ou' : 'or'}
                  </span>
                </div>
              </div>

              {/* Library Selection */}
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {locale === 'fr' ? 'Choisir depuis la bibliothèque' : 'Choose from Library'}
              </button>
            </div>
          ) : (
            <div className="relative">
              <img
                src={currentImageUrl}
                alt={t('add.form.imagePreview')}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={onImageRemove}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Change Image Options */}
              <div className="mt-3 flex space-x-3">
                <label htmlFor="cover_image_change" className="cursor-pointer">
                  <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {locale === 'fr' ? 'Télécharger une nouvelle' : 'Upload New'}
                  </span>
                  <input
                    id="cover_image_change"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {locale === 'fr' ? 'Choisir depuis la bibliothèque' : 'Choose from Library'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Picker Modal */}
      <ImagePickerModal
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
        onSelect={handleImageFromLibrary}
      />
    </>
  );
} 