import Image from "next/image";
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/navigation';
import { useTranslations } from "next-intl";
import Hero from "../ui/hero/Hero";
import Footer from "../ui/Footer";
import type { HomeSlide } from '@/lib/home-data';
import { FaQuoteRight } from "react-icons/fa";
import FaqAccordion from "../ui/FaqAccordion";
// import MaintenanceMode from "@/components/layout/MaintenanceMode";

const Masonary = dynamic(() => import("../ui/gallery/Masonry"));
const TestimonialSingle = dynamic(() => import("../ui/TestimonialSingle"));
const Partners = dynamic(() => import("../ui/Partners"));
const ContactForm = dynamic(() => import("../ui/ContactForm"));

interface HomeViewProps {
     initialSlides?: HomeSlide[];
}

export default function HomeView({ initialSlides = [] }: HomeViewProps) {
     const t = useTranslations('frontend.home');
     const t2 = useTranslations('frontend.nursingHome');
     const tFaq = useTranslations('frontend.faq');

     return (
          <>
               <Hero initialSlides={initialSlides} />
               <main className="pt-40">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[2rem] text-center md:text-left text-dark-blue font-myanmar mb-8 md:pt-20">
                                        {t('mainContent.title')}
                                   </h2>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-8">
                                        {t('mainContent.description1')}
                                   </p>
                                   {/* <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                        {t('mainContent.description2')}
                                   </p>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                        {t('mainContent.description3')}
                                   </p> */}

                                   {/* <div className="flex justify-center md:justify-start">
                                        <Link href="/about" className="border border-dark-blue text-dark-blue px-8 py-2.5 hover:bg-dark-blue hover:text-white transition-all duration-500 cursor-pointer">
                                             {t('mainContent.learnMore')}
                                        </Link>
                                   </div> */}
                              </div>
                              <div>
                                   <Image src="/home/h-r.jpeg" alt="Maison de Repos" width={610} height={603} style={{ width: "100%", height: "auto" }} />
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
                    <section className="py-20">
                         <div className="mx-5 md:mx-auto max-w-7xl">
                              <div className="flex items-center gap-4 max-w-md mx-auto text-dark-blue mb-5 text-dark-blue">
                                   <div className="flex-1 border-t border-dark-blue"></div>
                                   <span className="text-sm tracking-wide text-[1.4rem] uppercase">{t2('sectionTestimonials.span')}</span>
                                   <div className="flex-1 border-t border-dark-blue"></div>
                              </div>
                              <h2 className="text-[1.5rem] md:text-[3.25rem] leading-tight text-center text-dark-blue font-myanmar mb-8 max-w-4xl mx-auto">
                                   {t2('sectionTestimonials.title')} <span className="text-[#c9a324]">{t2('sectionTestimonials.titleSpan')}</span>
                              </h2>
                              <FaQuoteRight className="text-[#c9a324] text-[4rem] mx-auto" />
                              <TestimonialSingle />

                         </div>

                    </section>
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
                    <section className="relative w-full min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/home/bg-m-2.jpg')] sm:bg-[url('/home/bg-d-2.jpg')]">
                         <div className="w-full min-h-screen">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                                   <header className="text-center lg:text-left mb-12 lg:mb-16 pt-20">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                                             <div className="flex-1">
                                                  <h2 className="text-dark-gold text-3xl sm:text-4xl font-myanmar mb-4 text-center">
                                                       FAQ
                                                  </h2>
                                                  <h3 className="text-white text-3xl sm:text-4xl lg:text-5xl font-myanmar mb-4 text-center leading-relaxed">
                                                       {tFaq('header.title')} <span className="text-dark-gold">{tFaq('header.span')}</span>
                                                  </h3>
                                             </div>

                                        </div>
                                   </header>
                                   <div className="w-full">
                                        <FaqAccordion
                                             translationScope="frontend.faq"
                                             keys={['q1', 'q2', 'q3', 'q4', 'q5', 'q6']}
                                        />
                                   </div>
                              </div>
                         </div>
                    </section>
                    <Partners />
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}