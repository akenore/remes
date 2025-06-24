'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { pb } from '@/lib/pocketbase';

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
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  className = '',
  postId
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'collection'>('upload');
  const [collectionImages, setCollectionImages] = useState<CollectionImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Use refs to store Quill instance and ReactQuill component
  const quillRef = useRef<any>(null);
  const reactQuillRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch images from posts collection (both rich text images and regular posts)
  const fetchCollectionImages = async () => {
    setLoadingImages(true);
    try {
      const result = await pb.collection('posts').getList(1, 50, {
        sort: '-created',
        filter: 'cover_image != ""',
        fields: 'id,cover_image,title,created'
      });
      
      console.log('Fetched images from collection:', result.items.length);
      
      setCollectionImages(result.items.map(item => ({
        id: item.id,
        cover_image: item.cover_image,
        title: item.title || 'Untitled',
        created: item.created
      })));
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
        alert('Please select an image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }

      // Create temporary post for image storage - use a unique approach to avoid conflicts
      const categories = await pb.collection('categories').getList(1, 1);
      if (categories.items.length === 0) {
        throw new Error('No categories available. Please create a category first.');
      }
      
      const timestamp = Date.now();
      const tempFormData = new FormData();
      tempFormData.append('title', `[Rich Text Image] ${timestamp}`);
      tempFormData.append('slug', `rich-text-img-${timestamp}-${Math.random().toString(36).substr(2, 9)}`);
      tempFormData.append('content', `Rich text editor image uploaded at ${new Date().toISOString()}`);
      tempFormData.append('published', 'false');
      tempFormData.append('author', pb.authStore.model?.id || '');
      tempFormData.append('categories', categories.items[0].id);
      
      // Store the image as cover_image but mark it as a rich text asset
      tempFormData.append('cover_image', file);
      
      const tempPost = await pb.collection('posts').create(tempFormData);
      const imageUrl = pb.files.getURL(tempPost, tempPost.cover_image);
      
      console.log('Image uploaded successfully:', imageUrl);
      
      // Insert image into editor
      insertImageIntoEditor(imageUrl);
      setShowImageModal(false);
      
      // Refresh collection images
      fetchCollectionImages();
      
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Insert image into Quill editor - completely rewritten approach
  const insertImageIntoEditor = useCallback((imageUrl: string) => {
    console.log('=== Starting image insertion ===');
    console.log('Image URL:', imageUrl);
    console.log('ReactQuill ref:', !!reactQuillRef.current);
    console.log('Quill ref:', !!quillRef.current);
    
    // Method 1: Try using the stored quill reference
    if (quillRef.current) {
      try {
        console.log('Method 1: Using stored quill reference');
        const length = quillRef.current.getLength();
        const insertIndex = Math.max(0, length - 1);
        console.log('Inserting at index:', insertIndex, 'of', length);
        
        quillRef.current.insertEmbed(insertIndex, 'image', imageUrl);
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
            
            quillInstance.insertEmbed(insertIndex, 'image', imageUrl);
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
          
          quillInstance.insertEmbed(insertIndex, 'image', imageUrl);
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
      const imageHtml = `<p><img src="${imageUrl}" alt="Rich text image" style="max-width: 100%; height: auto;" /></p>`;
      const newValue = value ? value + imageHtml : imageHtml;
      onChange(newValue);
      console.log('✓ Image inserted successfully via HTML fallback');
    } catch (error) {
      console.error('All methods failed:', error);
    }
  }, [value, onChange]);

  // Handle image selection from collection
  const handleImageSelect = (image: CollectionImage) => {
    console.log('Selecting image from collection:', image);
    const imageUrl = pb.files.getURL({ id: image.id, collectionName: 'posts' }, image.cover_image);
    console.log('Generated image URL:', imageUrl);
    insertImageIntoEditor(imageUrl);
    setShowImageModal(false);
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
      <div 
        ref={reactQuillRef}
        className="react-quill-container"
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          onFocus={handleReady}
          placeholder={placeholder}
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
              <h3 className="text-lg font-semibold text-gray-900">Select an image</h3>
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
                Upload from PC
              </button>
              <button
                onClick={() => setActiveTab('collection')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'collection'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                From collection
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
                            <span className="text-indigo-600">Uploading...</span>
                          ) : (
                            <>
                              <span className="font-medium text-indigo-600 hover:text-indigo-500">Click to upload</span>
                              <span> or drag and drop</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {loadingImages ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
                              src={pb.files.getURL({ id: image.id, collectionName: 'posts' }, image.cover_image)}
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
                      <p className="mt-2">No images found in collection</p>
                      <p className="text-sm">Upload some images first to see them here</p>
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
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 