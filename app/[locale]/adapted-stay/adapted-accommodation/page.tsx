
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
// import PriceCard from "@/components/ui/card/PriceCard";
import PageSection from "@/components/ui/PageSection";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata(): Promise<Metadata> {
     const t = await getTranslations('frontend.adaptedAccommodation.meta');

     return {
          title: t('title'),
          description: t('description'),
     };
}

export default function AdaptedAccommodation() {
     const t = useTranslations('frontend.adaptedAccommodation');

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
                         ]}
                    />
                    <div className="mx-5 md:mx-auto max-w-7xl text-[1.3rem] mb-20 mt-5">
                         <ul className="md:px-14">
                              <li>
                                   {t('content.features.title')} :
                                   <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                        <li>{t('content.features.item1')}</li>
                                        <li>{t('content.features.item2')}</li>
                                        <li>{t('content.features.item3')}</li>
                                        <li>{t('content.features.item4')}</li>
                                        <li>{t('content.features.item5')}</li>
                                        <li>{t('content.features.item6')}</li>
                                        <li>{t('content.features.item7')}</li>
                                   </ol>
                              </li>
                         </ul>
                         <p className="text-gray mt-5">
                         {t('content.conclusion')}
                         </p>
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