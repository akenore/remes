import Image from "next/image";
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/navigation';
import { useTranslations } from "next-intl";
import Hero from "../ui/hero/Hero";
import Footer from "../ui/Footer";
import type { HomeSlide } from '@/lib/home-data';
// import MaintenanceMode from "@/components/layout/MaintenanceMode";

const Masonary = dynamic(() => import("../ui/gallery/Masonry"));
const Testimonials = dynamic(() => import("../ui/Testimonials"));
const Partners = dynamic(() => import("../ui/Partners"));
const ContactForm = dynamic(() => import("../ui/ContactForm"));

interface HomeViewProps {
     initialSlides?: HomeSlide[];
}

export default function HomeView({ initialSlides = [] }: HomeViewProps) {
     const t = useTranslations('frontend.home');

     return (
          <>
               <Hero initialSlides={initialSlides} />
               <main className="pt-96">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[2rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                        {t('mainContent.title')}
                                   </h2>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-8">
                                        {t('mainContent.description1')}
                                   </p>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                        {t('mainContent.description2')}
                                   </p>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                        {t('mainContent.description3')}
                                   </p>

                                   <div className="flex justify-center md:justify-start">
                                        <Link href="/about" className="border border-dark-blue text-dark-blue px-8 py-2.5 hover:bg-dark-blue hover:text-white transition-all duration-500 cursor-pointer">
                                             {t('mainContent.learnMore')}
                                        </Link>
                                   </div>
                              </div>
                              <div>
                                   <Image src="/home/h-r-1.jpeg" alt="Maison de Repos" width={610} height={648} style={{ width: "100%", height: "auto" }} />
                                   <div className="flex justify-center lg:hidden">
                                        <Image src="/rounded-logo.png" alt="remes logo" width={183} height={183} className="-mt-16 md:-mt-20 h-auto max-w-full" style={{ width: "auto", height: "25%" }} />
                                   </div>
                                   <Image src="/rounded-logo.png" alt="remes logo" width={183} height={183} className="hidden lg:block -mt-16 md:-mt-20 lg:-ml-10 h-auto max-w-full" style={{ width: "auto", height: "25%" }} />
                              </div>
                         </div>
                         <blockquote className="text-[1.313rem] italic text-gray-800">
                              <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                                   <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                              </svg>
                              <p className='mb-5'>
                                   &ldquo;{t('quote.text')}&rdquo;
                              </p>
                              <div className='mb-20 font-semibold flex flex-col justify-end items-end'>
                                   <h3>Dr. Ahlem Bourourou</h3>
                                   <p className="text-sm">{t('quote.role')}</p>
                              </div>
                         </blockquote>

                    </div>
                    <Masonary />
                    <Testimonials />
                    {/* Marquee strip */}
                    <div className="overflow-hidden py-20">
                         <div className="flex items-center space-x-10 animate-marquee whitespace-nowrap">
                              {Array.from({ length: 6 }).map((_, idx) => (
                                   <div key={"first-" + idx} className="flex items-center space-x-5 mx-5 min-h-[45px] md:min-h-[89px]">
                                        <Image src="/icon-remes.png" alt="icon remes" width={89} height={89} className="w-[45px] h-[45px] md:w-[89px] md:h-[89px] shrink-0" priority />
                                        <span className="text-dark-blue text-[2.25rem] lg:text-[4.3rem] font-vensfolk uppercase tracking-wide leading-none">{t('marquee.text')}</span>
                                   </div>
                              ))}
                              {Array.from({ length: 6 }).map((_, idx) => (
                                   <div key={"second-" + idx} className="flex items-center space-x-5 mx-5 min-h-[45px] md:min-h-[89px]">
                                        <Image src="/icon-remes.png" alt="icon remes" width={89} height={89} className="w-[45px] h-[45px] md:w-[89px] md:h-[89px] shrink-0" priority />
                                        <span className="text-dark-blue text-[2.25rem] lg:text-[4.3rem] font-vensfolk uppercase tracking-wide leading-none">{t('marquee.text')}</span>
                                   </div>
                              ))}
                         </div>
                    </div>
                    <Partners />
                    <ContactForm />
               </main>
               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}