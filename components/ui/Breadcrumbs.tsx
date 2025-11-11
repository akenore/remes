'use client';

import { useMemo } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';

type AppPathname = keyof typeof routing.pathnames;
type DynamicPathname = `${string}[${string}`;
type StaticAppPathname = Exclude<AppPathname, DynamicPathname>;

type BreadcrumbItem = {
  label: string;
  href?: StaticAppPathname;
};

interface BreadcrumbsProps {
  variant?: 'light' | 'dark';
  className?: string;
}

const KNOWN_LOCALES = routing.locales as readonly string[];
const STATIC_PATHS = Object.keys(routing.pathnames).filter((path) => !path.includes('[')) as StaticAppPathname[];
const STATIC_PATH_SET = new Set<string>(STATIC_PATHS);

const BREADCRUMB_LABEL_KEYS: Record<string, string> = {
  '/': 'frontend.menu.home',
  '/nursing-home': 'frontend.menu.nursingHome',
  '/nursing-home/the-residence': 'frontend.nursingHome.hero.cards.residence.title',
  '/nursing-home/hosting-solutions': 'frontend.nursingHome.hero.cards.solutions.title',
  '/nursing-home/care-expertise': 'frontend.nursingHome.hero.cards.expertise.title',
  '/nursing-home/our-offers': 'frontend.nursingHome.hero.cards.offer.title',
  '/nursing-home/living-at-remes/entertainment-and-activities': 'frontend.nursingHome.content.living.cards.activities.title',
  '/nursing-home/living-at-remes/meals-and-daily-services': 'frontend.nursingHome.content.living.cards.meals.title',
  '/nursing-home/living-at-remes/well-being-and-comfort': 'frontend.nursingHome.content.living.cards.wellbeing.title',
  '/adapted-stay': 'frontend.menu.adaptedStay',
  '/adapted-stay/adapted-accommodation': 'frontend.adaptedStay.hero.cards.accommodation.title',
  '/adapted-stay/adapted-transport': 'frontend.adaptedStay.hero.cards.transport.title',
  '/adapted-stay/adapted-care': 'frontend.adaptedStay.hero.cards.care.title',
  '/adapted-stay/medical-equipment': 'frontend.adaptedStay.hero.cards.equipment.title',
  '/adapted-stay/professional-services': 'frontend.professionalServices.hero.title',
  '/about': 'frontend.about.hero.title',
  '/magazine': 'frontend.menu.magazine',
  '/search': 'frontend.search.title',
  '/terms-of-use': 'frontend.termsOfUse.hero.title',
  '/privacy-policy': 'frontend.privacyPolicy.hero.title',
};

const SEGMENT_CANONICAL_MAP = (() => {
  const map = new Map<string, string>();

  const registerSegments = (canonicalSegments: string[], path: string) => {
    const localizedSegments = path.split('/').filter(Boolean);
    localizedSegments.forEach((segment, index) => {
      const canonicalSegment = canonicalSegments[index];
      if (!canonicalSegment || canonicalSegment.includes('[')) {
        return;
      }

      if (!map.has(segment)) {
        map.set(segment, canonicalSegment);
      }
    });
  };

  Object.entries(routing.pathnames).forEach(([canonicalPath, localized]) => {
    if (canonicalPath.includes('[')) {
      return;
    }

    const canonicalSegments = canonicalPath.split('/').filter(Boolean);
    registerSegments(canonicalSegments, canonicalPath);

    if (typeof localized === 'string') {
      registerSegments(canonicalSegments, localized);
    } else {
      Object.values(localized).forEach((path) => registerSegments(canonicalSegments, path));
    }
  });

  return map;
})();

const formatSegment = (segment: string) => {
  const cleaned = decodeURIComponent(segment).replace(/[-_]+/g, ' ').trim();
  if (!cleaned) {
    return segment;
  }

  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalizePath = (pathname?: string | null) => {
  if (!pathname) return [];
  const [raw] = pathname.split('?');
  const trimmed = raw?.replace(/\/+$/, '') ?? '';
  const parts = trimmed.split('/').filter(Boolean);

  if (parts.length && KNOWN_LOCALES.includes(parts[0])) {
    return parts.slice(1);
  }

  return parts;
};

export default function Breadcrumbs({ variant = 'light', className = '' }: BreadcrumbsProps) {
  const t = useTranslations();
  const pathname = usePathname();

  const segments = useMemo(() => normalizePath(pathname), [pathname]);

  const canonicalSegments = useMemo(
    () => segments.map((segment) => SEGMENT_CANONICAL_MAP.get(segment) ?? segment),
    [segments]
  );

  const crumbs = useMemo(() => {
    if (segments.length === 0) {
      return [] as BreadcrumbItem[];
    }

    const items: BreadcrumbItem[] = [
      {
        label: t('frontend.menu.home'),
        href: '/',
      },
    ];

    canonicalSegments.forEach((segment, index) => {
      const isLast = index === canonicalSegments.length - 1;
      const canonicalPath = `/${canonicalSegments.slice(0, index + 1).join('/')}`;
      const labelKey = BREADCRUMB_LABEL_KEYS[canonicalPath];
      const label = labelKey ? t(labelKey) : formatSegment(segments[index]);
      const href =
        !isLast && STATIC_PATH_SET.has(canonicalPath) ? (canonicalPath as StaticAppPathname) : undefined;

      items.push({ label, href });
    });

    return items;
  }, [canonicalSegments, segments, t]);

  if (crumbs.length === 0) {
    return null;
  }

  const baseTextClass = variant === 'dark' ? 'text-dark-blue/70' : 'text-white/80';
  const linkClass = variant === 'dark' ? 'hover:text-gold' : 'hover:text-[#EEDAB8]';
  const separatorClass = variant === 'dark' ? 'text-dark-blue/30' : 'text-white/40';
  const currentClass = variant === 'dark' ? 'text-dark-blue font-semibold' : 'text-white font-semibold';

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center ${baseTextClass} text-xs sm:text-sm ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className={`transition-colors ${baseTextClass} ${linkClass}`}>
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? currentClass : baseTextClass} aria-current={isLast ? 'page' : undefined}>
                  {crumb.label}
                </span>
              )}
              {index < crumbs.length - 1 && <span className={`${separatorClass}`}>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
