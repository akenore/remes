import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";

import Footer from "../ui/Footer";
import KoalendarButton from '../KoalendarButton';
import FaqAccordion from '../ui/FaqAccordion';
import ContactForm2 from '../ui/ContactForm2';
import Navbar from '../ui/Navbar';
import Breadcrumbs from '../ui/Breadcrumbs';
import Card2 from '../ui/card/Card2';
import { FaHome, FaBed, FaHandsHelping, FaTags, FaQuoteRight } from 'react-icons/fa';
import { FaLocationPin, FaPhone } from "react-icons/fa6";
import { IoAirplane } from "react-icons/io5";
import TestimonialSingle from '../ui/TestimonialSingle';




export default function NursingView() {
     const t = useTranslations('frontend.nursingHome');
     const tFaq = useTranslations('frontend.faq');
     const locale = useLocale();


     return (
          <>
               <div
                    className="relative w-full bg-cover bg-top bg-no-repeat dynamic-hero-bg min-h-[980px]"
                    style={{ backgroundImage: `url('/bg-hero-2.jpg')` }}>
                    <Navbar />
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-20">
                         <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                              <div className='flex-1 flex flex-col items-center md:items-start text-center md:text-left'>
                                   <div className='mb-14 md:-mt-20 lg:-mt-32'>
                                        <div className="flex flex-col justify-center md:justify-start">
                                             <Breadcrumbs className='mb-10 text-white mt-10 md:mt-0' />
                                             <span className="text-dark-gold text-[1.2rem] text-left font-myanmar flex items-center justify-center md:justify-start mb-10">
                                                  <hr className="w-16 h-0.5 bg-dark-gold border-0 mr-4" />{t('hero.subtitle')}
                                             </span>

                                             <h1 className="px-6 md:px-0 text-[2rem] md:text-[3rem] mb-6 text-white leading-tight font-myanmar max-w-sm sm:max-w-xl">
                                                  {t('hero.title')} <span className="text-dark-gold">{t('hero.titleSpan')}</span>
                                             </h1>

                                             <p className="px-6 md:px-0 text-white text-[1rem] md:text-[1.2rem] mb-8 drop-shadow-lg max-w-sm sm:max-w-xl">
                                                  {t('hero.description')}
                                             </p>
                                             <KoalendarButton className='bg-dark-gold text-[1.2rem] text-dark-blue py-5 px-5 cursor-pointer hover:bg-dark-blue hover:text-white transition-colors duration-300' />
                                        </div>
                                   </div>
                              </div>
                              <div className="flex-1 flex justify-center lg:justify-end items-center mb-16">
                                   <div className="grid grid-cols-2 gap-4 max-w-lg">
                                        <div className="bg-[#1a2b4b]/80 backdrop-blur-sm border border-white/10 p-6 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:h-48 min-w-[160px]">
                                             <div className="text-gold text-4xl md:text-5xl font-myanmar mb-2">5<span className="text-xl md:text-2xl ml-1">{t('hero.itemsCards.i1')}</span></div>
                                             <div className="text-gray-300 text-xs md:text-sm tracking-widest uppercase font-medium">{t('hero.itemsCards.i1Span')}</div>
                                        </div>
                                        <div className="bg-[#1a2b4b]/80 backdrop-blur-sm border border-white/10 p-6 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:h-48 min-w-[160px]">
                                             <div className="text-gold text-4xl md:text-5xl font-myanmar mb-2">24<span className="text-2xl md:text-3xl">/7</span></div>
                                             <div className="text-gray-300 text-xs md:text-sm tracking-widest uppercase font-medium">{t('hero.itemsCards.i2Span')}</div>
                                        </div>
                                        <div className="bg-[#1a2b4b]/80 backdrop-blur-sm border border-white/10 p-6 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:h-48 min-w-[160px]">
                                             <div className="text-gold text-4xl md:text-5xl font-myanmar mb-2">4<span className="text-3xl md:text-4xl">★</span></div>
                                             <div className="text-gray-300 text-xs md:text-sm tracking-widest uppercase font-medium">{t('hero.itemsCards.i3Span')}</div>
                                        </div>
                                        <div className="bg-[#1a2b4b]/80 backdrop-blur-sm border border-white/10 p-6 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:h-48 min-w-[160px]">
                                             <div className="text-gold text-4xl md:text-5xl font-myanmar mb-2">200<span className="text-xl md:text-2xl ml-1">m</span></div>
                                             <div className="text-gray-300 text-xs md:text-sm tracking-widest uppercase font-medium">{t('hero.itemsCards.i4Span')}</div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
               <main className="pt-20">
                    <section className="py-20">
                         <div className="mx-5 md:mx-auto max-w-7xl">
                              <div className="flex items-center gap-4 max-w-md mx-auto text-dark-blue mb-5">
                                   <div className="flex-1 border-t border-gray-600"></div>
                                   <span className="text-dark-blue text-sm tracking-wide text-[1.4rem]">{t('sectionEngagement.span')}</span>
                                   <div className="flex-1 border-t border-gray-600"></div>
                              </div>
                              <h2 className="text-[1.5rem] md:text-[3.25rem] leading-tight text-center text-dark-blue font-myanmar mb-8 max-w-4xl mx-auto">
                                   {t('sectionEngagement.title')} <span className="text-[#c9a324]">{t('sectionEngagement.titleSpan')}</span>
                              </h2>
                              <div className="flex flex-col lg:flex-row lg:divide-x lg:divide-slate-200">

                                   <div className="flex-1 px-8 py-10">
                                        <p className="text-sm text-yellow-600 font-medium mb-4">01</p>
                                        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                             {t('sectionEngagement.item1.title')}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                             {t('sectionEngagement.item1.description')}
                                        </p>
                                   </div>

                                   <div className="flex-1 px-8 py-10">
                                        <p className="text-sm text-yellow-600 font-medium mb-4">02</p>
                                        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                             {t('sectionEngagement.item2.title')}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                             {t('sectionEngagement.item2.description')}
                                        </p>
                                   </div>

                                   <div className="flex-1 px-8 py-10">
                                        <p className="text-sm text-yellow-600 font-medium mb-4">03</p>
                                        <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                                             {t('sectionEngagement.item3.title')}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                             {t('sectionEngagement.item3.description')}
                                        </p>
                                   </div>

                              </div>

                         </div>
                    </section>
                    <section className="py-20 bg-dark-blue">
                         <div className="mx-5 md:mx-auto max-w-7xl">
                              <div className="flex items-center gap-4 max-w-md mx-auto text-dark-blue mb-5 text-dark-gold">
                                   <div className="flex-1 border-t border-dark-gold"></div>
                                   <span className="text-sm tracking-wide text-[1.4rem] uppercase">{t('sectionSupport.span')}</span>
                                   <div className="flex-1 border-t border-dark-gold"></div>
                              </div>
                              <h2 className="text-[1.5rem] md:text-[3.25rem] leading-tight text-center text-white font-myanmar mb-8 max-w-4xl mx-auto">
                                   {t('sectionSupport.title')} <span className="text-dark-gold">{t('sectionSupport.titleSpan')}</span>
                              </h2>
                         </div>
                         <div className="w-full max-w-8xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-0 justify-center items-stretch px-4 mb-20">
                              <Card2
                                   icon={<FaHome size={64} />}
                                   title={t('hero.cards.residence.title')}
                                   description={t('hero.cards.residence.description')}
                                   buttonText={t('button')} buttonHref="/nursing-home/the-residence" />
                              <Card2
                                   icon={<FaBed size={64} />}
                                   title={t('hero.cards.solutions.title')}
                                   description={t('hero.cards.solutions.description')}
                                   buttonText={t('button')} buttonHref="/nursing-home/hosting-solutions" />

                              <Card2
                                   icon={<FaHandsHelping size={64} />}
                                   title={t('hero.cards.expertise.title')}
                                   description={t('hero.cards.expertise.description')}
                                   buttonText={t('button')} buttonHref="/nursing-home/care-expertise" />

                              <Card2
                                   icon={<FaTags size={64} />}
                                   title={t('hero.cards.offer.title')}
                                   description={t('hero.cards.offer.description')}
                                   buttonText={t('button')} buttonHref="/nursing-home/our-offers" />
                         </div>
                    </section>
                    <section className="py-20">
                         <div className="mx-5 md:mx-auto max-w-7xl">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                                   <div>
                                        <span className="text-[#c9a324] text-[1.2rem] text-left font-myanmar flex items-center justify-center md:justify-start mb-5">
                                             <hr className="w-16 h-0.5 bg-[#c9a324] border-0 mr-4" />{t('sectionTeam.span')}
                                        </span>
                                        <h2 className="text-[1.5rem] md:text-[2.9rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                             {t('sectionTeam.title')} <span className="text-[#c9a324]">{t('sectionTeam.titleSpan')}</span>
                                        </h2>
                                        <p className="text-[1.2rem] text-center md:text-left text-gray mb-8">
                                             {t.rich('sectionTeam.p1', {
                                                  bold: (chunks) => <strong>{chunks}</strong>,
                                             })}
                                        </p>
                                        <p className="text-[1.2rem] text-center md:text-left text-gray mb-10">
                                             {t.rich('sectionTeam.p2', {
                                                  bold: (chunks) => <strong>{chunks}</strong>,
                                             })}
                                        </p>
                                        <ul className="list-disc space-y-2 text-[1.2rem]">
                                             <li>{t.rich('sectionTeam.li1', {
                                                  bold: (chunks) => <strong>{chunks}</strong>,
                                             })}</li>
                                             <li>{t.rich('sectionTeam.li2', {
                                                  bold: (chunks) => <strong>{chunks}</strong>,
                                             })}</li>
                                             <li>{t.rich('sectionTeam.li3', {
                                                  bold: (chunks) => <strong>{chunks}</strong>,
                                             })}</li>
                                             <li>{t.rich('sectionTeam.li4', {
                                                  bold: (chunks) => <strong>{chunks}</strong>,
                                             })}</li>
                                             <li>{t.rich('sectionTeam.li5', {
                                                  bold: (chunks) => <strong>{chunks}</strong>,
                                             })}</li>
                                             <li>{t.rich('sectionTeam.li6', {
                                                  bold: (chunks) => <strong>{chunks}</strong>,
                                             })}</li>
                                        </ul>


                                   </div>
                                   <div>
                                        <Image src="/re.jpeg" alt={t('content.images.alt')} className="hidden md:block" width={610} height={648} style={{ width: "100%", height: "auto" }} />
                                        <Image src="/re.jpeg" alt={t('content.images.alt')} className="block md:hidden" width={370} height={434} style={{ width: "100%", height: "auto" }} />
                                   </div>
                              </div>
                         </div>
                    </section>
                    <section className="py-20">
                         <div className="mx-5 md:mx-auto max-w-7xl">
                              <div className="flex items-center gap-4 max-w-md mx-auto text-dark-blue mb-5 text-dark-blue">
                                   <div className="flex-1 border-t border-dark-blue"></div>
                                   <span className="text-sm tracking-wide text-[1.4rem] uppercase">{t('sectionTestimonials.span')}</span>
                                   <div className="flex-1 border-t border-dark-blue"></div>
                              </div>
                              <h2 className="text-[1.5rem] md:text-[3.25rem] leading-tight text-center text-dark-blue font-myanmar mb-8 max-w-4xl mx-auto">
                                   {t('sectionTestimonials.title')} <span className="text-[#c9a324]">{t('sectionTestimonials.titleSpan')}</span>
                              </h2>
                              <FaQuoteRight className="text-[#c9a324] text-[4rem] mx-auto" />
                              <TestimonialSingle />

                         </div>

                    </section>
                    <section className="w-full text-center pb-24 bg-[#f6f1eb]">

                         <div className="mx-5 md:mx-auto max-w-7xl py-20">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <div className="flex flex-col justify-center md:justify-start">
                                        <span className="text-[#c9a324] text-[1.9rem] text-left font-myanmar">{t('sectionContact.span')}</span>
                                        <h2 className="text-[2.5rem] md:text-[3rem] text-left text-dark-blue font-myanmar mb-8 ">
                                             {t('sectionContact.title')} <br className='md:block hidden' /><span className="text-[#c9a324]">{t('sectionContact.titleSpan')}</span>
                                        </h2>
                                        <p className=" text-left text-gray">
                                             {t('sectionContact.p1')}
                                        </p>
                                        <hr className="my-8 border-gray-300" />
                                        <p className=" text-left text-gray mb-5">{t('sectionContact.p2')}</p>
                                        <ul className="text-left space-y-4 text-gray">
                                             <li><FaLocationPin className="inline mr-2 text-[#c9a324]" /> {t('sectionContact.li1')}</li>
                                             <li><FaPhone className="inline mr-2 text-[#c9a324]" /> +216 23 050 038</li>
                                             <li><IoAirplane className="inline mr-2 text-[#c9a324]" /> {t('sectionContact.li2')}</li>
                                        </ul>
                                   </div>
                                   <div>
                                        <ContactForm2 />
                                   </div>
                              </div>
                         </div>
                    </section>
                    <section className="relative w-full min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/home/bg-m-2.jpg')] sm:bg-[url('/home/bg-d-2.jpg')] mb-40">
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


               </main>

               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}