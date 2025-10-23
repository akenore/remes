'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

export default function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;

    const currentPath = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    const windowPath = typeof window !== 'undefined' ? window.location.pathname : currentPath;

    if (typeof document !== 'undefined') {
      const basePath = currentPath === '/' ? windowPath : windowPath.replace(currentPath, '');
      const cookiePath = basePath !== '' ? basePath : '/';
      document.cookie = `NEXT_LOCALE=${newLocale};path=${cookiePath};SameSite=Lax`;
    }

    router.replace(currentPath, { locale: newLocale });
  };

  return (
    <div className="relative inline-block text-left">
      <label htmlFor="language-select" className="sr-only">
        {t('selectLanguage')}
      </label>
      <select
        id="language-select"
        name="language"
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label={t('selectLanguage')}
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc === 'en' ? t('english') : t('french')}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
} 
