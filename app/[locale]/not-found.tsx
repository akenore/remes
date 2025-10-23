'use client';

import Link from 'next/link';
import FuzzyText from '@/components/animations/FuzzyText';
import { useTranslations } from 'next-intl';

export default function LocalizedNotFoundPage() {
  const t = useTranslations('notFound');

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-blue">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">{t('title')}</h1>
        <div className="py-20">
          <FuzzyText baseIntensity={0.2} enableHover={false} fontSize={128}>
            404
          </FuzzyText>
        </div>
        <p className="mb-6 text-white max-w-md mx-2">{t('description')}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-dark-gold text-dark-blue hover:opacity-90 transition"
        >
          {t('button')}
        </Link>
      </div>
    </div>
  );
}
