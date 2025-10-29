import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import AdaptedView from "@/components/layout/AdaptedView";
import { buildLocalizedMetadata, resolveLocaleParam } from '@/lib/seo';

export async function generateMetadata({
     params,
}: {
     params: { locale?: string } | Promise<{ locale?: string }>;
}): Promise<Metadata> {
     const locale = await resolveLocaleParam(params);
     const t = await getTranslations({ locale, namespace: 'frontend.adaptedStay.meta' });

     return buildLocalizedMetadata({
          locale,
          path: '/adapted-stay',
          title: t('title'),
          description: t('description'),
     });
}

export default function AdaptedStay() {
     return (
          <>
               <AdaptedView />
          </>
     );
}
