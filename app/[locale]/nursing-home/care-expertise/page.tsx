
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
     const t = await getTranslations({ locale, namespace: 'frontend.nursingHome.careExpertise.meta' });

     return buildLocalizedMetadata({
          locale,
          path: '/nursing-home/care-expertise',
          title: t('title'),
          description: t('description'),
     });
}

export default function CareExpertise() {
     const t = useTranslations('frontend.nursingHome.careExpertise');
     const imageSrcDesktop = "/p-c.jpeg";
     const imageSrcMobile = "/p-c.jpeg";
     
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
                                        {t('content.presence.title')}
                                   </h2>
                                   <p className="text-[1.3rem] text-gray mb-8">
                                        {t('content.presence.paragraph1')}
                                   </p>
                                   <p className="text-[1.3rem] text-gray mb-8">
                                        {t('content.presence.paragraph2')}
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
                         <div className="md:px-14 mb-20">
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.paramedical.paragraph')}
                              </p>
                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">
                                   {t('content.multidisciplinary.title')}
                              </h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.multidisciplinary.paragraph')}
                              </p>
                              <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">
                                   {t('content.safety.title')}
                              </h2>
                              <p className="text-[1.3rem] text-gray mb-8">
                                   {t('content.safety.paragraph')}
                              </p>
                         </div>
                    </div>
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}
