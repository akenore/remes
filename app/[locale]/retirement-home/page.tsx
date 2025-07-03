import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import NursingView from "@/components/layout/NursingView";
// TODO: add metadata for this page
export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.home.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function RetirementHome() {


     return (
          <>
               <NursingView />
          </>
     );
}