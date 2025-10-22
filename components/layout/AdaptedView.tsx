import Hero2 from "../ui/hero/Hero2";
import Footer from "../ui/Footer";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import Icon from "../ui/Icon";
import Link from "next/link";

export default function AdaptedView() {
     const t = useTranslations('frontend.adaptedStay');

     return (
          <>
               <Hero2
                    title={t('hero.title')}
                    description={t('hero.description')}
                    cards={[
                         {
                              icon: <Icon name="BedIcon" sizeClass="w-full h-full" />,
                              title: t('hero.cards.accommodation.title'),
                              description: t('hero.cards.accommodation.description'),
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/adapted-accommodation",
                         },
                         {
                              icon: <Icon name="BusIcon" sizeClass="w-full h-full" />,
                              title: t('hero.cards.transport.title'),
                              description: t('hero.cards.transport.description'),
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/adapted-transport",
                         },
                         {
                              icon: <Icon name="HeartHandIcon" sizeClass="w-full h-full" />,
                              title: t('hero.cards.care.title'),
                              description: t('hero.cards.care.description'),
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/adapted-care",
                         },
                         {
                              icon: <Icon name="WheelchairIcon" sizeClass="w-full h-full" />,
                              title: t('hero.cards.equipment.title'),
                              description: t('hero.cards.equipment.description'),
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/medical-equipment",
                         },
                    ]}
                    bgMobile="/hero-4/bg-mobile.jpeg"
                    bgDesktop="/hero-4/bg-desktop.jpeg"
               />
               <main className="pt-20">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                        {t('mainContent.title')}
                                   </h2>
                                   <h3 className="text-[1.2rem] text-dark-blue font-myanmar mb-8">{t('mainContent.subtitle')}</h3>
                                   <p className="text-[1.3rem] text-gray mb-8">
                                        {t('mainContent.description1')}
                                   </p>
                                   <p className="text-[1.3rem] text-gray mb-10">
                                        {t('mainContent.description2')}
                                   </p>
                                   <ul className="space-y-4 list-disc list-inside text-[1.313rem]">
                                        <li>{t('mainContent.list.accommodation')}</li>
                                        <li>{t('mainContent.list.team')}</li>
                                        <li>{t('mainContent.list.equipment')}</li>
                                        <li>{t('mainContent.list.setting')}</li>
                                        <li>{t('mainContent.list.outings')}</li>
                                   </ul>

                              </div>
                              <div>
                                   <Image src="/se.jpeg" alt="Maison de Repos" className="hidden md:block" width={610} height={648} style={{ width: "100%", height: "auto" }} />
                                   <Image src="/se.jpeg" alt="Maison de Repos" className="block md:hidden" width={370} height={434} style={{ width: "100%", height: "auto" }} />
                              </div>
                         </div>
                         <div>
                              <p className="text-[1.3rem] text-gray mb-10">
                                   {t('mainContent.description3')}
                              </p>
                              <blockquote className="text-xl italic font-semibold text-gray-900 mt-5">
                                   <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                                        <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                                   </svg>
                                   <p>&ldquo;{t('mainContent.quote')}&rdquo;</p>
                              </blockquote>
                         </div>
                    </div>
                    <section className="max-w-7xl mx-5 md:mx-auto pt-10 pb-24">
                         <h2 className="text-dark-blue font-myanmar text-[1.75rem] md:text-[2.25rem] mb-4">{t('geographical.title')}</h2>
                         <ul className="space-y-4 list-disc list-inside text-[1.3rem]">
                              <li>{t('geographical.list.location')}</li>
                              <li>
                                   {t('geographical.list.accessibility.title')}
                                   <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                        <li>{t('geographical.list.accessibility.monastir')}</li>
                                        <li>{t('geographical.list.accessibility.enfidha')}</li>
                                   </ol>
                              </li>
                              <li>{t('geographical.list.setting')}</li>
                              <li>{t('geographical.list.culture')}</li>
                              <li>{t('geographical.list.medical')}</li>
                         </ul>
                         <blockquote className="text-xl italic font-semibold text-gray-900 mt-5">
                              <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                                   <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                              </svg>
                              <p>{t('geographical.quote')}</p>
                         </blockquote>
                    </section>
                    <div className="flex justify-center my-10">
                         <Link href="/adapted-stay/professional-services" className="border-1 border-dark-blue text-xl text-white px-8 py-2.5 bg-dark-blue hover:bg-white hover:text-dark-blue transition-all duration-500 cursor-pointer">
                              {t('geographical.contactButton')}
                         </Link>
                    </div>
                    {/* <ContactForm /> */}
               </main>

               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}