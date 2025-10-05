
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.nursingHome.livingAtRemes.mealsAndDailyServices.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function MealsAndDailyServices() {
     const t = useTranslations('frontend.nursingHome.livingAtRemes.mealsAndDailyServices');
     
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
                                   {t('content.nutritionPhilosophy')}
                              </p>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.diningOptions')}
                              </p>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.familyWelcome')}
                              </p>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.specialNeeds')}
                              </p>
                              <p className="text-[1.3rem] text-gray mb-8">{t('content.dailyServices')}</p>
                              
                         </div>
                    </div>
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}