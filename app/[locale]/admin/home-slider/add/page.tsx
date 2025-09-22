'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { pb } from '@/lib/pocketbase';
import Link from 'next/link';
import { useToast } from '@/lib/toast-context';
import HorizontalAccordion from '@/components/ui/admin/HorizontalAccordion';

export default function AddSlidePage() {
  const router = useRouter();
  const t = useTranslations('admin.homeSlider');
  const tCommon = useTranslations('admin.common');
  
  const [formData, setFormData] = useState({
    title: '',
    title_fr: '',
    description: '',
    description_fr: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = t('add.validation.titleRequired');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await pb.collection('home_slider').create(formData);
      // Show success message
      showToast(t('add.success.created'), 'success');
      router.push('/admin/home-slider');
    } catch (err) {
      console.error('Failed to create slide:', err);
      showToast('Failed to create slide', 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('add.title')}</h1>
        </div>
        <Link
          href="/admin/home-slider"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t('add.backToSlides')}
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          <HorizontalAccordion
            englishLabel="Title (English)"
            englishValue={formData.title}
            englishPlaceholder={t('add.form.titlePlaceholder')}
            onEnglishChange={(value) => {
              setFormData(prev => ({ ...prev, title: value }));
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: '' }));
              }
            }}
            englishRequired={true}
            frenchLabel="Title (French)"
            frenchValue={formData.title_fr}
            frenchPlaceholder="Titre en français"
            onFrenchChange={(value) => setFormData(prev => ({ ...prev, title_fr: value }))}
            frenchRequired={false}
            fieldType="text"
            uniqueId="slide-title"
            error={errors.title}
          />

          <HorizontalAccordion
            englishLabel="Description (English)"
            englishValue={formData.description}
            englishPlaceholder={t('add.form.descriptionPlaceholder')}
            onEnglishChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            englishRequired={false}
            frenchLabel="Description (French)"
            frenchValue={formData.description_fr}
            frenchPlaceholder="Description en français"
            onFrenchChange={(value) => setFormData(prev => ({ ...prev, description_fr: value }))}
            frenchRequired={false}
            fieldType="textarea"
            uniqueId="slide-description"
          />

          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/home-slider"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {tCommon('cancel')}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('add.actions.saving') : t('add.actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 