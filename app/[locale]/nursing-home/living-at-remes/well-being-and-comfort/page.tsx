
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.nursingHome.livingAtRemes.wellBeingAndComfort.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function WellBeingAndComfort() {
     const t = useTranslations('frontend.nursingHome.livingAtRemes.wellBeingAndComfort');
     
     return (
          <>
               <Hero3
                    title={t('hero.title')}
                    description={t('hero.description')}
               />
               <main className="pt-40">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="md:px-14 mb-20">
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.philosophy')}
                              </p>
                              <ul className="text-[1.3rem] text-gray mb-8">
                                   <li>
                                        <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                             <li>{t('content.services.hairSalon')}</li>
                                             <li>{t('content.services.podiatry')}</li>
                                             <li>{t('content.services.massage')}</li>
                                             <li>{t('content.services.pools')}</li>
                                             <li>{t('content.services.aquagym')}</li>
                                        </ol>
                                   </li>
                              </ul>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.impact')}
                              </p>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.conclusion')}
                              </p>
                         </div>
                    </div>
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}