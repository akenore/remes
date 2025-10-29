import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
import Image from "next/image";
import { buildLocalizedMetadata, resolveLocaleParam } from '@/lib/seo';

export async function generateMetadata({
     params,
}: {
     params: { locale?: string } | Promise<{ locale?: string }>;
}): Promise<Metadata> {
     const locale = await resolveLocaleParam(params);
     const t = await getTranslations({ locale, namespace: 'frontend.nursingHome.hostingSolutions.meta' });

     return buildLocalizedMetadata({
          locale,
          path: '/nursing-home/hosting-solutions',
          title: t('title'),
          description: t('description'),
     });
}

export default function HostingSolutions() {
     const t = useTranslations('frontend.nursingHome.hostingSolutions');
     const imageSrcDesktop = "/adapted-r-desktop.jpg";
     const imageSrcMobile = "/adapted-r-desktop.jpg";
     
     return (
          <>
               <Hero3
                    title={t('hero.title')}
                    description={t('hero.description')}
               />
               <main className="pt-40">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">
                                        {t('content.permanent.title')}
                                   </h2>
                                   <p className="text-[1.3rem] text-gray mb-8">
                                        {t('content.permanent.paragraph1')}
                                   </p>
                                   <p className="text-[1.3rem] text-gray mb-8">
                                        {t('content.permanent.paragraph2')}
                                   </p>
                                   <p className="text-[1.3rem] text-gray mb-8">
                                        {t('content.permanent.paragraph3')}
                                   </p>
                              </div>
                              <div className="mb-10">
                                   <Image
                                        src={imageSrcDesktop}
                                        alt={t('content.images.alt')}
                                        className="hidden md:block"
                                        width={610}
                                        height={648}
                                        style={{ width: "100%", height: "auto" }}
                                   />
                                   <Image
                                        src={imageSrcMobile}
                                        alt={t('content.images.alt')}
                                        className="block md:hidden"
                                        width={370}
                                        height={434}
                                        style={{ width: "100%", height: "auto" }}
                                   />
                              </div>
                         </div>
                         <div className="md:px-14">
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.priority.text')}
                              </p>
                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">
                                   {t('content.temporary.title')}
                              </h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.temporary.paragraph')}
                              </p>
                              <ul className="text-[1.3rem] text-gray mb-8">
                                   <li>
                                        <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                             <li>{t('content.temporary.benefits.benefit1')}</li>
                                             <li>{t('content.temporary.benefits.benefit2')}</li>
                                             <li>{t('content.temporary.benefits.benefit3')}</li>
                                             <li>{t('content.temporary.benefits.benefit4')}</li>
                                        </ol>
                                   </li>
                              </ul>
                              <p className="text-[1.3rem] text-center md:text-left text-gray mb-20">
                                   {t('content.temporary.details')}
                              </p>
                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">
                                   {t('content.daycare.title')}
                              </h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.daycare.paragraph')}
                              </p>
                              <ul className="text-[1.3rem] text-gray mb-8">
                                   <li>
                                        <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                             <li>{t('content.daycare.benefits.benefit1')}</li>
                                             <li>{t('content.daycare.benefits.benefit2')}</li>
                                             <li>{t('content.daycare.benefits.benefit3')}</li>
                                        </ol>
                                   </li>
                              </ul>
                              <p className="text-[1.3rem] text-center md:text-left text-gray mb-20">
                                   {t('content.daycare.conclusion')}
                              </p>
                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">
                                   {t('content.convalescence.title')}
                              </h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.convalescence.paragraph')}
                              </p>
                              <ul className="text-[1.3rem] text-gray mb-8">
                                   <li>
                                        <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                             <li>{t('content.convalescence.benefits.benefit1')}</li>
                                             <li>{t('content.convalescence.benefits.benefit2')}</li>
                                             <li>{t('content.convalescence.benefits.benefit3')}</li>
                                             <li>{t('content.convalescence.benefits.benefit4')}</li>
                                        </ol>
                                   </li>
                              </ul>
                              <p className="text-[1.3rem] text-center md:text-left text-gray mb-20">
                                   {t('content.convalescence.conclusion')}
                              </p>
                         </div>
                    </div>
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}
