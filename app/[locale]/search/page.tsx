import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import SearchView from "@/components/layout/SearchView";

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.search.meta');

     return {
          title: t('title') || 'Search Results - Remes',
          description: t('description') || 'Search through our articles and content',
     };
}

export default function SearchPage() {
     return (
          <>
               <SearchView />
          </>
     );
} 