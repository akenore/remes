import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import NursingView from "@/components/layout/NursingView";
import { buildLocalizedMetadata, resolveLocaleParam } from '@/lib/seo';

export async function generateMetadata({
     params,
}: {
     params: { locale?: string } | Promise<{ locale?: string }>;
}): Promise<Metadata> {
     const locale = await resolveLocaleParam(params);
     const t = await getTranslations({ locale, namespace: 'frontend.nursingHome.meta' });

     return buildLocalizedMetadata({
          locale,
          path: '/nursing-home',
          title: t('title'),
          description: t('description'),
     });
}

export default function NursingHome() {


     return (
          <>
               <NursingView />
          </>
     );
}
