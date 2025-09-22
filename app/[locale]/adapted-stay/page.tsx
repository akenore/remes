import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import AdaptedView from "@/components/layout/AdaptedView";

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.adaptedStay.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function AdaptedStay() {
     return (
          <>
               <AdaptedView />
          </>
     );
}