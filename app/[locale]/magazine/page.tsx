import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import MagazineView from "@/components/layout/MagazineView";

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.home.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function Magazine() {
     return (
          <>
               <MagazineView />
          </>
     );
}