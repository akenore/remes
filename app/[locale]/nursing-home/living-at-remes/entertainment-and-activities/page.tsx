
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.nursingHome.livingAtRemes.entertainmentAndActivities.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function EntertainmentAndActivities() {
     const t = useTranslations('frontend.nursingHome.livingAtRemes.entertainmentAndActivities');
     
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
                                   {t('content.introduction')}
                              </p>
                              <ul className="text-[1.3rem] text-gray mb-8">
                                   <li>
                                        <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                             <li>{t('content.activities.activity1')}</li>
                                             <li>{t('content.activities.activity2')}</li>
                                             <li>{t('content.activities.activity3')}</li>
                                             <li>{t('content.activities.activity4')}</li>
                                             <li>{t('content.activities.activity5')}</li>
                                        </ol>
                                   </li>
                              </ul>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.externalIntervenants')}
                              </p>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.outings')}
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