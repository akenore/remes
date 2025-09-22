
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.privacyPolicy.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function PrivacyPolicy() {
     const t = useTranslations('frontend.privacyPolicy');
     const locale = useLocale();
     
     return (
          <>
               <Hero3
                    title={t('hero.title')}
                    description={t('hero.description')}
               />
               <main className="pt-40">
                    <div className="mx-5 md:mx-auto max-w-7xl mb-20">
                         <p className="text-gray mb-8 text-[1.1rem]">
                              {t('content.lastUpdated')} {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                         </p>

                         <p className="mb-6 text-[1.1rem]">
                              {t('content.introduction')}
                         </p>

                         <h2 className="text-2xl font-semibold text-dark-blue mb-4">{t('content.sections.section1.title')}</h2>
                         <p className="mb-6 text-[1.1rem]">
                              {t('content.sections.section1.content')}
                         </p>

                         <h2 className="text-2xl font-semibold text-dark-blue mb-4">{t('content.sections.section2.title')}</h2>
                         <ul className="list-disc list-inside mb-6 text-[1.1rem]">
                              <li>{t('content.sections.section2.item1')}</li>
                              <li>{t('content.sections.section2.item2')}</li>
                              <li>{t('content.sections.section2.item3')}</li>
                         </ul>

                         <h2 className="text-2xl font-semibold text-dark-blue mb-4">{t('content.sections.section3.title')}</h2>
                         <ul className="list-disc list-inside mb-6 text-[1.1rem]">
                              <li>{t('content.sections.section3.item1')}</li>
                              <li>{t('content.sections.section3.item2')}</li>
                              <li>{t('content.sections.section3.item3')}</li>
                         </ul>

                         <h2 className="text-2xl font-semibold text-dark-blue mb-4">{t('content.sections.section4.title')}</h2>
                         <p className="mb-6 text-[1.1rem]">
                              {t('content.sections.section4.content')}
                         </p>

                         <h2 className="text-2xl font-semibold text-dark-blue mb-4">{t('content.sections.section5.title')}</h2>
                         <p className="mb-6 text-[1.1rem]">
                              {t('content.sections.section5.content')}
                         </p>

                         <h2 className="text-2xl font-semibold text-dark-blue mb-4">{t('content.sections.section6.title')}</h2>
                         <p className="mb-6 text-[1.1rem]">
                              {t('content.sections.section6.content')}
                         </p>

                         <h2 className="text-2xl font-semibold text-dark-blue mb-4">{t('content.sections.section7.title')}</h2>
                         <p className="mb-6 text-[1.1rem]">
                              {t('content.sections.section7.content')}
                         </p>

                         <h2 className="text-2xl font-semibold text-dark-blue mb-4">{t('content.sections.section8.title')}</h2>
                         <p className="mb-6 text-[1.1rem]">
                              {t('content.sections.section8.content')}
                         </p>

                         <h2 className="text-2xl font-semibold text-dark-blue mb-4">{t('content.sections.section9.title')}</h2>
                         <p className="mb-6 text-[1.1rem]">
                              {t('content.sections.section9.content')}
                         </p>

                         <h2 className="text-2xl font-semibold text-dark-blue mb-4">{t('content.sections.section10.title')}</h2>
                         <p className="mb-6 text-[1.1rem]">
                              {t('content.sections.section10.content')}
                         </p>
                    </div>
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}