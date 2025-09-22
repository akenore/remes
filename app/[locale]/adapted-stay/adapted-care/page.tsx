
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
import PageSection from "@/components/ui/PageSection";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.adaptedCare.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function AdaptedCare() {
     const t = useTranslations('frontend.adaptedCare');

     return (
          <>
               <Hero3
                    title={t('hero.title')}
                    description={t('hero.description')}
               />
               <main className="pt-40">
                    <PageSection
                         title={t('content.title')}
                         paragraphs={[
                              t('content.paragraph1'),
                              t('content.paragraph2'),
                              t('content.paragraph3'),
                              t('content.paragraph4'),
                              t('content.paragraph5'),
                         ]}
                    />
                    <div className="mx-5 md:mx-auto max-w-7xl text-[1.3rem] mb-20 mt-5">
                         <ul className="md:px-14">
                              <li>
                              {t('content.services.title')}
                                   <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                        <li>{t('content.services.item1')}</li>
                                        <li>{t('content.services.item2')}</li>
                                        <li>{t('content.services.item3')}</li>
                                        <li>{t('content.services.item4')}</li>
                                        <li>{t('content.services.item5')}</li>
                                   </ol>
                              </li>
                              <li className="mt-5">
                                   <ol className="ps-5 mt-2 space-y-1 list-inside">
                                        <li>{t('content.conclusion')}</li>
                                   </ol>
                              </li>
                         </ul>
                    </div>
                    {/* <PriceCard
                         price="1000"
                         options={[
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                         ]}
                    /> */}
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}