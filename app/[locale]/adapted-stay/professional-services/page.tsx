
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactFormB2B from "@/components/ui/ContactFormB2B";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.professionalServices.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function ProfessionalServices() {
     const t = useTranslations('frontend.professionalServices');

     return (
          <>
               <Hero3
                    title={t('hero.title')}
                    description={t('hero.description')}
               />
               <main className="py-40">
                    <div className="max-w-7xl mx-5 md:mx-auto">
                         <ContactFormB2B />
                    </div>
               </main>
               <Footer />
          </>
     );
}