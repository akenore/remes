'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { pb } from '@/lib/pocketbase';
import Link from 'next/link';
import { useToast } from '@/lib/toast-context';
import HorizontalAccordion from '@/components/ui/admin/HorizontalAccordion';

interface Testimonial {
  id: string;
  full_name: string;
  role: string;
  role_fr: string;
  location: string;
  description: string;
  description_fr: string;
  created: string;
  updated: string;
}

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations('admin.testimonials');
  const tCommon = useTranslations('admin.common');

  const [formData, setFormData] = useState({
    full_name: '',
    role: '',
    role_fr: '',
    location: '',
    description: '',
    description_fr: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const { showToast } = useToast();

  const fetchTestimonial = useCallback(async () => {
    try {
      setLoading(true);
      const record = await pb.collection('testimonials').getOne(id);
      const testimonialData = record as unknown as Testimonial;

      setTestimonial(testimonialData);
      setFormData({
        full_name: testimonialData.full_name,
        role: testimonialData.role || '',
        role_fr: testimonialData.role_fr || '',
        location: testimonialData.location || '',
        description: testimonialData.description,
        description_fr: testimonialData.description_fr || ''
      });
    } catch (err) {
      console.error('Failed to fetch testimonial:', err);
      router.push('/admin/testimonials');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchTestimonial();
  }, [fetchTestimonial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) {
      newErrors.full_name = t('add.validation.fullNameRequired');
    }
    if (!formData.description.trim()) {
      newErrors.description = t('add.validation.descriptionRequired');
    }
    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      await pb.collection('testimonials').update(id, {
        full_name: formData.full_name,
        role: formData.role,
        role_fr: formData.role_fr,
        location: formData.location,
        description: formData.description,
        description_fr: formData.description_fr
      });
      showToast(t('edit.success.updated'), 'success');
      router.push('/admin/testimonials');
    } catch (err) {
      console.error('Failed to update testimonial:', err);
      showToast('Failed to update testimonial', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

  if (!testimonial) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{t('edit.notFound')}</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">{t('edit.notFound')}</p>
          <Link
            href="/admin/testimonials"
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {t('edit.backToTestimonials')}
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
          href="/admin/testimonials"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t('edit.backToTestimonials')}
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              {t('add.form.fullName')}
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.full_name ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder={t('add.form.fullNamePlaceholder')}
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
            )}
          </div>



          {/* Role */}
          <HorizontalAccordion
            englishLabel="Role (English)"
            englishValue={formData.role}
            englishPlaceholder="e.g. Resident's Daughter"
            onEnglishChange={(value) => {
              setFormData(prev => ({ ...prev, role: value }));
              if (errors.role) {
                setErrors(prev => ({ ...prev, role: '' }));
              }
            }}
            englishRequired={true}
            frenchLabel="Role (French)"
            frenchValue={formData.role_fr}
            frenchPlaceholder="e.g. Fille de résidente"
            onFrenchChange={(value) => setFormData(prev => ({ ...prev, role_fr: value }))}
            frenchRequired={false}
            fieldType="text"
            uniqueId="testimonial-role"
            error={errors.role}
          />

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.location ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="e.g. Paris"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Description */}
          <HorizontalAccordion
            uniqueId="edit-testimonial-description"
            englishLabel={t('add.form.description')}
            frenchLabel="Description"
            fieldType="textarea"
            englishValue={formData.description}
            frenchValue={formData.description_fr}
            onEnglishChange={(value) => {
              setFormData(prev => ({ ...prev, description: value }));
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: '' }));
              }
            }}
            onFrenchChange={(value) => {
              setFormData(prev => ({ ...prev, description_fr: value }));
            }}
            englishPlaceholder={t('add.form.descriptionPlaceholder')}
            frenchPlaceholder="Description en français"
            error={errors.description}
            englishRequired={true}
          />

          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/testimonials"
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
      </div >
    </div >
  );
} 