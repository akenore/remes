'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { pb } from '@/lib/pocketbase';
import { useTranslations } from 'next-intl';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="border border-gray-300 rounded-md p-4 min-h-[200px] animate-pulse bg-gray-50" />
});

// Import Quill styles
import 'react-quill-new/dist/quill.snow.css';

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

interface ImageSettings {
  url: string;
  alt: string;
  width: number;
  height: number;
  alignment: 'left' | 'center' | 'right' | 'none';
  size: 'thumbnail' | 'medium' | 'large' | 'full' | 'custom';
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder,
  className = '',
  postId
}: RichTextEditorProps) {
  const t = useTranslations('admin.richTextEditor');
  const defaultPlaceholder = placeholder || t('placeholder');
  const [isMounted, setIsMounted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'collection'>('upload');
  const [collectionImages, setCollectionImages] = useState<CollectionImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Image configuration state
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [showImageSettings, setShowImageSettings] = useState(false);
  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    url: '',
    alt: '',
    width: 0,
    height: 0,
    alignment: 'none',
    size: 'medium'
  });
  const [originalImageDimensions, setOriginalImageDimensions] = useState({ width: 0, height: 0 });
  
  // Use refs to store Quill instance and ReactQuill component
  const quillRef = useRef<any>(null);
  const reactQuillRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Optional: Cleanup old rich text images (can be called manually if needed)
  const cleanupOldRichTextImages = async () => {
    try {
      // Find rich text images older than 7 days that might be orphaned
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const oldImages = await pb.collection('posts').getList(1, 100, {
        filter: `title ~ "[RICH_TEXT_IMG]" && created < "${weekAgo}"`,
        fields: 'id,title,created'
      });

      console.log(`Found ${oldImages.items.length} old rich text images that could be cleaned up`);
      
      // Note: We don't auto-delete them as they might still be referenced in content
      // This is just for monitoring - manual cleanup can be done through admin if needed
    } catch (error) {
      console.error('Error checking for old rich text images:', error);
    }
  };

  // Get image dimensions
  const getImageDimensions = (imageUrl: string): Promise<{width: number, height: number}> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        resolve({ width: 800, height: 600 }); // Default fallback
      };
      img.src = imageUrl;
    });
  };

  // Calculate size dimensions based on preset
  const calculateDimensions = (originalWidth: number, originalHeight: number, size: string) => {
    const maxSizes = {
      thumbnail: 150,
      medium: 300,
      large: 600,
      full: Math.max(originalWidth, originalHeight)
    };

    if (size === 'custom') {
      return { width: originalWidth, height: originalHeight };
    }

    const maxSize = maxSizes[size as keyof typeof maxSizes] || 300;
    const aspectRatio = originalWidth / originalHeight;

    if (originalWidth > originalHeight) {
      return {
        width: Math.min(maxSize, originalWidth),
        height: Math.min(maxSize, originalWidth) / aspectRatio
      };
    } else {
      return {
        width: Math.min(maxSize, originalHeight) * aspectRatio,
        height: Math.min(maxSize, originalHeight)
      };
    }
  };

  // Fetch images from posts collection only (simpler approach)
  const fetchCollectionImages = async () => {
    setLoadingImages(true);
    try {
      // Only fetch from posts with cover images (removing media collection fetch to avoid 403)
      const postsResult = await pb.collection('posts').getList(1, 25, {
        sort: '-created',
        filter: 'cover_image != "" && title !~ "[RICH_TEXT_IMG]"', // Exclude old rich text images
        fields: 'id,cover_image,title,created'
      });
      
      console.log('Fetched images from posts:', postsResult.items.length);
      
      const postImages = postsResult.items.map(item => ({
        id: item.id,
        cover_image: item.cover_image,
        title: item.title || 'Untitled',
        created: item.created,
        collection: 'posts' as const
      }));
      
      setCollectionImages(postImages);
    } catch (error) {
      console.error('Failed to fetch collection images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        alert(t('imageModal.errors.invalidFile'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(t('imageModal.errors.fileTooLarge'));
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

      console.log('User authenticated:', pb.authStore.model?.email);
      console.log('Auth token exists:', !!pb.authStore.token);
      console.log('Author ID:', authorId);
      console.log('Uploading file:', file.name, file.type, file.size);

      // Create post record for the image (like it was working before)
      const formData = new FormData();
      
      // Add the cover_image field (this was working before)
      formData.append('cover_image', file, file.name);
      
      // Add a clean title (no more [RICH_TEXT_IMG] prefix)
      const title = file.name.replace(/\.[^/.]+$/, "");
      formData.append('title', `📷 ${title}`); // Just add camera emoji to identify it
      
      // Add other required fields
      formData.append('content', 'Rich text editor image');
      formData.append('status', 'published');
      formData.append('author', authorId); // Use the verified author ID
      formData.append('slug', `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`); // Add required slug field

      console.log('FormData prepared with fields:');
      for (let pair of formData.entries()) {
        console.log(`- ${pair[0]}:`, pair[1] instanceof File ? `File(${pair[1].name}, ${pair[1].size} bytes)` : pair[1]);
      }
      
      console.log('Attempting upload to posts collection...');
      
      const postRecord = await pb.collection('posts').create(formData);
      const imageUrl = pb.files.getURL(postRecord, postRecord.cover_image);
      
      console.log('Image uploaded successfully to posts collection:', imageUrl);
      
      // Show image settings modal
      await showImageSettingsModal(imageUrl);
      
      // Refresh collection images
      fetchCollectionImages();
      
    } catch (error: any) {
      console.error('=== Image upload failed ===');
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      
      let errorMessage = 'Unknown error';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`${t('imageModal.errors.uploadFailed')}: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // Insert image into Quill editor with settings
  const insertImageIntoEditor = useCallback((settings: ImageSettings) => {
    console.log('=== Starting image insertion ===');
    console.log('Image settings:', settings);
    console.log('ReactQuill ref:', !!reactQuillRef.current);
    console.log('Quill ref:', !!quillRef.current);
    
    // Create image HTML with all settings
    const createImageHtml = (settings: ImageSettings) => {
      const { url, alt, width, height, alignment } = settings;
      
      let style = `max-width: none;`; // Don't constrain by default
      if (width && height) {
        style = `width: ${Math.round(width)}px; height: ${Math.round(height)}px; max-width: none;`;
      }
      
      let alignmentStyle = '';
      if (alignment === 'center') {
        alignmentStyle = ' display: block; margin-left: auto; margin-right: auto;';
      } else if (alignment === 'left') {
        alignmentStyle = ' float: left; margin-right: 15px; margin-bottom: 10px;';
      } else if (alignment === 'right') {
        alignmentStyle = ' float: right; margin-left: 15px; margin-bottom: 10px;';
      }
      
      const finalStyle = style + alignmentStyle;
      const widthAttr = width ? ` width="${Math.round(width)}"` : '';
      const heightAttr = height ? ` height="${Math.round(height)}"` : '';
      
      return `<img src="${url}" alt="${alt || 'Image'}" style="${finalStyle}"${widthAttr}${heightAttr} />`;
    };

    // Method 1: Try using the stored quill reference
    if (quillRef.current) {
      try {
        console.log('Method 1: Using stored quill reference');
        const length = quillRef.current.getLength();
        const insertIndex = Math.max(0, length - 1);
        console.log('Inserting at index:', insertIndex, 'of', length);
        
        quillRef.current.insertEmbed(insertIndex, 'image', settings.url);
        
        // Add custom attributes to the inserted image with multiple attempts
        const applyImageAttributes = (attempt = 0) => {
          const images = document.querySelectorAll('.ql-editor img[src="' + settings.url + '"]');
          const lastImage = images[images.length - 1] as HTMLImageElement;
          
          if (lastImage) {
            console.log('Applying image attributes, attempt:', attempt + 1);
            lastImage.alt = settings.alt || 'Image';
            
            // Apply size settings with !important styles
            if (settings.width && settings.height) {
              const width = Math.round(settings.width);
              const height = Math.round(settings.height);
              
              lastImage.style.setProperty('width', width + 'px', 'important');
              lastImage.style.setProperty('height', height + 'px', 'important');
              lastImage.style.setProperty('max-width', 'none', 'important');
              
              // Also set as attributes for persistence
              lastImage.setAttribute('width', width.toString());
              lastImage.setAttribute('height', height.toString());
            }
            
            // Apply alignment settings
            if (settings.alignment && settings.alignment !== 'none') {
              if (settings.alignment === 'center') {
                lastImage.style.setProperty('display', 'block', 'important');
                lastImage.style.setProperty('margin-left', 'auto', 'important');
                lastImage.style.setProperty('margin-right', 'auto', 'important');
              } else if (settings.alignment === 'left') {
                lastImage.style.setProperty('float', 'left', 'important');
                lastImage.style.setProperty('margin-right', '15px', 'important');
                lastImage.style.setProperty('margin-bottom', '10px', 'important');
              } else if (settings.alignment === 'right') {
                lastImage.style.setProperty('float', 'right', 'important');
                lastImage.style.setProperty('margin-left', '15px', 'important');
                lastImage.style.setProperty('margin-bottom', '10px', 'important');
              }
            }
            
            console.log('Image attributes applied successfully');
          } else if (attempt < 5) {
            // Retry up to 5 times with increasing delays
            setTimeout(() => applyImageAttributes(attempt + 1), 50 * (attempt + 1));
          } else {
            console.warn('Failed to apply image attributes after 5 attempts');
          }
        };
        
        // Start applying attributes immediately and then retry
        applyImageAttributes();
        
        quillRef.current.insertText(insertIndex + 1, '\n');
        console.log('✓ Image inserted successfully via stored reference');
        return;
      } catch (error) {
        console.warn('Method 1 failed:', error);
      }
    }
    
    // Method 2: Try using container to find ReactQuill component
    if (reactQuillRef.current) {
      try {
        console.log('Method 2: Using container to find ReactQuill');
        const quillComponent = reactQuillRef.current.querySelector('.ql-editor');
        if (quillComponent) {
          const quillInstance = (quillComponent as any).__quill || 
                               (quillComponent.parentElement as any).__quill ||
                               (quillComponent.closest('.ql-container') as any).__quill;
          if (quillInstance) {
            const length = quillInstance.getLength();
            const insertIndex = Math.max(0, length - 1);
            console.log('Inserting at index:', insertIndex, 'of', length);
            
            quillInstance.insertEmbed(insertIndex, 'image', settings.url);
            
            // Add custom attributes similar to method 1
            const applyImageAttributes2 = (attempt = 0) => {
              const images = document.querySelectorAll('.ql-editor img[src="' + settings.url + '"]');
              const lastImage = images[images.length - 1] as HTMLImageElement;
              
              if (lastImage) {
                console.log('Method 2: Applying image attributes, attempt:', attempt + 1);
                lastImage.alt = settings.alt || 'Image';
                
                // Apply size settings with !important styles
                if (settings.width && settings.height) {
                  const width = Math.round(settings.width);
                  const height = Math.round(settings.height);
                  
                  lastImage.style.setProperty('width', width + 'px', 'important');
                  lastImage.style.setProperty('height', height + 'px', 'important');
                  lastImage.style.setProperty('max-width', 'none', 'important');
                  
                  // Also set as attributes for persistence
                  lastImage.setAttribute('width', width.toString());
                  lastImage.setAttribute('height', height.toString());
                }
                
                // Apply alignment settings
                if (settings.alignment && settings.alignment !== 'none') {
                  if (settings.alignment === 'center') {
                    lastImage.style.setProperty('display', 'block', 'important');
                    lastImage.style.setProperty('margin-left', 'auto', 'important');
                    lastImage.style.setProperty('margin-right', 'auto', 'important');
                  } else if (settings.alignment === 'left') {
                    lastImage.style.setProperty('float', 'left', 'important');
                    lastImage.style.setProperty('margin-right', '15px', 'important');
                    lastImage.style.setProperty('margin-bottom', '10px', 'important');
                  } else if (settings.alignment === 'right') {
                    lastImage.style.setProperty('float', 'right', 'important');
                    lastImage.style.setProperty('margin-left', '15px', 'important');
                    lastImage.style.setProperty('margin-bottom', '10px', 'important');
                  }
                }
                
                console.log('Method 2: Image attributes applied successfully');
              } else if (attempt < 5) {
                // Retry up to 5 times with increasing delays
                setTimeout(() => applyImageAttributes2(attempt + 1), 50 * (attempt + 1));
              } else {
                console.warn('Method 2: Failed to apply image attributes after 5 attempts');
              }
            };
            
            // Start applying attributes immediately and then retry
            applyImageAttributes2();
            
            quillInstance.insertText(insertIndex + 1, '\n');
            console.log('✓ Image inserted successfully via container search');
            return;
          }
        }
      } catch (error) {
        console.warn('Method 2 failed:', error);
      }
    }
    
    // Method 3: Try finding Quill instance in DOM
    try {
      console.log('Method 3: Finding Quill instance in DOM');
      const quillContainer = document.querySelector('.ql-editor');
      if (quillContainer) {
        // Try different ways to get the Quill instance
        const quillInstance = (quillContainer as any).__quill || 
                             (quillContainer.parentElement as any).__quill ||
                             (quillContainer.closest('.ql-container') as any).__quill;
        
        if (quillInstance) {
          const length = quillInstance.getLength();
          const insertIndex = Math.max(0, length - 1);
          console.log('Inserting at index:', insertIndex, 'of', length);
          
          quillInstance.insertEmbed(insertIndex, 'image', settings.url);
          quillInstance.insertText(insertIndex + 1, '\n');
          console.log('✓ Image inserted successfully via DOM search');
          return;
        }
      }
    } catch (error) {
      console.warn('Method 3 failed:', error);
    }
    
    // Method 4: Fallback to direct HTML manipulation
    console.log('Method 4: Using HTML fallback');
    try {
      const imageHtml = `<p>${createImageHtml(settings)}</p>`;
      const newValue = value ? value + imageHtml : imageHtml;
      onChange(newValue);
      console.log('✓ Image inserted successfully via HTML fallback');
    } catch (error) {
      console.error('All methods failed:', error);
    }
  }, [value, onChange]);

  // Show image settings modal
  const showImageSettingsModal = async (imageUrl: string) => {
    try {
      const dimensions = await getImageDimensions(imageUrl);
      setOriginalImageDimensions(dimensions);
      
      const mediumSize = calculateDimensions(dimensions.width, dimensions.height, 'medium');
      
      setImageSettings({
        url: imageUrl,
        alt: '',
        width: mediumSize.width,
        height: mediumSize.height,
        alignment: 'none',
        size: 'medium'
      });
      
      setSelectedImageUrl(imageUrl);
      setShowImageModal(false);
      setShowImageSettings(true);
    } catch (error) {
      console.error('Error setting up image:', error);
    }
  };

  // Handle image selection from collection
  const handleImageSelect = async (image: CollectionImage) => {
    console.log('Selecting image from collection:', image);
    const imageUrl = pb.files.getURL({ id: image.id, collectionName: image.collection }, image.cover_image);
    console.log('Generated image URL:', imageUrl);
    await showImageSettingsModal(imageUrl);
  };

  // Custom image handler for Quill toolbar - completely rewritten
  const imageHandler = useCallback(() => {
    console.log('=== Image button clicked ===');
    
    // Try to get and store the Quill instance from container
    if (reactQuillRef.current) {
      try {
        const quillComponent = reactQuillRef.current.querySelector('.ql-editor');
        if (quillComponent) {
          const quillInstance = (quillComponent as any).__quill || 
                               (quillComponent.parentElement as any).__quill ||
                               (quillComponent.closest('.ql-container') as any).__quill;
          if (quillInstance) {
            quillRef.current = quillInstance;
            console.log('✓ Quill instance stored from container');
          }
        }
      } catch (error) {
        console.warn('Could not get editor from container:', error);
      }
    }
    
    // Also try global DOM method as fallback
    if (!quillRef.current) {
      const quillContainer = document.querySelector('.ql-editor');
      if (quillContainer) {
        const quillInstance = (quillContainer as any).__quill || 
                             (quillContainer.parentElement as any).__quill ||
                             (quillContainer.closest('.ql-container') as any).__quill;
        if (quillInstance) {
          quillRef.current = quillInstance;
          console.log('✓ Quill instance stored from global DOM');
        }
      }
    }
    
    console.log('Final quill reference status:', !!quillRef.current);
    
    // Open the modal
    setShowImageModal(true);
    fetchCollectionImages();
  }, []);

  // Handle image settings changes
  const handleSizeChange = (size: string) => {
    const newDimensions = calculateDimensions(originalImageDimensions.width, originalImageDimensions.height, size);
    setImageSettings(prev => ({
      ...prev,
      size: size as ImageSettings['size'],
      width: newDimensions.width,
      height: newDimensions.height
    }));
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    const aspectRatio = originalImageDimensions.width / originalImageDimensions.height;
    
    setImageSettings(prev => {
      if (dimension === 'width') {
        return {
          ...prev,
          width: value,
          height: value / aspectRatio,
          size: 'custom'
        };
      } else {
        return {
          ...prev,
          width: value * aspectRatio,
          height: value,
          size: 'custom'
        };
      }
    });
  };

  const handleInsertImage = () => {
    insertImageIntoEditor(imageSettings);
    setShowImageSettings(false);
    
    // Refresh collection images if it was an upload
    fetchCollectionImages();
  };

  const handleCancelImageSettings = () => {
    setShowImageSettings(false);
    setImageSettings({
      url: '',
      alt: '',
      width: 0,
      height: 0,
      alignment: 'none',
      size: 'medium'
    });
  };

  // Quill modules configuration
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'code-block'
  ];

  // Handle ReactQuill ready event
  const handleReady = useCallback(() => {
    console.log('ReactQuill ready, attempting to get editor reference');
    // Use a small delay to ensure Quill is fully initialized
    setTimeout(() => {
      if (reactQuillRef.current) {
        try {
          const quillComponent = reactQuillRef.current.querySelector('.ql-editor');
          if (quillComponent) {
            const quillInstance = (quillComponent as any).__quill || 
                                 (quillComponent.parentElement as any).__quill ||
                                 (quillComponent.closest('.ql-container') as any).__quill;
            if (quillInstance) {
              quillRef.current = quillInstance;
              console.log('✓ Quill editor reference obtained on ready');
            }
          }
        } catch (error) {
          console.warn('Could not get editor reference on ready:', error);
        }
      }
    }, 100);
  }, []);

  if (!isMounted) {
    return (
      <div className="border border-gray-300 rounded-md p-4 min-h-[200px] animate-pulse bg-gray-50" />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Add custom CSS to override Quill's default image styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .ql-editor img {
            max-width: none !important;
          }
          .ql-editor img[style*="width"] {
            max-width: none !important;
          }
        `
      }} />
      
      <div 
        ref={reactQuillRef}
        className="react-quill-container"
      >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
          onFocus={handleReady}
        placeholder={defaultPlaceholder}
        modules={modules}
        formats={formats}
          className="bg-white"
        />
      </div>

      {/* Image Selection Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{t('selectImage')}</h3>
              <button
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
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'upload'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('uploadFromPC')}
              </button>
              <button
                onClick={() => setActiveTab('collection')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'collection'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('fromCollection')}
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'upload' ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-sm text-gray-600">
                          {uploading ? (
                            <span className="text-indigo-600">{t('uploading')}</span>
                          ) : (
                            <>
                              <span className="font-medium text-indigo-600 hover:text-indigo-500">{t('clickToUpload')}</span>
                              <span>{t('orDragAndDrop')}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{t('imageSize')}</p>
                      </div>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {loadingImages ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <p className="ml-3 text-gray-600">{t('loadingImages')}</p>
                    </div>
                  ) : collectionImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {collectionImages.map((image) => (
                        <div
                          key={image.id}
                          onClick={() => handleImageSelect(image)}
                          className="group relative cursor-pointer border border-gray-200 rounded-lg p-2 hover:border-indigo-500 hover:shadow-md transition-all"
                        >
                          <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                            <img
                              src={pb.files.getURL({ id: image.id, collectionName: image.collection }, image.cover_image)}
                              alt={image.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <p className="mt-2 text-xs text-gray-600 truncate" title={image.title}>
                            {image.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2">{t('noImagesFound')}</p>
                      <p className="text-sm">{t('uploadImagesFirst')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Settings Modal */}
      {showImageSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{t('imageSettings')}</h3>
              <button
                onClick={handleCancelImageSettings}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">{t('preview')}</h4>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-center">
                      <img
                        src={selectedImageUrl}
                        alt={imageSettings.alt || 'Preview'}
        style={{
                           width: `${Math.min(Math.round(imageSettings.width), 400)}px`,
                           height: `${Math.min(Math.round(imageSettings.height), 300)}px`,
                           maxWidth: '100%'
                         }}
                        className="border border-gray-300 rounded"
                      />
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-600">
                      {Math.round(imageSettings.width)} × {Math.round(imageSettings.height)} pixels
                    </div>
                  </div>
                </div>

                {/* Settings Panel */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">{t('settings')}</h4>
                  
                  {/* Alt Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('altText')}
                    </label>
                    <input
                      type="text"
                      value={imageSettings.alt}
                      onChange={(e) => setImageSettings(prev => ({ ...prev, alt: e.target.value }))}
                      placeholder={t('describeThisImage')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {t('helpsScreenReaders')}
                    </p>
                  </div>

                  {/* Size Presets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('size')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['thumbnail', 'medium', 'large', 'full'].map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(size)}
                          className={`px-3 py-2 text-sm rounded-md transition-colors ${
                            imageSettings.size === size
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Dimensions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('customDimensions')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t('width')}</label>
                        <input
                          type="number"
                          value={Math.round(imageSettings.width)}
                          onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t('height')}</label>
                        <input
                          type="number"
                          value={Math.round(imageSettings.height)}
                          onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {t('original')} {originalImageDimensions.width} × {originalImageDimensions.height}
                    </p>
                  </div>

                  {/* Alignment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('alignment')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'none', label: t('none') },
                        { value: 'left', label: t('left') },
                        { value: 'center', label: t('center') },
                        { value: 'right', label: t('right') }
                      ].map((align) => (
                        <button
                          key={align.value}
                          onClick={() => setImageSettings(prev => ({ ...prev, alignment: align.value as ImageSettings['alignment'] }))}
                          className={`px-3 py-2 text-sm rounded-md transition-colors ${
                            imageSettings.alignment === align.value
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {align.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={handleCancelImageSettings}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleInsertImage}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {t('insertImage')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 