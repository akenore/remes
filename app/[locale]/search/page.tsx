import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import SearchView from "@/components/layout/SearchView";
import { buildLocalizedMetadata, resolveLocaleParam } from '@/lib/seo';

export async function generateMetadata({
     params,
}: {
     params: { locale?: string } | Promise<{ locale?: string }>;
}): Promise<Metadata> {
     const locale = await resolveLocaleParam(params);
     const t = await getTranslations({ locale, namespace: 'frontend.search.meta' });

     return buildLocalizedMetadata({
          locale,
          path: '/search',
          title: t('title') || 'Search Results - Remes',
          description: t('description') || 'Search through our articles and content',
     });
}

export default function SearchPage() {
     return (
          <>
               <SearchView />
          </>
     );
} 
