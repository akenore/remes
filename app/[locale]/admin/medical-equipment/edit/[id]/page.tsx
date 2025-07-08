'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { pb } from '@/lib/pocketbase';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/lib/toast-context';
import HorizontalAccordion from '@/components/ui/admin/HorizontalAccordion';

interface MedicalEquipment {
  id: string;
  image: string;
  description: string;
  description_fr: string;
  price_per_day: number;
  price_per_month: number;
  created: string;
  updated: string;
}

export default function EditEquipmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations('admin.medicalEquipment');
  const tCommon = useTranslations('admin.common');
  
  const [formData, setFormData] = useState({
    description: '',
    description_fr: '',
    price_per_day: '',
    price_per_month: ''
  });
  const [currentImage, setCurrentImage] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [equipment, setEquipment] = useState<MedicalEquipment | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const record = await pb.collection('medical_equipment').getOne(id);
      const equipmentData = record as unknown as MedicalEquipment;
      
      setEquipment(equipmentData);
      setFormData({
        description: equipmentData.description,
        description_fr: equipmentData.description_fr || '',
        price_per_day: equipmentData.price_per_day.toString(),
        price_per_month: equipmentData.price_per_month.toString()
      });
      setCurrentImage(equipmentData.image);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
      router.push('/admin/medical-equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim()) {
      newErrors.description = t('add.validation.descriptionRequired');
    }
    if (!formData.price_per_day || Number(formData.price_per_day) <= 0) {
      newErrors.price_per_day = t('add.validation.pricePerDayRequired');
    }
    if (!formData.price_per_month || Number(formData.price_per_month) <= 0) {
      newErrors.price_per_month = t('add.validation.pricePerMonthRequired');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      const submitData = new FormData();
      submitData.append('description', formData.description);
      submitData.append('description_fr', formData.description_fr);
      submitData.append('price_per_day', formData.price_per_day);
      submitData.append('price_per_month', formData.price_per_month);
      
      // Only append image if a new one is selected
      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      await pb.collection('medical_equipment').update(id, submitData);
      // Show success message
      showToast(t('edit.success.updated'), 'success');
      router.push('/admin/medical-equipment');
    } catch (err) {
      console.error('Failed to update equipment:', err);
      showToast('Failed to update equipment', 'error');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getImageUrl = () => {
    if (imagePreview) return imagePreview;
    if (equipment && currentImage) {
      return pb.files.getURL(equipment, currentImage);
    }
    return null;
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
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{t('edit.notFound')}</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">{t('edit.notFound')}</p>
          <Link
            href="/admin/medical-equipment"
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {t('edit.backToEquipment')}
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
          href="/admin/medical-equipment"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t('edit.backToEquipment')}
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('add.form.image')}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {getImageUrl() ? (
                <div className="space-y-4">
                  <div className="relative w-32 h-32">
                    <Image
                      src={getImageUrl()!}
                      alt={t('add.form.imagePreview')}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      {t('add.form.changeImage')}
                    </label>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        setCurrentImage('');
                      }}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      Remove Image
                    </button>
                  </div>
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>{t('add.form.clickToUpload')}</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">{t('add.form.imageFormats')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <HorizontalAccordion
            uniqueId="edit-equipment-description"
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

          {/* Pricing */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="price_per_day" className="block text-sm font-medium text-gray-700">
                {t('add.form.pricePerDay')}
              </label>
              <input
                type="number"
                id="price_per_day"
                name="price_per_day"
                value={formData.price_per_day}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.price_per_day ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder={t('add.form.pricePerDayPlaceholder')}
              />
              {errors.price_per_day && (
                <p className="mt-1 text-sm text-red-600">{errors.price_per_day}</p>
              )}
            </div>

            <div>
              <label htmlFor="price_per_month" className="block text-sm font-medium text-gray-700">
                {t('add.form.pricePerMonth')}
              </label>
              <input
                type="number"
                id="price_per_month"
                name="price_per_month"
                value={formData.price_per_month}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.price_per_month ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder={t('add.form.pricePerMonthPlaceholder')}
              />
              {errors.price_per_month && (
                <p className="mt-1 text-sm text-red-600">{errors.price_per_month}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/medical-equipment"
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