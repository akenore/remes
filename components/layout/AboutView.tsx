import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import Hero2 from "../ui/hero/Hero2";
import Footer from "../ui/Footer";
import ContactForm from "../ui/ContactForm";
import Masonary from "../ui/gallery/Masonry";
import Video from "../ui/Video";

export default function AboutView() {
     const t = useTranslations('frontend.about');
     const locale = useLocale();

     return (
          <>
               <Hero2
                    title={t('hero.title')}
                    description={t('hero.description')}
                    cards={null}
                    bgMobile="/hero-4/bg-mobile.jpeg"
                    bgDesktop="/hero-4/bg-desktop.jpeg"
               />
               <main className="pt-20">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                        {t('content.mission.title')}
                                   </h2>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-8">
                                        {t('content.mission.description')}
                                   </p>
                                   <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                        {t('content.philosophy.title')}
                                   </h2>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                        {t('content.philosophy.description')}
                                   </p>
                              </div>
                              <div>
                                   <Image src="/adapted-r-desktop.jpg" alt={t('content.images.alt')} className="hidden md:block" width={610} height={648} style={{ width: "100%", height: "auto" }} />
                                   <Image src="/adapted-r-desktop.jpg" alt={t('content.images.alt')} className="block md:hidden" width={370} height={434} style={{ width: "100%", height: "auto" }} />
                              </div>
                         </div>
                         <div className="md:px-14 mb-20 md:mb-40">
                              <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                   {t('content.exceptionalSetting.title')}
                              </h2>
                              <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                   {t('content.exceptionalSetting.description')}
                              </p>
                              <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                   {t('content.expertTeam.title')}
                              </h2>
                              <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                   {t('content.expertTeam.description')}
                              </p>
                              <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                   {t('content.customOffer.title')}
                              </h2>
                              <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                   {t('content.customOffer.description')}
                              </p>
                         </div>
                    </div>
                    <Masonary showIcons={false} />
                    <div className="-mt-20 md:mt-40 xl:mt-72 z-10">
                         <Video />
                    </div>
                    <div className="mx-5 md:mx-auto max-w-7xl pt-40">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 md:mb-40">
                              <div>
                                   <Image src="/adapted-r-desktop.jpg" alt={t('content.images.alt')} className="hidden md:block" width={610} height={648} style={{ width: "100%", height: "auto" }} />
                                   <Image src="/adapted-r-desktop.jpg" alt={t('content.images.alt')} className="block md:hidden" width={370} height={434} style={{ width: "100%", height: "auto" }} />
                              </div>
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                        {t('content.whatIsRemes.title')}
                                   </h2>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-8">
                                        {t('content.whatIsRemes.description1')}
                                   </p>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                        {t('content.whatIsRemes.description2')}
                                   </p>
                                   {/* <div className="flex justify-center md:justify-start">
                                        <Link href="/about" className="border-1 border-dark-blue text-dark-blue px-8 py-2.5 hover:bg-dark-blue hover:text-white transition-all duration-500 cursor-pointer">
                                             {t('frontend.button')}
                                        </Link>
                                   </div> */}
                              </div>
                         </div>
                    </div>
                    <ContactForm />
               </main>

               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}