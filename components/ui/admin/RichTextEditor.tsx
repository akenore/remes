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

  // Image selection and editing state
  const [selectedImageElement, setSelectedImageElement] = useState<HTMLImageElement | null>(null);
  const [showImageToolbar, setShowImageToolbar] = useState(false);
  const [imageToolbarPosition, setImageToolbarPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect to set up Quill reference after mount
  useEffect(() => {
    if (isMounted && reactQuillRef.current) {
      const setupQuillRef = () => {
        try {
          const quillComponent = reactQuillRef.current?.querySelector('.ql-editor');
          if (quillComponent) {
            const quillInstance = (quillComponent as any).__quill || 
                                 (quillComponent.parentElement as any).__quill ||
                                 (quillComponent.closest('.ql-container') as any).__quill;
            if (quillInstance && !quillRef.current) {
              quillRef.current = quillInstance;
            }
          }
        } catch (error) {
          // Silent error handling
        }
      };

      // Try immediately and with a short delay to ensure Quill is ready
      setupQuillRef();
      const timer = setTimeout(setupQuillRef, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  // Optional: Cleanup old rich text images (can be called manually if needed)
  const cleanupOldRichTextImages = async () => {
    try {
      // Find rich text images older than 7 days that might be orphaned
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const oldImages = await pb.collection('posts').getList(1, 100, {
        filter: `title ~ "[RICH_TEXT_IMG]" && created < "${weekAgo}"`,
        fields: 'id,title,created'
      });

      // Note: We don't auto-delete them as they might still be referenced in content
      // This is just for monitoring - manual cleanup can be done through admin if needed
    } catch (error) {
      // Silent error handling
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

  // Fetch images from both media and posts collections
  const fetchCollectionImages = async () => {
    setLoadingImages(true);
    try {
      const allImages: CollectionImage[] = [];

      // Fetch from media collection
      try {
        const mediaResult = await pb.collection('media').getList(1, 50, {
          sort: '-created',
          fields: 'id,file,created'
        });
        
        const mediaImages = mediaResult.items.map(item => ({
          id: item.id,
          cover_image: item.file, // media collection uses 'file' for the file
          title: `Image ${item.id.slice(-6)}`, // Generate a simple title
          created: item.created,
          collection: 'media' as const
        }));
        
        allImages.push(...mediaImages);
      } catch (error) {
        // Silent error handling
      }

      // Fetch from posts with cover images (excluding rich text images)
      try {
        const postsResult = await pb.collection('posts').getList(1, 25, {
          sort: '-created',
          filter: 'cover_image != "" && title !~ "[RICH_TEXT_IMG]" && title !~ "📷"', // Exclude rich text images
          fields: 'id,cover_image,title,created'
        });
        
        const postImages = postsResult.items.map(item => ({
          id: item.id,
          cover_image: item.cover_image,
          title: item.title || 'Untitled',
          created: item.created,
          collection: 'posts' as const
        }));
        
        allImages.push(...postImages);
      } catch (error) {
        // Silent error handling
      }

      // Sort all images by creation date (newest first)
      allImages.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      
      setCollectionImages(allImages);
    } catch (error) {
      // Silent error handling
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

      // Upload image to media collection instead of posts
        const formData = new FormData();
      formData.append('file', file, file.name);

      // Create the record in media collection
      const record = await pb.collection('media').create(formData);
      
      // Generate the image URL
      const imageUrl = pb.files.getURL(record, record.file);
      
      // Show image settings modal
      await showImageSettingsModal(imageUrl);

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
      
      alert(`${t('imageModal.errors.uploadFailed')}: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // Insert image into Quill editor with settings
  const insertImageIntoEditor = useCallback((settings: ImageSettings) => {
    // Create image HTML with all settings
    const createImageHtml = (settings: ImageSettings) => {
      const { url, alt, width, height, alignment } = settings;
      
      let style = `max-width: none;`; // Don't constrain by default
      if (width && height) {
        style = `width: ${Math.round(width)}px; height: ${Math.round(height)}px; max-width: none;`;
      }
      
      let alignmentStyle = '';
      let wrapperStyle = '';
      
      if (alignment === 'center') {
        alignmentStyle = ' display: inline-block;';
        wrapperStyle = ' style="text-align: center;"';
      } else if (alignment === 'left') {
        alignmentStyle = ' float: left; margin-right: 15px; margin-bottom: 10px;';
      } else if (alignment === 'right') {
        alignmentStyle = ' float: right; margin-left: 15px; margin-bottom: 10px;';
      }
      
      const finalStyle = style + alignmentStyle;
      const widthAttr = width ? ` width="${Math.round(width)}"` : '';
      const heightAttr = height ? ` height="${Math.round(height)}"` : '';
      
      const imageTag = `<img src="${url}" alt="${alt || 'Image'}" style="${finalStyle}"${widthAttr}${heightAttr} />`;
      
      // Wrap centered images in a div for proper alignment
      if (alignment === 'center') {
        const result = `<div${wrapperStyle}>${imageTag}</div>`;
        return result;
      }
      
      return imageTag;
    };

    // Method 1: Try using the stored quill reference
    if (quillRef.current) {
      try {
        const length = quillRef.current.getLength();
        const insertIndex = Math.max(0, length - 1);
        
        quillRef.current.insertEmbed(insertIndex, 'image', settings.url);
        
        // Add custom attributes to the inserted image with multiple attempts
        const applyImageAttributes = (attempt = 0) => {
          const images = document.querySelectorAll('.ql-editor img[src="' + settings.url + '"]');
          const lastImage = images[images.length - 1] as HTMLImageElement;
          
          if (lastImage) {
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
              // Reset all alignment styles first
              lastImage.style.removeProperty('float');
              lastImage.style.removeProperty('display');
              lastImage.style.removeProperty('margin-left');
              lastImage.style.removeProperty('margin-right');
              lastImage.style.removeProperty('margin-bottom');
              
              const parent = lastImage.parentElement;
              if (parent) {
                parent.style.removeProperty('text-align');
              }
              
              if (settings.alignment === 'center') {
                // For center alignment, we need to set text-align on parent
                if (parent) {
                  parent.style.setProperty('text-align', 'center', 'important');
                }
                lastImage.style.setProperty('display', 'inline-block', 'important');
              } else if (settings.alignment === 'left') {
                lastImage.style.setProperty('float', 'left', 'important');
                lastImage.style.setProperty('margin-right', '15px', 'important');
                lastImage.style.setProperty('margin-bottom', '10px', 'important');
              } else if (settings.alignment === 'right') {
                lastImage.style.setProperty('float', 'right', 'important');
                lastImage.style.setProperty('margin-left', '15px', 'important');
                lastImage.style.setProperty('margin-bottom', '10px', 'important');
              }
              
              // Force a reflow to ensure styles are applied
              lastImage.offsetHeight;
              
              // Also try to update the Quill content
              if (quillRef.current) {
                setTimeout(() => {
                  const content = quillRef.current.root.innerHTML;
                  onChange(content);
                }, 100);
              }
        } else {
              // Reset alignment styles
              const parent = lastImage.parentElement;
              if (parent) {
                parent.style.removeProperty('text-align');
              }
              lastImage.style.removeProperty('float');
              lastImage.style.removeProperty('display');
              lastImage.style.removeProperty('margin-left');
              lastImage.style.removeProperty('margin-right');
              lastImage.style.removeProperty('margin-bottom');
            }
          } else if (attempt < 5) {
            // Retry up to 5 times with increasing delays
            setTimeout(() => applyImageAttributes(attempt + 1), 50 * (attempt + 1));
          }
        };
        
        // Start applying attributes immediately and then retry
        applyImageAttributes();
        
        quillRef.current.insertText(insertIndex + 1, '\n');
        return;
      } catch (error) {
        // Silent error handling
      }
    }
    
    // Method 2: Try using container to find ReactQuill component
    if (reactQuillRef.current) {
      try {
        const quillComponent = reactQuillRef.current.querySelector('.ql-editor');
        if (quillComponent) {
          const quillInstance = (quillComponent as any).__quill || 
                               (quillComponent.parentElement as any).__quill ||
                               (quillComponent.closest('.ql-container') as any).__quill;
          if (quillInstance) {
            const length = quillInstance.getLength();
            const insertIndex = Math.max(0, length - 1);
            
            quillInstance.insertEmbed(insertIndex, 'image', settings.url);
            
            // Add custom attributes similar to method 1
            const applyImageAttributes2 = (attempt = 0) => {
              const images = document.querySelectorAll('.ql-editor img[src="' + settings.url + '"]');
              const lastImage = images[images.length - 1] as HTMLImageElement;
              
              if (lastImage) {
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
                  // Reset all alignment styles first
                  lastImage.style.removeProperty('float');
                  lastImage.style.removeProperty('display');
                  lastImage.style.removeProperty('margin-left');
                  lastImage.style.removeProperty('margin-right');
                  lastImage.style.removeProperty('margin-bottom');
                  
                  const parent = lastImage.parentElement;
                  if (parent) {
                    parent.style.removeProperty('text-align');
                  }
                  
                  if (settings.alignment === 'center') {
                    // For center alignment, we need to set text-align on parent
                    if (parent) {
                      parent.style.setProperty('text-align', 'center', 'important');
                    }
                    lastImage.style.setProperty('display', 'inline-block', 'important');
                  } else if (settings.alignment === 'left') {
                    lastImage.style.setProperty('float', 'left', 'important');
                    lastImage.style.setProperty('margin-right', '15px', 'important');
                    lastImage.style.setProperty('margin-bottom', '10px', 'important');
                  } else if (settings.alignment === 'right') {
                    lastImage.style.setProperty('float', 'right', 'important');
                    lastImage.style.setProperty('margin-left', '15px', 'important');
                    lastImage.style.setProperty('margin-bottom', '10px', 'important');
                  }
                  
                  // Force a reflow to ensure styles are applied
                  lastImage.offsetHeight;
                  
                  // Also try to update the Quill content
                  if (quillRef.current) {
                    setTimeout(() => {
                      const content = quillRef.current.root.innerHTML;
                      onChange(content);
                    }, 100);
                  }
                } else {
                  // Reset alignment styles
                  const parent = lastImage.parentElement;
                  if (parent) {
                    parent.style.removeProperty('text-align');
                  }
                  lastImage.style.removeProperty('float');
                  lastImage.style.removeProperty('display');
                  lastImage.style.removeProperty('margin-left');
                  lastImage.style.removeProperty('margin-right');
                  lastImage.style.removeProperty('margin-bottom');
                }
              } else if (attempt < 5) {
                // Retry up to 5 times with increasing delays
                setTimeout(() => applyImageAttributes2(attempt + 1), 50 * (attempt + 1));
              }
            };
            
            // Start applying attributes immediately and then retry
            applyImageAttributes2();
            
            quillInstance.insertText(insertIndex + 1, '\n');
            return;
          }
        }
      } catch (error) {
        // Silent error handling
      }
    }
    
    // Method 3: Try finding Quill instance in DOM
    try {
      const quillContainer = document.querySelector('.ql-editor');
      if (quillContainer) {
        // Try different ways to get the Quill instance
        const quillInstance = (quillContainer as any).__quill || 
                             (quillContainer.parentElement as any).__quill ||
                             (quillContainer.closest('.ql-container') as any).__quill;
        
        if (quillInstance) {
          const length = quillInstance.getLength();
          const insertIndex = Math.max(0, length - 1);
          
          quillInstance.insertEmbed(insertIndex, 'image', settings.url);
          quillInstance.insertText(insertIndex + 1, '\n');
          return;
        }
      }
    } catch (error) {
      // Silent error handling
    }
    
    // Method 4: Improved HTML fallback with proper positioning
    try {
      const imageHtml = createImageHtml(settings);
      
      // Try to insert at a logical position in the editor
      const editorElement = reactQuillRef.current?.querySelector('.ql-editor');
      if (editorElement) {
        // Get current selection or insert at end
        const selection = window.getSelection();
        let insertionPoint = null;
        
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (editorElement.contains(range.commonAncestorContainer)) {
            insertionPoint = range;
          }
        }
        
        if (insertionPoint) {
          // Insert at cursor position
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = imageHtml;
          const imageElement = tempDiv.firstElementChild;
          
          if (imageElement) {
            insertionPoint.deleteContents();
            insertionPoint.insertNode(imageElement);
            
            // Clear selection and trigger content update
            if (selection) {
              selection.removeAllRanges();
            }
            setTimeout(() => {
              onChange(editorElement.innerHTML);
            }, 10);
            return;
          }
        }
        
        // Fallback: append to end with proper spacing
        let currentHtml = editorElement.innerHTML.trim();
        if (currentHtml && !currentHtml.endsWith('<br>') && !currentHtml.endsWith('</p>')) {
          currentHtml += '<br>';
        }
        
        const finalHtml = currentHtml + imageHtml + '<br>';
        editorElement.innerHTML = finalHtml;
        
        // Trigger onChange after DOM update
        setTimeout(() => {
          onChange(finalHtml);
        }, 10);
        return;
      }
      
      // Final fallback: use onChange callback
      const currentContent = value.trim();
      let newContent = imageHtml;
      
      if (currentContent) {
        newContent = currentContent + (currentContent.endsWith('>') ? '<br>' : '<br>') + imageHtml;
      }
      
      onChange(newContent + '<br>');
    } catch (error) {
      // Silent error handling
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
      // Silent error handling
    }
  };

  // Handle image selection from collection
  const handleImageSelect = async (image: CollectionImage) => {
    const imageUrl = pb.files.getURL({ id: image.id, collectionName: image.collection }, image.cover_image);
    await showImageSettingsModal(imageUrl);
  };

  // Custom image handler for Quill toolbar - completely rewritten
  const imageHandler = useCallback(() => {
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
          }
        }
      } catch (error) {
        // Silent error handling
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
        }
      }
    }
    
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

  // Add click handler for image selection in the editor
  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.closest('.ql-editor')) {
        e.preventDefault();
        e.stopPropagation();
        
        const imgElement = target as HTMLImageElement;
        setSelectedImageElement(imgElement);
        
        // Position the toolbar near the image
        const rect = imgElement.getBoundingClientRect();
        setImageToolbarPosition({
          top: rect.bottom + window.scrollY + 10,
          left: rect.left + window.scrollX
        });
        setShowImageToolbar(true);
        
        // Add visual selection indicator
        imgElement.classList.add('image-selected');
        
        // Remove selection from other images
        document.querySelectorAll('.ql-editor img').forEach(img => {
          if (img !== imgElement) {
            img.classList.remove('image-selected');
          }
        });
      }
    };

    const handleClickOutside = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.image-toolbar') && !target.closest('.ql-editor img')) {
        setShowImageToolbar(false);
        setSelectedImageElement(null);
        document.querySelectorAll('.ql-editor img').forEach(img => {
          img.classList.remove('image-selected');
        });
      }
    };

    if (isMounted) {
      document.addEventListener('click', handleImageClick);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleImageClick);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMounted]);

  // Apply alignment to selected image
  const applyAlignmentToSelectedImage = (alignment: 'left' | 'center' | 'right' | 'none') => {
    if (!selectedImageElement) return;

    const parent = selectedImageElement.parentElement;
    
    // Reset all alignment styles first
    selectedImageElement.style.removeProperty('float');
    selectedImageElement.style.removeProperty('display');
    selectedImageElement.style.removeProperty('margin-left');
    selectedImageElement.style.removeProperty('margin-right');
    selectedImageElement.style.removeProperty('margin-bottom');
    
    if (parent) {
      parent.style.removeProperty('text-align');
    }

    // Apply new alignment
    if (alignment === 'center') {
      if (parent) {
        parent.style.setProperty('text-align', 'center', 'important');
      }
      selectedImageElement.style.setProperty('display', 'inline-block', 'important');
    } else if (alignment === 'left') {
      selectedImageElement.style.setProperty('float', 'left', 'important');
      selectedImageElement.style.setProperty('margin-right', '15px', 'important');
      selectedImageElement.style.setProperty('margin-bottom', '10px', 'important');
    } else if (alignment === 'right') {
      selectedImageElement.style.setProperty('float', 'right', 'important');
      selectedImageElement.style.setProperty('margin-left', '15px', 'important');
      selectedImageElement.style.setProperty('margin-bottom', '10px', 'important');
    }
  };

  // Delete selected image
  const deleteSelectedImage = () => {
    if (!selectedImageElement) return;

    const parent = selectedImageElement.parentElement;
    selectedImageElement.remove();
    
    // If parent is empty, remove it too
    if (parent && parent.innerHTML.trim() === '') {
      parent.remove();
    }
    
    setShowImageToolbar(false);
    setSelectedImageElement(null);
    
    // Trigger onChange to update the content
    if (quillRef.current) {
      const content = quillRef.current.root.innerHTML;
      onChange(content);
    }
  };

  if (!isMounted) {
    return (
      <div className="border border-gray-300 rounded-md p-4 min-h-[200px] animate-pulse bg-gray-50" />
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Custom styles for better image alignment and selection */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .ql-editor img {
            max-width: 100% !important;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .ql-editor img:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          
          .ql-editor img.image-selected {
            box-shadow: 0 0 0 3px #0ea5e9 !important;
            border-radius: 4px;
          }
          
          .ql-editor p {
            margin-bottom: 1em;
          }
          
          .ql-editor p[style*="text-align: center"] {
            text-align: center !important;
          }
          
          .ql-editor img[style*="float: left"] {
            float: left !important;
            margin-right: 15px !important;
            margin-bottom: 10px !important;
          }
          
          .ql-editor img[style*="float: right"] {
            float: right !important;
            margin-left: 15px !important;
            margin-bottom: 10px !important;
          }
          
          .ql-editor img[style*="display: inline-block"] {
            display: inline-block !important;
          }
          
          /* Clear floats after images */
          .ql-editor p:after {
            content: "";
            display: table;
            clear: both;
          }
          
          /* Image toolbar styles */
          .image-toolbar {
            position: absolute;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            padding: 8px;
            display: flex;
            gap: 4px;
          }
          
          .image-toolbar button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 4px;
            background: transparent;
            cursor: pointer;
            transition: background-color 0.2s;
            color: #64748b;
          }
          
          .image-toolbar button:hover {
            background-color: #f1f5f9;
            color: #334155;
          }
          
          .image-toolbar button.active {
            background-color: #0ea5e9;
            color: white;
          }
          
          .image-toolbar button svg {
            width: 16px;
            height: 16px;
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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowImageModal(false);
                }}
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
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('upload');
                }}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'upload'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('uploadFromPC')}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('collection');
                  // Fetch images when switching to collection tab
                  if (collectionImages.length === 0) {
                    fetchCollectionImages();
                  }
                }}
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleImageSelect(image);
                          }}
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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowImageModal(false);
                }}
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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowImageSettings(false);
                }}
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
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSizeChange(size);
                          }}
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
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setImageSettings(prev => ({ ...prev, alignment: align.value as ImageSettings['alignment'] }));
                          }}
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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowImageSettings(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleInsertImage();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {t('insertImage')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Image Toolbar */}
      {showImageToolbar && selectedImageElement && (
        <div 
          className="image-toolbar"
          style={{
            top: `${imageToolbarPosition.top}px`,
            left: `${imageToolbarPosition.left}px`
          }}
        >
          {/* Align Left */}
          <button
            type="button"
            onClick={() => applyAlignmentToSelectedImage('left')}
            title="Align Left"
            className={selectedImageElement?.style.float === 'left' ? 'active' : ''}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 000 2h16a1 1 0 100-2H2zM2 7a1 1 0 000 2h10a1 1 0 100-2H2zM2 11a1 1 0 100 2h16a1 1 0 100-2H2zM2 15a1 1 0 100 2h10a1 1 0 100-2H2z" />
            </svg>
          </button>

          {/* Align Center */}
          <button
            type="button"
            onClick={() => applyAlignmentToSelectedImage('center')}
            title="Align Center"
            className={selectedImageElement?.parentElement?.style.textAlign === 'center' ? 'active' : ''}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 000 2h16a1 1 0 100-2H2zM5 7a1 1 0 000 2h10a1 1 0 100-2H5zM2 11a1 1 0 100 2h16a1 1 0 100-2H2zM5 15a1 1 0 100 2h10a1 1 0 100-2H5z" />
            </svg>
          </button>

          {/* Align Right */}
          <button
            type="button"
            onClick={() => applyAlignmentToSelectedImage('right')}
            title="Align Right"
            className={selectedImageElement?.style.float === 'right' ? 'active' : ''}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 000 2h16a1 1 0 100-2H2zM8 7a1 1 0 100 2h10a1 1 0 100-2H8zM2 11a1 1 0 100 2h16a1 1 0 100-2H2zM8 15a1 1 0 100 2h10a1 1 0 100-2H8z" />
            </svg>
          </button>

          {/* Separator */}
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '4px 2px' }}></div>

          {/* Delete Image */}
          <button
            type="button"
            onClick={deleteSelectedImage}
            title="Delete Image"
            style={{ color: '#dc2626' }}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
} 