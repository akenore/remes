'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { pb } from '@/lib/pocketbase';

interface EquipmentItem {
  id: string;
  image: string;
  description: string;
  description_fr: string;
  price_per_day: number;
  price_per_month: number;
  created: string;
  updated: string;
}

export default function EquipmentTable() {
  const t = useTranslations('frontend');
  const locale = useLocale();
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get localized content with fallback
  const getLocalizedDesignation = (item: EquipmentItem) => {
    const isFrench = locale === 'fr';
    // Always show original text if translation is missing to avoid errors
    if (isFrench && item.description_fr && item.description_fr.trim() !== '') {
      return item.description_fr;
    }
    return item.description || 'No description available';
  };

  // Function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Get proper image URL with fallback (simplified like admin)
  const getImageUrl = (item: EquipmentItem) => {
    // Check if image exists and is a valid string
    if (item.image && typeof item.image === 'string' && item.image.trim() !== '') {
      try {
        // Use the same simple method as admin
        return pb.files.getURL(item, item.image);
      } catch (error) {
        console.warn('Error getting image URL for equipment:', item.id, 'image:', item.image, 'error:', error);
      }
    }
    // Always return a valid fallback image
    return '/home/bg-d-2.jpg';
  };

  // Fetch equipment data (simplified like testimonials and admin)
  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch equipment items (no published filter like admin)
      const result = await pb.collection('medical_equipment').getList(1, 50, {
        sort: '-created',
        requestKey: null,
      });

      console.log('Medical equipment API result:', result);
      console.log('Items count:', result.items.length);
      console.log('First item:', result.items[0]);

      // Simple mapping like admin component
      setEquipment(result.items as unknown as EquipmentItem[]);
    } catch (error) {
      console.error('Failed to fetch equipment data:', error);
      setError('Failed to load equipment data');
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEquipmentData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 mt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-gold"></div>
        <p className="text-gray text-sm mt-4">{t('common.loading')}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20 mt-20">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={fetchEquipmentData}
          className="mt-4 bg-dark-blue text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
        >
          {t('common.retry') || 'Retry'}
        </button>
      </div>
    );
  }

  // No equipment available
  if (equipment.length === 0) {
    return (
      <div className="text-center py-20 mt-20">
        <p className="text-gray text-lg">{t('equipment.noEquipment') || 'No equipment available'}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-20">
      <table className="min-w-full border-[5px] border-white border-collapse text-left">
        <thead>
          <tr className="bg-blue text-white">
            <th className="px-6 py-4 whitespace-nowrap border-[5px] border-white">
              {t('equipment.table.image') || 'Image'}
            </th>
            <th className="px-6 py-4 whitespace-nowrap border-[5px] border-white">
              {t('equipment.table.designation') || 'Designation'}
            </th>
            <th className="px-6 py-4 whitespace-nowrap border-[5px] border-white">
              {t('equipment.table.dayPrice') || 'Day*'}
            </th>
            {/* <th className="px-6 py-4 whitespace-nowrap border-[5px] border-white">
              {t('equipment.table.monthPrice') || 'Month*'}
            </th> */}
          </tr>
        </thead>
        <tbody>
          {equipment.map((item, idx) => (
            <tr
              key={item.id}
              className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}
            >
              <td className="px-6 py-4 border-[5px] border-white">
                <div className="relative w-20 h-20">
                  <Image
                    src={getImageUrl(item)}
                    alt={getLocalizedDesignation(item)}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>
              </td>
              <td className="px-6 py-4 text-sm md:text-base border-[5px] border-white">
                {getLocalizedDesignation(item)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base border-[5px] border-white">
                {formatPrice(item.price_per_day)}
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base border-[5px] border-white">
                {formatPrice(item.price_per_month)}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 