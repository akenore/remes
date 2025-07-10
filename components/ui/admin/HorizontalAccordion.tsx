'use client';

import { useState, ReactNode } from 'react';
import { useTranslations } from 'next-intl';

interface HorizontalAccordionProps {
  // English field props
  englishLabel: string;
  englishValue: string;
  englishPlaceholder?: string;
  onEnglishChange: (value: string) => void;
  englishRequired?: boolean;
  
  // French field props
  frenchLabel: string;
  frenchValue: string;
  frenchPlaceholder?: string;
  onFrenchChange: (value: string) => void;
  frenchRequired?: boolean;
  
  // Field type and styling
  fieldType: 'text' | 'textarea' | 'richtext';
  uniqueId: string; // To prevent ID conflicts
  className?: string;
  error?: string;
  
  // Rich text editor component (if fieldType is 'richtext')
  RichTextComponent?: React.ComponentType<{
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }>;
  
  // Additional props for text fields
  textInputClassName?: string;
  textInputStyle?: React.CSSProperties;
}

export default function HorizontalAccordion({
  englishLabel,
  englishValue,
  englishPlaceholder,
  onEnglishChange,
  englishRequired = false,
  frenchLabel,
  frenchValue,
  frenchPlaceholder,
  onFrenchChange,
  frenchRequired = false,
  fieldType,
  uniqueId,
  className = '',
  error,
  RichTextComponent,
  textInputClassName = '',
  textInputStyle = {},
}: HorizontalAccordionProps) {
  const [activeTab, setActiveTab] = useState<'english' | 'french'>('english');
  const t = useTranslations('admin.common');

  const renderField = (
    value: string,
    onChange: (value: string) => void,
    placeholder?: string,
    required?: boolean,
    language?: 'english' | 'french'
  ) => {
    const baseInputClasses = `block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${textInputClassName}`;
    const fieldId = `${uniqueId}_${language}`;

    switch (fieldType) {
      case 'text':
        return (
          <input
            id={fieldId}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={baseInputClasses}
            style={textInputStyle}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={4}
            className={baseInputClasses}
            style={textInputStyle}
          />
        );
      
      case 'richtext':
        if (!RichTextComponent) {
          throw new Error('RichTextComponent is required when fieldType is "richtext"');
        }
        return (
          <RichTextComponent
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        {/* Tab Headers */}
        <div className="flex space-x-0 mb-4 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab('english')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'english'
                ? 'bg-white text-indigo-600 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="flag-icon flag-icon-gb w-4 h-3 rounded-sm">🇬🇧</span>
              <span>{englishLabel}</span>
              {englishRequired && <span className="text-red-500">*</span>}
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('french')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'french'
                ? 'bg-white text-indigo-600 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="flag-icon flag-icon-fr w-4 h-3 rounded-sm">🇫🇷</span>
              <span>{frenchLabel}</span>
              {frenchRequired && <span className="text-red-500">*</span>}
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'english' && (
            <div className="space-y-2">
              <label htmlFor={`${uniqueId}_english`} className="block text-sm font-medium text-gray-700">
                {englishLabel}
                {englishRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(
                englishValue,
                onEnglishChange,
                englishPlaceholder,
                englishRequired,
                'english'
              )}
            </div>
          )}
          
          {activeTab === 'french' && (
            <div className="space-y-2">
              <label htmlFor={`${uniqueId}_french`} className="block text-sm font-medium text-gray-700">
                {frenchLabel}
                {frenchRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(
                frenchValue,
                onFrenchChange,
                frenchPlaceholder,
                frenchRequired,
                'french'
              )}
            </div>
          )}
        </div>

        {/* Field Preview */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">🇬🇧 English:</span>
              <span className="truncate max-w-xs">
                {englishValue || `(${t('empty')})`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">🇫🇷 French:</span>
              <span className="truncate max-w-xs">
                {frenchValue || `(${t('empty')})`}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 