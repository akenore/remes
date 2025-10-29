import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { pb } from '@/lib/pocketbase';
import { buildCanonicalUrl } from '@/lib/seo';
import { routing } from '@/i18n/routing';
import type { ClientResponseError } from 'pocketbase';

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

type Params =
  | { locale?: string; slug: string }
  | Promise<{ locale?: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const resolved = await params;
  const locale = resolved.locale ?? routing.defaultLocale;
  const slug = resolved.slug;

  const filters =
    locale === 'fr'
      ? [`slug_fr="${slug}"`, `slug="${slug}"`]
      : [`slug="${slug}"`, `slug_fr="${slug}"`];

  let post: any = null;

  for (const filter of filters) {
    try {
      post = await pb.collection('posts').getFirstListItem(filter, {
        expand: 'categories',
        requestKey: null,
      });
      if (post) break;
    } catch (error) {
      const err = error as ClientResponseError;
      if (!err || err.status !== 404) {
        throw error;
      }
    }
  }

  if (!post) {
    const fallback = await getTranslations({
      locale,
      namespace: 'frontend.magazine.meta',
    });

    return {
      title: fallback('title'),
      description: fallback('description'),
    };
  }

  const primarySlug = post.slug as string;
  const frenchSlug = (post.slug_fr as string) || primarySlug;

  const localizedTitle =
    locale === 'fr' && typeof post.title_fr === 'string' && post.title_fr.trim()
      ? post.title_fr
      : post.title;

  const rawContent =
    locale === 'fr' && typeof post.content_fr === 'string' && post.content_fr.trim()
      ? post.content_fr
      : post.content || '';

  const description =
    stripHtml(rawContent).slice(0, 155).replace(/\s+\S*$/, '').trim() ||
    localizedTitle;

  const collectionSegment = post.collectionId || post.collectionName || 'posts';
  const coverImage =
    post.cover_image && typeof post.cover_image === 'string'
      ? `${pb.baseURL}/api/files/${collectionSegment}/${post.id}/${post.cover_image}`
      : undefined;

  const canonicalPath =
    locale === 'fr' ? `/fr/magazine/${frenchSlug}` : `/magazine/${primarySlug}`;

  return {
    title: localizedTitle,
    description,
    alternates: {
      canonical: buildCanonicalUrl(canonicalPath),
      languages: {
        en: buildCanonicalUrl(`/magazine/${primarySlug}`),
        fr: buildCanonicalUrl(`/fr/magazine/${frenchSlug}`),
      },
    },
    openGraph: {
      type: 'article',
      url: buildCanonicalUrl(canonicalPath),
      title: localizedTitle,
      description,
      images: coverImage ? [{ url: coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedTitle,
      description,
      images: coverImage ? [coverImage] : undefined,
    },
  };
}
