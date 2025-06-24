'use client';

import { useEffect, useRef, useState } from 'react';
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

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  className = '',
  postId
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const quillInstanceRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Image upload handler - simplified to work like PocketBase's built-in editor
  const createImageHandler = () => {
    return function(this: any) {
      const quill = this.quill;
      
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file');
          return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          alert('Image size must be less than 10MB');
          return;
        }

        let range: any;
        try {
          // Get cursor position
          range = quill.getSelection(true);
          
          // Insert temporary loading placeholder
          quill.insertText(range.index, 'Uploading image...', 'user');
          quill.setSelection(range.index + 19);

          let imageUrl: string;

          if (postId) {
            // For existing posts, create a temporary post to avoid interfering with the main cover image
            // This ensures rich text images don't overwrite the post's featured image
            const categories = await pb.collection('categories').getList(1, 1);
            if (categories.items.length === 0) {
              throw new Error('No categories available. Please create a category first.');
            }
            
            const tempFormData = new FormData();
            tempFormData.append('title', `Rich text image for post ${postId} - ${Date.now()}`);
            tempFormData.append('slug', `rich-text-image-${postId}-${Date.now()}`);
            tempFormData.append('content', `Rich text image for existing post ${postId}`);
            tempFormData.append('published', 'false');
            tempFormData.append('author', pb.authStore.model?.id || '');
            tempFormData.append('categories', categories.items[0].id);
            tempFormData.append('cover_image', file);
            
            const tempPost = await pb.collection('posts').create(tempFormData);
            imageUrl = pb.files.getUrl(tempPost, tempPost.cover_image);
            
            console.log('Created temporary post for rich text image in existing post:', tempPost.id);
          } else {
            // For new posts, create a simple temporary upload
            // This mimics how PocketBase handles rich text images internally
            
            // Create a minimal temporary post to hold the image
            const categories = await pb.collection('categories').getList(1, 1);
            if (categories.items.length === 0) {
              throw new Error('No categories available. Please create a category first.');
            }
            
            const tempFormData = new FormData();
            tempFormData.append('title', `Rich text temp - ${Date.now()}`);
            tempFormData.append('slug', `rich-text-temp-${Date.now()}`);
            tempFormData.append('content', 'Temporary for rich text image');
            tempFormData.append('published', 'false');
            tempFormData.append('author', pb.authStore.model?.id || '');
            tempFormData.append('categories', categories.items[0].id);
            tempFormData.append('cover_image', file);
            
            const tempPost = await pb.collection('posts').create(tempFormData);
            imageUrl = pb.files.getUrl(tempPost, tempPost.cover_image);
            
            // Store temp post ID for potential cleanup
            console.log('Created temporary post for image:', tempPost.id);
          }

          // Replace loading text with image
          quill.deleteText(range.index, 19);
          quill.insertEmbed(range.index, 'image', imageUrl);
          
          // Set selection after the image
          setTimeout(() => {
            quill.setSelection(range.index + 1);
          }, 100);

        } catch (error) {
          console.error('Image upload failed:', error);
          
          // Parse PocketBase error for better feedback
          let errorMessage = 'Failed to upload image. Please try again.';
          if (error && typeof error === 'object' && 'response' in error) {
            const pbError = error as any;
            if (pbError.response?.data?.data) {
              const fieldErrors = Object.entries(pbError.response.data.data)
                .map(([field, data]: [string, any]) => `${field}: ${data.message || data}`)
                .join(', ');
              errorMessage = `Upload failed: ${fieldErrors}`;
            } else if (pbError.response?.message) {
              errorMessage = `Upload failed: ${pbError.response.message}`;
            }
          }
          
          alert(errorMessage);
          
          // Remove loading text on error
          try {
            const currentRange = quill.getSelection() || range;
            if (currentRange && currentRange.index >= 19) {
              quill.deleteText(currentRange.index - 19, 19);
            } else {
              // Fallback: search for and remove the loading text
              const text = quill.getText();
              const loadingIndex = text.indexOf('Uploading image...');
              if (loadingIndex !== -1) {
                quill.deleteText(loadingIndex, 19);
              }
            }
          } catch (selectionError) {
            console.warn('Could not clean up loading text:', selectionError);
          }
        }
      };
    };
  };

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
        image: createImageHandler()
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

  if (!isMounted) {
    return <div className="border border-gray-300 rounded-md p-4 min-h-[200px] animate-pulse bg-gray-50" />;
  }

  return (
    <div className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
        }}
      />
      <style jsx global>{`
        .ql-toolbar {
          border-top: 1px solid #d1d5db !important;
          border-left: 1px solid #d1d5db !important;
          border-right: 1px solid #d1d5db !important;
          border-bottom: none !important;
          border-top-left-radius: 0.375rem !important;
          border-top-right-radius: 0.375rem !important;
          background: #f9fafb !important;
        }
        
        .ql-container {
          border-bottom: 1px solid #d1d5db !important;
          border-left: 1px solid #d1d5db !important;
          border-right: 1px solid #d1d5db !important;
          border-top: none !important;
          border-bottom-left-radius: 0.375rem !important;
          border-bottom-right-radius: 0.375rem !important;
          font-family: inherit !important;
        }
        
        .ql-editor {
          min-height: 200px !important;
          font-family: inherit !important;
          line-height: 1.6 !important;
        }
        
        .ql-editor.ql-blank::before {
          font-style: normal !important;
          color: #9ca3af !important;
        }
        
        .ql-toolbar .ql-picker-label {
          color: #374151 !important;
        }
        
        .ql-toolbar .ql-stroke {
          stroke: #374151 !important;
        }
        
        .ql-toolbar .ql-fill {
          fill: #374151 !important;
        }
        
        .ql-toolbar button:hover {
          color: #111827 !important;
        }
        
        .ql-toolbar button:hover .ql-stroke {
          stroke: #111827 !important;
        }
        
        .ql-toolbar button:hover .ql-fill {
          fill: #111827 !important;
        }
        
        .ql-toolbar button.ql-active {
          color: #3b82f6 !important;
        }
        
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #3b82f6 !important;
        }
        
        .ql-toolbar button.ql-active .ql-fill {
          fill: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
} 