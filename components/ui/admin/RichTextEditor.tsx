'use client';

import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { pb } from '@/lib/pocketbase';
import { useTranslations, useLocale } from 'next-intl';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  postId?: string; // For existing posts
}

interface CollectionImage {
  id: string;
  cover_image: string;
  title: string;
  created: string;
  collection: 'media' | 'posts';
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder,
  className = ''
}: RichTextEditorProps) {
  const t = useTranslations('admin.richTextEditor');
  const locale = useLocale();
  const defaultPlaceholder = placeholder || t('placeholder');
  const [isMounted, setIsMounted] = useState(false);
  const [collectionImages, setCollectionImages] = useState<CollectionImage[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
  const [uploading, setUploading] = useState(false);
  
  const editorRef = useRef<any>(null);

  // Language config for TinyMCE
  const tinymceLang = locale === 'fr' ? 'fr_FR' : 'en';
  const tinymceLangUrl =
    locale === 'fr'
      ? 'https://cdn.jsdelivr.net/npm/tinymce-i18n/langs6/fr_FR.js'
      : undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch images from both media and posts collections
  const fetchCollectionImages = async () => {
    try {
      const allImages: CollectionImage[] = [];

      // Fetch from media collection with better error handling and pagination
      try {
        const mediaResult = await pb.collection('media').getList(1, 100, {
          sort: '-created',
          fields: 'id,file,created,author',
          requestKey: null // Prevent request caching issues
        });
        
        if (mediaResult.items && mediaResult.items.length > 0) {
          const mediaImages = mediaResult.items
            .filter(item => {
              const hasFile = item.file && Array.isArray(item.file) && item.file.length > 0;
              return hasFile;
            })
            .map(item => ({
              id: item.id,
              cover_image: item.file[0], // media collection uses 'file' array, get first file
              title: `Media Image ${item.id.slice(-6)}`, // Generate a simple title
              created: item.created,
              collection: 'media' as const
            }));
          
          allImages.push(...mediaImages);
        }
      } catch (error: any) {
        // Continue silently - media collection might not exist or have permission issues
      }

      // Fetch from posts with cover images (excluding rich text images)
      try {
        const postsResult = await pb.collection('posts').getList(1, 50, {
          sort: '-created',
          filter: 'cover_image != ""', // Get all posts with cover images
          fields: 'id,cover_image,title,created',
          requestKey: null // Prevent request caching issues
        });
        
        if (postsResult.items && postsResult.items.length > 0) {
          const postImages = postsResult.items
            .filter(item => item.cover_image && item.cover_image.trim() !== '') // Only include items with cover images
            .map(item => ({
              id: item.id,
              cover_image: item.cover_image,
              title: item.title || `Post ${item.id.slice(-6)}`,
              created: item.created,
              collection: 'posts' as const
            }));
          
          allImages.push(...postImages);
        }
      } catch (error) {
        // Continue silently
      }

      // Sort all images by creation date (newest first)
      allImages.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      
      setCollectionImages(allImages);
    } catch (error) {
      setCollectionImages([]); // Set empty array on error
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File, success: (url: string) => void, failure: (error: string) => void) => {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        failure(t('imageModal.errors.invalidFile'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        failure(t('imageModal.errors.fileTooLarge'));
        return;
      }

      // Check authentication
      if (!pb.authStore.isValid) {
        throw new Error('User not authenticated. Please log in first.');
      }

      // Ensure we have author ID
      const authorId = pb.authStore.model?.id;
      if (!authorId) {
        throw new Error('Author ID not found. Please log in again.');
      }

      // Upload image to media collection
        const formData = new FormData();
      formData.append('file', file, file.name);

      // Create the record in media collection
      const record = await pb.collection('media').create(formData);
      
      // Generate the image URL
      const imageUrl = pb.files.getURL(record, record.file);
      
      success(imageUrl);
      
      // Refresh collection images
      fetchCollectionImages();

    } catch (error: any) {
      let errorMessage = 'Unknown error occurred';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.data) {
          const errorData = error.response.data.data;
          const errorFields = Object.keys(errorData);
          if (errorFields.length > 0) {
            const firstField = errorFields[0];
            const fieldError = errorData[firstField];
            errorMessage = `${firstField}: ${fieldError.message || fieldError.code || 'Validation error'}`;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      failure(`${t('imageModal.errors.uploadFailed')}: ${errorMessage}`);
    }
  };

  // New: open modal after images are loaded
  const openImageModal = async () => {
    await fetchCollectionImages();
    setShowImageModal(true);
  };
            
  // New: handle image insert from modal
  const handleInsertImageFromModal = (url: string, title: string) => {
    if (editorRef.current) {
      editorRef.current.insertContent(`<img src="${url}" alt="${title}" style="max-width:100%;" />`);
    }
      setShowImageModal(false);
  };

  // Replace TinyMCE image handler to open our modal
  const imageHandler = () => {
    openImageModal();
  };

  // TinyMCE configuration
  const init = {
    apiKey: 'pg6me9oxkjckfoljxo0v0oi3yypu9oy3okpbajeyh5l4gud9',
    height: 500,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', /*'image',*/ 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | customimage | bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    placeholder: defaultPlaceholder,
    language: tinymceLang,
    language_url: tinymceLangUrl,
    images_upload_handler: (blobInfo: { blob: () => File }) => {
      return new Promise<string>((resolve, reject) => {
        const file = blobInfo.blob();
        handleImageUpload(file, resolve, reject);
        });
    },
    file_picker_callback: undefined, // Remove default
    setup: (editor: any) => {
      editorRef.current = editor;
      editor.ui.registry.addButton('customimage', {
        icon: 'image',
        tooltip: 'Insert image',
        onAction: imageHandler,
      });
      editor.on('init', () => {
        fetchCollectionImages();
      });
    }
  };

  if (!isMounted) {
    return (
      <div className="border border-gray-300 rounded-md p-4 min-h-[200px] animate-pulse bg-gray-50" />
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <Editor
        apiKey={init.apiKey}
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={init}
      />
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{locale === 'fr' ? 'Sélectionner une image' : 'Select Image'}</h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Tabs */}
            <div className="flex border-b">
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'library' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {locale === 'fr' ? 'Bibliothèque' : 'Media Library'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'upload' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {locale === 'fr' ? 'Télécharger' : 'Upload'}
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'upload' ? (
                <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                      if (file) {
                        setUploading(true);
                        await handleImageUpload(file, (url) => {
                          setUploading(false);
                          handleInsertImageFromModal(url, file.name);
                        }, (err) => {
                          setUploading(false);
                          alert(err);
                        });
                      }
                      }}
                      className="hidden"
                    id="image-upload-modal"
                      disabled={uploading}
                    />
                  <label htmlFor="image-upload-modal" className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      <span className="mt-2 text-sm text-indigo-600 font-medium">{uploading ? (locale === 'fr' ? 'Téléchargement...' : 'Uploading...') : (locale === 'fr' ? 'Cliquez pour télécharger' : 'Click to upload')}</span>
                      <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
                      </div>
                    </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {collectionImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {collectionImages.map((image) => (
                        <div
                          key={image.id}
                          onClick={() => handleInsertImageFromModal(pb.files.getURL({ id: image.id, collectionName: image.collection }, image.cover_image), image.title)}
                          className="group relative cursor-pointer border border-gray-200 rounded-lg p-2 hover:border-indigo-500 hover:shadow-md transition-all"
                        >
                          <div className="aspect-square overflow-hidden rounded-md bg-gray-100 relative">
                            <img
                              src={pb.files.getURL({ id: image.id, collectionName: image.collection }, image.cover_image)}
                              alt={image.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {/* Collection type badge */}
                            <div className={`absolute top-1 right-1 px-1.5 py-0.5 text-xs font-medium rounded-full text-white shadow-sm ${
                              image.collection === 'media' 
                                ? 'bg-green-500' 
                                : 'bg-blue-500'
                            }`}>
                              {image.collection === 'media' ? '📁' : '📄'}
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-gray-600 truncate" title={image.title}>
                            {image.title}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">
                            {image.collection === 'media' ? 'Media Library' : 'Post Image'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2">{locale === 'fr' ? 'Aucune image téléchargée' : 'No images uploaded yet'}</p>
                      <p className="text-sm">{locale === 'fr' ? 'Téléchargez votre première image pour la voir ici' : 'Upload your first image to see it here'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {locale === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 