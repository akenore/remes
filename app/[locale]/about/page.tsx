import AboutView from "@/components/layout/AboutView";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { buildLocalizedMetadata, resolveLocaleParam } from '@/lib/seo';

export async function generateMetadata({
     params,
}: {
     params: { locale?: string } | Promise<{ locale?: string }>;
}): Promise<Metadata> {
     const locale = await resolveLocaleParam(params);
     const t = await getTranslations({ locale, namespace: 'frontend.about.meta' });

     return buildLocalizedMetadata({
          locale,
          path: '/about',
          title: t('title'),
          description: t('description'),
     });
}

export default function About() {
     return (
          <>
               <AboutView />
          </>
     );
}
