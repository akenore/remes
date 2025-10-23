import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";

import Hero2 from "../ui/hero/Hero2";
import Footer from "../ui/Footer";
import ContactForm from "../ui/ContactForm";
import Card3 from "../ui/card/Card3";
import CalendlyButton from '../CalendlyButton';
import { FaHome, FaBed, FaHandsHelping, FaTags, } from 'react-icons/fa';


export default function NursingView() {
     const t = useTranslations('frontend.nursingHome');
     const locale = useLocale();

     return (
          <>
               <Hero2
                    title={t('hero.title')}
                    description={t('hero.description')}
                    bgMobile="/hero-2/bg-mobile.jpeg"
                    bgDesktop="/hero-2/bg-desktop.jpeg"
                    cards={[
                         {
                              icon: <FaHome size={64} />,
                              title: t('hero.cards.residence.title'),
                              description: t('hero.cards.residence.description'),
                              buttonText: t('button'),
                              buttonHref: "/nursing-home/the-residence",
                         },
                         {
                              icon: <FaBed size={64} />,
                              title: t('hero.cards.solutions.title'),
                              description: t('hero.cards.solutions.description'),
                              buttonText: t('button'),
                              buttonHref: "/nursing-home/hosting-solutions",
                         },
                         {
                              icon: <FaHandsHelping size={64} />,
                              title: t('hero.cards.expertise.title'),
                              description: t('hero.cards.expertise.description'),
                              buttonText: t('button'),
                              buttonHref: "/nursing-home/care-expertise",
                         },
                         {
                              icon: <FaTags size={64} />,
                              title: t('hero.cards.offer.title'),
                              description: t('hero.cards.offer.description'),
                              buttonText: t('button'),
                              buttonHref: "/nursing-home/our-offers",
                         },
                    ]}
               />
               <main className="pt-20">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                              <div>
                                   <Image src="/re.jpeg" alt={t('content.images.alt')} className="hidden md:block" width={610} height={648} style={{ width: "100%", height: "auto" }} />
                                   <Image src="/re.jpeg" alt={t('content.images.alt')} className="block md:hidden" width={370} height={434} style={{ width: "100%", height: "auto" }} />
                              </div>
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                        {t('content.schedule.title')}
                                   </h2>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-8">
                                        {t('content.schedule.paragraph1')}
                                   </p>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                        {t('content.schedule.paragraph2')}
                                   </p>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                        {t('content.schedule.paragraph3')}
                                   </p>

                                   <div className="flex justify-center md:justify-start">
                                        <CalendlyButton />
                                   </div>
                              </div>

                         </div>
                    </div>
                    <section className="relative w-full min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/home/bg-m-2.jpg')] sm:bg-[url('/home/bg-d-2.jpg')] mb-40">
                         <div className="w-full min-h-screen">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                                   <header className="text-center lg:text-left mb-12 lg:mb-16 pt-40">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                                             <div className="flex-1">
                                                  <h2 className="text-gold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-myanmar mb-4">
                                                       {t('content.living.title')}
                                                  </h2>
                                                  <p className="text-white text-sm sm:text-base lg:text-lg xl:text-xl max-w-4xl mx-auto lg:mx-0 leading-relaxed">
                                                       {t('content.living.description')}
                                                  </p>
                                             </div>

                                        </div>
                                   </header>
                                   <div className="w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                                             <Card3
                                                  image="/ser-1.jpeg"
                                                  title={t('content.living.cards.activities.title')}
                                                  description={t('content.living.cards.activities.description')}
                                                  buttonText={t('button')}
                                                  buttonHref="/nursing-home/living-at-remes/entertainment-and-activities"
                                             />
                                             <Card3
                                                  image="/ser-2.jpeg"
                                                  title={t('content.living.cards.meals.title')}
                                                  description={t('content.living.cards.meals.description')}
                                                  buttonText={t('button')}
                                                  buttonHref="/nursing-home/living-at-remes/meals-and-daily-services"
                                             />
                                             <Card3
                                                  image="/ser-3.jpeg"
                                                  title={t('content.living.cards.wellbeing.title')}
                                                  description={t('content.living.cards.wellbeing.description')}
                                                  buttonText={t('button')}
                                                  buttonHref="/nursing-home/living-at-remes/well-being-and-comfort"
                                             />

                                        </div>


                                   </div>
                              </div>
                         </div>
                    </section>
                    <section className="max-w-7xl mx-5 md:mx-auto text-center pb-24">


                         <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                              {t('content.reservation.text')}
                         </p>


                         {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
                              MAP
                         </div> */}
                    </section>
                    <ContactForm />
               </main>

               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}