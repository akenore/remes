import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import NursingView from "@/components/layout/NursingView";
import { buildLocalizedMetadata, resolveLocaleParam, resolveLocalizedPath, buildCanonicalUrl } from '@/lib/seo';
import { REMES_CONTACT } from '@/lib/contact';

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

type PageParams = {
     params: { locale?: string };
};

export default async function NursingHome({ params }: PageParams) {
     const locale = await resolveLocaleParam(params);
     const tMeta = await getTranslations({ locale, namespace: 'frontend.nursingHome.meta' });
     const description = tMeta('description');
     const serviceTranslations = await getTranslations({ locale, namespace: 'frontend.nursingHome.hero.cards' });

     const url = buildCanonicalUrl(resolveLocalizedPath(locale, '/nursing-home'));
     const image = buildCanonicalUrl('/hero-2/bg-desktop.jpeg');

     const serviceKeys = ['residence', 'solutions', 'expertise', 'offer'] as const;
     const availableService = serviceKeys.map((key) => ({
          '@type': 'Service',
          name: serviceTranslations(`${key}.title`),
          description: serviceTranslations(`${key}.description`),
     }));

     const structuredData = {
          '@context': 'https://schema.org',
          '@type': 'NursingHome',
          '@id': `${url}#nursing-home`,
          name: REMES_CONTACT.organizationName,
          description,
          url,
          telephone: REMES_CONTACT.phone,
          image,
          address: {
               '@type': 'PostalAddress',
               streetAddress: REMES_CONTACT.streetAddress,
               addressLocality: REMES_CONTACT.addressLocality,
               addressRegion: REMES_CONTACT.addressRegion,
               postalCode: REMES_CONTACT.postalCode,
               addressCountry: REMES_CONTACT.addressCountry,
          },
          sameAs: [REMES_CONTACT.mapUrl],
          availableService,
     };

     return (
          <>
               <NursingView />
               <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
               />
          </>
     );
}
