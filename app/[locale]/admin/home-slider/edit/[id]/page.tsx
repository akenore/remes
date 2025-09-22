'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { pb } from '@/lib/pocketbase';
import Link from 'next/link';
import { useToast } from '@/lib/toast-context';
import HorizontalAccordion from '@/components/ui/admin/HorizontalAccordion';

interface HomeSlide {
  id: string;
  title: string;
  title_fr: string;
  description: string;
  description_fr: string;
  created: string;
  updated: string;
}

export default function EditSlidePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations('admin.homeSlider');
  const tCommon = useTranslations('admin.common');
  
  const [formData, setFormData] = useState({
    title: '',
    title_fr: '',
    description: '',
    description_fr: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slide, setSlide] = useState<HomeSlide | null>(null);
  const { showToast } = useToast();

  const fetchSlide = useCallback(async () => {
    try {
      setLoading(true);
      const record = await pb.collection('home_slider').getOne(id);
      const slideData = record as unknown as HomeSlide;
      
      setSlide(slideData);
      setFormData({
        title: slideData.title,
        title_fr: slideData.title_fr || '',
        description: slideData.description,
        description_fr: slideData.description_fr || ''
      });
    } catch (err) {
      console.error('Failed to fetch slide:', err);
      router.push('/admin/home-slider');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchSlide();
  }, [fetchSlide]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = t('add.validation.titleRequired');
    }
    if (!formData.description.trim()) {
      newErrors.description = t('add.validation.descriptionRequired');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      await pb.collection('home_slider').update(id, {
        title: formData.title,
        title_fr: formData.title_fr,
        description: formData.description,
        description_fr: formData.description_fr
      });
      // Show success message
      showToast(t('edit.success.updated'), 'success');
      router.push('/admin/home-slider');
    } catch (err) {
      console.error('Failed to update slide:', err);
      showToast('Failed to update slide', 'error');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{t('edit.loading')}</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!slide) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{t('edit.notFound')}</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">{t('edit.notFound')}</p>
          <Link
            href="/admin/home-slider"
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {t('edit.backToSlides')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('edit.title')}</h1>
        </div>
        <Link
          href="/admin/home-slider"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t('edit.backToSlides')}
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
            uniqueId="edit-slide-title"
            error={errors.title}
          />

          <HorizontalAccordion
            englishLabel="Description (English)"
            englishValue={formData.description}
            englishPlaceholder={t('add.form.descriptionPlaceholder')}
            onEnglishChange={(value) => {
              setFormData(prev => ({ ...prev, description: value }));
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: '' }));
              }
            }}
            englishRequired={false}
            frenchLabel="Description (French)"
            frenchValue={formData.description_fr}
            frenchPlaceholder="Description en français"
            onFrenchChange={(value) => setFormData(prev => ({ ...prev, description_fr: value }))}
            frenchRequired={false}
            fieldType="textarea"
            uniqueId="edit-slide-description"
            error={errors.description}
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
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t('edit.actions.updating') : t('edit.actions.update')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 