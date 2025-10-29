import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ??
  'https://www.remes-tunisie.com';

const defaultLocale = routing.defaultLocale ?? 'en';

type Pathnames = typeof routing.pathnames;

function getRoutingEntry(path: string) {
  return (routing.pathnames as Pathnames)[path as keyof Pathnames];
}

export function resolveLocalizedPath(locale: string, path: string): string {
  let localized = path;
  const entry = getRoutingEntry(path);

  if (typeof entry === 'string') {
    localized = entry;
  } else if (entry && typeof entry === 'object') {
    const localizedValue = entry[locale as keyof typeof entry];
    if (typeof localizedValue === 'string') {
      localized = localizedValue;
    }
  }

  if (!localized.startsWith('/')) {
    localized = `/${localized}`;
  }

  if (localized === '/' || localized === '') {
    return locale === defaultLocale ? '/' : `/${locale}`;
  }

  if (locale === defaultLocale) {
    return localized;
  }

  return `/${locale}${localized}`;
}

export function buildLocalizedMetadata({
  locale,
  path,
  title,
  description,
  metadata,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  metadata?: Partial<Metadata>;
}): Metadata {
  const localizedPath = resolveLocalizedPath(locale, path);
  const canonical = `${baseUrl}${localizedPath}`;

  const canonicalAlternate = localizedPath === '/' ? baseUrl : canonical;

  const languageAlternates: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    languageAlternates[loc] = `${baseUrl}${resolveLocalizedPath(loc, path)}`;
  });

  return {
    title,
    description,
    alternates: {
      canonical: canonicalAlternate,
      languages: languageAlternates,
    },
    ...(metadata ?? {}),
  };
}

export function buildCanonicalUrl(urlPath: string): string {
  if (!urlPath.startsWith('/')) {
    return `${baseUrl}/${urlPath}`;
  }
  return `${baseUrl}${urlPath}`;
}

type LocaleParam =
  | { locale?: string }
  | Promise<{ locale?: string }>;

export async function resolveLocaleParam(
  params: LocaleParam
): Promise<string> {
  const { locale } = await params;
  return locale ?? defaultLocale;
}
