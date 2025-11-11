import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import AdaptedView from "@/components/layout/AdaptedView";
import { buildLocalizedMetadata, resolveLocaleParam, resolveLocalizedPath, buildCanonicalUrl } from '@/lib/seo';
import { REMES_CONTACT } from '@/lib/contact';

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

type PageParams = {
     params: { locale?: string };
};

export default async function AdaptedStay({ params }: PageParams) {
     const locale = await resolveLocaleParam(params);
     const tMeta = await getTranslations({ locale, namespace: 'frontend.adaptedStay.meta' });
     const description = tMeta('description');
     const cardsTranslations = await getTranslations({ locale, namespace: 'frontend.adaptedStay.hero.cards' });

     const url = buildCanonicalUrl(resolveLocalizedPath(locale, '/adapted-stay'));

     const offerKeys = ['accommodation', 'transport', 'care', 'equipment'] as const;
     const makesOffer = offerKeys.map((key) => ({
          '@type': 'Offer',
          name: cardsTranslations(`${key}.title`),
          description: cardsTranslations(`${key}.description`),
          availability: 'https://schema.org/InStock',
     }));

     const structuredData = {
          '@context': 'https://schema.org',
          '@type': 'MedicalBusiness',
          '@id': `${url}#adapted-stay`,
          name: `${REMES_CONTACT.organizationName} - Adapted Stays`,
          description,
          url,
          telephone: REMES_CONTACT.phone,
          address: {
               '@type': 'PostalAddress',
               streetAddress: REMES_CONTACT.streetAddress,
               addressLocality: REMES_CONTACT.addressLocality,
               addressRegion: REMES_CONTACT.addressRegion,
               postalCode: REMES_CONTACT.postalCode,
               addressCountry: REMES_CONTACT.addressCountry,
          },
          provider: {
               '@type': 'Organization',
               name: REMES_CONTACT.organizationName,
               url: buildCanonicalUrl('/'),
          },
          makesOffer,
     };

     return (
          <>
               <AdaptedView />
               <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
               />
          </>
     );
}
