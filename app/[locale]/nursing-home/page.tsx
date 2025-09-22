import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import NursingView from "@/components/layout/NursingView";

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.nursingHome.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function NursingHome() {


     return (
          <>
               <NursingView />
          </>
     );
}