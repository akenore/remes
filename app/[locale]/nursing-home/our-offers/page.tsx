
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
import { buildLocalizedMetadata, resolveLocaleParam } from '@/lib/seo';

export async function generateMetadata({
     params,
}: {
     params: { locale?: string } | Promise<{ locale?: string }>;
}): Promise<Metadata> {
     const locale = await resolveLocaleParam(params);
     const t = await getTranslations({ locale, namespace: 'frontend.nursingHome.ourOffer.meta' });

     return buildLocalizedMetadata({
          locale,
          path: '/nursing-home/our-offers',
          title: t('title'),
          description: t('description'),
     });
}

export default function OurOffer() {
     const t = useTranslations('frontend.nursingHome.ourOffer');
     
     return (
          <>
               <Hero3
                    title={t('hero.title')}
                    description={t('hero.description')}
               />
               <main className="pt-40">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 gap-8">
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[3.1rem] text-dark-blue font-myanmar mb-8">
                                        {t('content.title')}
                                   </h2>
                                   <p className="text-[1.3rem] text-gray mb-8">
                                        {t('content.description')}
                                   </p>

                              </div>
                              {/* <div className="mb-10">
                                   <Image
                                        src={imageSrcDesktop}
                                        alt={imageAlt}
                                        className="hidden md:block"
                                        width={610}
                                        height={648}
                                        style={{ width: "100%", height: "auto" }}
                                   />
                                   <Image
                                        src={imageSrcMobile}
                                        alt={imageAlt}
                                        className="block md:hidden"
                                        width={370}
                                        height={434}
                                        style={{ width: "100%", height: "auto" }}
                                   />
                              </div> */}
                         </div>
                         <div className="md:px-14 mb-20">
                              <section className="py-16">
                                   <div className="max-w-6xl mx-auto px-6 ">
                                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                                             <div className="bg-white shadow-lg rounded-2xl p-8">
                                                  <h3 className="text-2xl text-gray font-semibold mb-4">{t('content.pricing.permanent.title')}</h3>
                                                  <p className="text-4xl font-bold text-blue mb-2">
                                                       {t('content.pricing.permanent.price')} <span className="text-lg font-normal">{t('content.pricing.permanent.period')}</span>
                                                  </p>
                                                  <p className="text-sm text-gray-500 mb-6">
                                                       {t('content.pricing.permanent.description')}
                                                  </p>
                                             </div>

                                             <div className="bg-white shadow-lg rounded-2xl p-8">
                                                  <h3 className="text-2xl text-gray font-semibold mb-4">{t('content.pricing.temporary.title')}</h3>
                                                  <ul className="space-y-2 text-gray-700 text-left">
                                                       <li>
                                                            <span className="font-bold text-blue">{t('content.pricing.temporary.lowSeason.price')}</span> {t('content.pricing.temporary.lowSeason.period')}
                                                       </li>
                                                       <li>
                                                            <span className="font-bold text-blue">{t('content.pricing.temporary.highSeason.price')}</span> {t('content.pricing.temporary.highSeason.period')}
                                                       </li>
                                                  </ul>
                                                  <p className="mt-4 text-sm text-gray-500">
                                                       {t('content.pricing.temporary.description')}
                                                  </p>
                                             </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6 text-left">
                                             {[
                                                  t('content.services.service1'),
                                                  t('content.services.service2'),
                                                  t('content.services.service3'),
                                                  t('content.services.service4'),
                                                  t('content.services.service5'),
                                                  t('content.services.service6'),
                                                  t('content.services.service7'),
                                                  t('content.services.service8'),
                                                  t('content.services.service9'),
                                                  t('content.services.service10')
                                             ].map((item, idx) => (
                                                  <div
                                                       key={idx}
                                                       className="flex items-start bg-white p-4 rounded-xl shadow-sm"
                                                  >
                                                       <span className="text-gblue mr-3">✔</span>
                                                       <p className="text-gray-700">{item}</p>
                                                  </div>
                                             ))}
                                        </div>
                                        <div className="mt-12 bg-blue border border-green-200 rounded-xl p-6">
                                             <p className="text-white text-[1.3rem] text-left">
                                                  {t('content.comparison.text1')} <br />
                                                  {/* {t('content.comparison.text2')}{" "}
                                                  <span className="font-bold">{t('content.comparison.francePrice')}</span> {t('content.comparison.text3')}{" "}
                                                  <span className="font-bold text-dark-gold">{t('content.comparison.ourPrice')}</span>. */}
                                             </p>
                                        </div>
                                   </div>
                              </section>
                         </div>
                    </div>
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}
