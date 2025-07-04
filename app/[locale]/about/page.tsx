import AboutView from "@/components/layout/AboutView";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.home.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function About() {
     return (
          <>
               <AboutView />
          </>
     );
}