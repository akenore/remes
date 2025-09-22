
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.termsOfUse.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function TermsOfUse() {
     const t = useTranslations('frontend.termsOfUse');
     const locale = useLocale();
     
     return (
          <>
               <Hero3
                    title={t('hero.title')}
                    description={t('hero.description')}
               />
               <main className="pt-40">
                    <div className="mx-5 md:mx-auto max-w-7xl">

                         <div className="md:px-14 mb-20">
                              <p className="text-sm text-gray-500 mb-5">
                                   {t('content.lastUpdated')} {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                              </p>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.introduction')}
                              </p>

                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">{t('content.sections.section1.title')}</h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.sections.section1.content')}
                              </p>

                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">{t('content.sections.section2.title')}</h2>
                              <ul className="text-[1.3rem] text-gray mb-8">
                                   <li>
                                        <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                             <li>{t('content.sections.section2.item1')}</li>
                                             <li>{t('content.sections.section2.item2')}</li>
                                             <li>{t('content.sections.section2.item3')}</li>
                                        </ol>
                                   </li>
                              </ul>

                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">{t('content.sections.section3.title')}</h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.sections.section3.content')}
                              </p>

                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">{t('content.sections.section4.title')}</h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.sections.section4.content')}
                              </p>

                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">{t('content.sections.section5.title')}</h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.sections.section5.content')}
                              </p>

                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">{t('content.sections.section6.title')}</h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.sections.section6.content')}
                              </p>

                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">{t('content.sections.section7.title')}</h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.sections.section7.content')}
                              </p>

                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">{t('content.sections.section8.title')}</h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.sections.section8.content')}
                              </p>
                         </div>
                    </div>
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}