'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { pb } from '@/lib/pocketbase';
import Link from 'next/link';
import { useToast } from '@/lib/toast-context';
import HorizontalAccordion from '@/components/ui/admin/HorizontalAccordion';

export default function AddTestimonialPage() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

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
      newErrors.role = "Role is required"; // We should probably add a translation key ideally, but hardcoding for now as per instructions or using a generic one if available.
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await pb.collection('testimonials').create({
        full_name: formData.full_name,
        role: formData.role,
        role_fr: formData.role_fr,
        location: formData.location,
        description: formData.description,
        description_fr: formData.description_fr
      });
      // Show success message
      showToast(t('add.success.created'), 'success');
      router.push('/admin/testimonials');
    } catch (err) {
      console.error('Failed to create testimonial:', err);
      showToast('Failed to create testimonial', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('add.title')}</h1>
        </div>
        <Link
          href="/admin/testimonials"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t('add.backToTestimonials')}
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

          <HorizontalAccordion
            englishLabel="Testimonial Description (English)"
            englishValue={formData.description}
            englishPlaceholder={t('add.form.descriptionPlaceholder')}
            onEnglishChange={(value) => {
              setFormData(prev => ({ ...prev, description: value }));
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: '' }));
              }
            }}
            englishRequired={true}
            frenchLabel="Testimonial Description (French)"
            frenchValue={formData.description_fr}
            frenchPlaceholder="Description du témoignage en français"
            onFrenchChange={(value) => setFormData(prev => ({ ...prev, description_fr: value }))}
            frenchRequired={false}
            fieldType="textarea"
            uniqueId="testimonial-description"
            error={errors.description}
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