import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import MagazineView from "@/components/layout/MagazineView";
import { buildLocalizedMetadata, resolveLocaleParam } from '@/lib/seo';

export async function generateMetadata({
     params,
}: {
     params: { locale?: string } | Promise<{ locale?: string }>;
}): Promise<Metadata> {
     const locale = await resolveLocaleParam(params);
     const t = await getTranslations({ locale, namespace: 'frontend.magazine.meta' });

     return buildLocalizedMetadata({
          locale,
          path: '/magazine',
          title: t('title'),
          description: t('description'),
     });
}

export default function Magazine() {
     return (
          <>
               <MagazineView />
          </>
     );
}
