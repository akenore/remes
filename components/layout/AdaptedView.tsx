
"use client";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Footer from "../ui/Footer";

import Navbar from '../ui/Navbar';
import Breadcrumbs from '../ui/Breadcrumbs';
import FaqAccordion from '../ui/FaqAccordion';
import KoalendarButton from '../KoalendarButton';
import TestimonialSingle from '../ui/TestimonialSingle';
import { HiOutlineSparkles } from "react-icons/hi";
import { FaStar, FaHeart, FaShieldAlt, FaBed } from "react-icons/fa";
import { IoAirplane } from "react-icons/io5";
import { LuDumbbell } from "react-icons/lu";
import { TbBus } from "react-icons/tb";
import {
     FaArrowRight,
     FaCalendar,
     FaCheck,
     FaStethoscope,
     FaUserGroup,
     FaWater,
     FaCamera,
     FaQuoteRight
} from "react-icons/fa6";
import { LuBuilding2 } from "react-icons/lu";
import { useState } from 'react';


export default function AdaptedView() {
     const [activeTab, setActiveTab] = useState<'individual' | 'b2b'>('individual');
     const t = useTranslations('frontend.adaptedStay');
     const t2 = useTranslations('frontend.nursingHome');
     const tFaq = useTranslations('frontend.faq2');

     return (
          <>
               <div
                    className="relative w-full bg-cover bg-top bg-no-repeat dynamic-hero-bg min-h-[900px]"
                    style={{ backgroundImage: `url('/bg-hero-2.jpg')` }}>
                    <Navbar />
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-20">
                         <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                              <div className='mb-14 md:-mt-20 lg:-mt-32'>
                                   <div className="flex flex-col justify-center md:justify-start items-center md:items-start text-center md:text-left">
                                        <Breadcrumbs className='mb-10 text-white mt-10 md:mt-0' />
                                        <span
                                             className="max-w-[300px] inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-dark-gold bg-gradient-to-b from-dark-gold/15 to-dark-gold/5 border border-dark-gold/30 shadow-[0_0_0_1px_rgba(251,191,36,0.15),0_0_20px_rgba(251,191,36,0.15)] backdrop-blur-sm mb-5"
                                        >
                                             <HiOutlineSparkles className="w-4 h-4" />
                                             {t('hero.button')}
                                        </span>


                                        <h1 className="px-6 md:px-0 text-[2rem] md:text-[2.7rem] mb-6 text-white leading-tight font-myanmar max-w-sm sm:max-w-xl">
                                             {t('hero.title')}  <span className="text-dark-gold">{t('hero.titleSpan')}</span>
                                        </h1>

                                        <p className="px-6 md:px-0 text-slate-300 text-[1rem] md:text-[1.2rem] mb-10 drop-shadow-lg max-w-sm sm:max-w-xl leading-relaxed">
                                             {t('hero.description')}
                                        </p>

                                        <div className="flex flex-wrap gap-4 mb-10">
                                             <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm">
                                                  <FaStar className="text-dark-gold" />
                                                  <span className="text-white text-sm font-medium">{t('hero.badges.b1')}</span>
                                             </div>
                                             <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm">
                                                  <FaShieldAlt className="text-dark-gold" />
                                                  <span className="text-white text-sm font-medium">{t('hero.badges.b2')}</span>
                                             </div>
                                             <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm">
                                                  <IoAirplane className="text-dark-gold" />
                                                  <span className="text-white text-sm font-medium">{t('hero.badges.b3')}</span>
                                             </div>
                                             <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm">
                                                  <FaHeart className="text-dark-gold" />
                                                  <span className="text-white text-sm font-medium">{t('hero.badges.b4')}</span>
                                             </div>
                                        </div>

                                        <KoalendarButton className='bg-dark-gold hover:bg-dark-blue hover:text-white cursor-pointer text-black font-medium text-[1.1rem] py-4 px-8 rounded-full flex items-center gap-3 transition-colors duration-300 shadow-lg shadow-amber-500/20'>
                                             <FaCalendar /> {t('hero.buttonCTA')} <FaArrowRight />
                                        </KoalendarButton>
                                   </div>
                              </div>
                              <div className="relative lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 mt-10 lg:mt-0 flex flex-col items-center gap-2 pb-8">
                                   <span className="text-gray-400 text-xs tracking-[0.2em] uppercase">{t('hero.info')}</span>
                                   <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent"></div>
                              </div>
                         </div>
                    </div>
               </div>
               <main>
                    <section className="py-20">
                         <div className="mx-5 md:mx-auto max-w-7xl">
                              <div className="flex items-center gap-4 max-w-md mx-auto text-dark-blue mb-5">
                                   <div className="flex-1 border-t border-gray-600"></div>
                                   <span className="text-dark-blue text-sm tracking-wide text-[1.4rem]">{t('sectionServices.subtitle')}</span>
                                   <div className="flex-1 border-t border-gray-600"></div>
                              </div>
                              <h2 className="text-[1.5rem] md:text-[3.25rem] leading-tight text-center text-dark-blue font-myanmar mb-8 max-w-5xl mx-auto">
                                   {t.rich('sectionServices.title', {
                                        bold: (chunks) => <strong>{chunks}</strong>,
                                   })}
                              </h2>
                              <p className="text-[1.3rem] text-gray mb-10 max-w-5xl mx-auto">
                                   {t('sectionServices.description')}
                              </p>
                         </div>
                         <div className="mx-auto max-w-7xl px-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="bg-blue rounded-3xl p-8 md:p-12 border border-white/5">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                                             <FaBed className="text-dark-gold text-2xl" />
                                        </div>

                                        <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 font-myanmar">
                                             {t('sectionServices.cards.card1.title')}
                                        </h3>

                                        <p className="text-slate-400 text-lg mb-8">
                                             {t('sectionServices.cards.card1.description')}
                                        </p>

                                        <ul className="space-y-4">
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card1.li1')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card1.li2')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card1.li3')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card1.li4')}</span>
                                             </li>
                                             {/* <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card1.li5')}</span>
                                             </li> */}
                                        </ul>
                                   </div>

                                   <div className="bg-blue rounded-3xl p-8 md:p-12 border border-white/5">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                                             <FaHeart className="text-dark-gold text-2xl" />
                                        </div>

                                        <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 font-myanmar">
                                             {t('sectionServices.cards.card2.title')}
                                        </h3>

                                        <p className="text-slate-400 text-lg mb-8">
                                             {t('sectionServices.cards.card2.description')}
                                        </p>

                                        <ul className="space-y-4">
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card2.li1')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card2.li2')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card2.li3')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card2.li4')}</span>
                                             </li>
                                        </ul>
                                   </div>

                                   <div className="md:col-span-2 bg-blue rounded-3xl p-8 md:p-12 border border-white/5">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                                             <FaStethoscope className="text-dark-gold text-2xl" />
                                        </div>

                                        <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 font-myanmar">
                                             {t('sectionServices.cards.card3.title')}
                                        </h3>

                                        <p className="text-slate-400 text-lg mb-8">
                                             {t('sectionServices.cards.card3.description')}
                                        </p>

                                        <ul className="space-y-4">
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card3.li1')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card3.li2')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card3.li3')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card3.li4')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionServices.cards.card3.li5')}</span>
                                             </li>
                                        </ul>
                                   </div>
                              </div>
                         </div>
                    </section>
                    <section className="bg-dark-blue py-20">
                         <div className="mx-5 md:mx-auto max-w-7xl">
                              <div className="flex items-center gap-4 max-w-md mx-auto text-white mb-5">
                                   <div className="flex-1 border-t border-dark-gold"></div>
                                   <span className="text-dark-gold text-sm tracking-wide text-[1.4rem]">{t('sectionForms.subtitle')}</span>
                                   <div className="flex-1 border-t border-dark-gold"></div>
                              </div>
                              <h2 className="text-[1.5rem] md:text-[3.25rem] leading-tight text-center text-white font-myanmar mb-8 max-w-5xl mx-auto">
                                   {t('sectionForms.title')} <span className="text-gold">{t('sectionForms.titleSpan')}</span>
                              </h2>

                              <div className="flex justify-center mb-12">
                                   <div className="bg-[#1e293b] p-1 rounded-full inline-flex border border-white/10">
                                        <button
                                             onClick={() => setActiveTab('individual')}
                                             className={`px-8 py-3 rounded-full text-sm cursor-pointer font-medium transition-all duration-300 ${activeTab === 'individual'
                                                  ? 'bg-dark-gold text-[#0f172a]'
                                                  : 'text-slate-400 hover:text-white'
                                                  }`}
                                        >
                                             {t('sectionForms.individuals.button')}
                                        </button>
                                        <button
                                             onClick={() => setActiveTab('b2b')}
                                             className={`px-8 py-3 rounded-full text-sm cursor-pointer font-medium transition-all duration-300 ${activeTab === 'b2b'
                                                  ? 'bg-dark-gold text-[#0f172a]'
                                                  : 'text-slate-400 hover:text-white'
                                                  }`}
                                        >
                                             {t('sectionForms.professionals.button')}
                                        </button>
                                   </div>
                              </div>

                              <div className="max-w-6xl mx-auto">
                                   {activeTab === 'individual' ? (
                                        <div className="bg-[#1e293b]/50 border border-white/5 rounded-3xl p-8 md:p-12">
                                             <div className="flex items-center gap-4 mb-6">
                                                  <FaUserGroup className="text-dark-gold text-2xl" />
                                                  <h3 className="text-white text-2xl md:text-3xl font-myanmar">
                                                       {t('sectionForms.individuals.title')}
                                                  </h3>
                                             </div>
                                             <p className="text-slate-400 text-lg mb-12 max-w-5xl">
                                                  {t('sectionForms.individuals.description')}
                                             </p>
                                             <p className="text-slate-400 text-lg mb-12 max-w-5xl">
                                                  {t('sectionForms.individuals.description2')}
                                             </p>

                                             <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 hover:border-dark-gold/30 transition-colors mb-6">
                                                  <h4 className="text-white text-xl font-bold mb-3">{t('sectionForms.individuals.cards.card1.title')}</h4>
                                                  <p className="text-slate-400 mb-6">
                                                       {t('sectionForms.individuals.cards.card1.description')}
                                                  </p>
                                                  <span className="text-dark-gold text-lg font-medium">{t('sectionForms.individuals.cards.card1.price')}</span>
                                             </div>

                                             <div className="bg-[#0f172a] rounded-2xl p-6 border border-dark-gold relative mb-6">
                                                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-dark-gold text-[#0f172a] text-xs font-bold px-3 py-1 rounded-full">
                                                       {t('sectionForms.individuals.subtitle')}
                                                  </div>
                                                  <h4 className="text-white text-xl font-bold mb-3">{t('sectionForms.individuals.cards.card2.title')}</h4>
                                                  <p className="text-slate-400 mb-6">
                                                       {t('sectionForms.individuals.cards.card2.description')}
                                                  </p>
                                                  <span className="text-dark-gold text-lg font-medium">{t('sectionForms.individuals.cards.card2.price')}</span>
                                             </div>

                                             <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 hover:border-dark-gold/30 transition-colors">
                                                  <h4 className="text-white text-xl font-bold mb-3">{t('sectionForms.individuals.cards.card3.title')}</h4>
                                                  <p className="text-slate-400 mb-6">
                                                       {t('sectionForms.individuals.cards.card3.description')}
                                                  </p>
                                                  <span className="text-dark-gold text-lg font-medium">{t('sectionForms.individuals.cards.card3.price')}</span>
                                             </div>

                                             <div className="mt-12 text-center">
                                                  <KoalendarButton className="bg-dark-gold text-[#0f172a] cursor-pointer px-8 py-3 rounded-full font-bold hover:bg-gold transition-colors duration-300">
                                                       {t('sectionForms.individuals.buttonCTA')}
                                                  </KoalendarButton>
                                             </div>
                                        </div>
                                   ) : (
                                        <div className="bg-[#1e293b]/50 border border-white/5 rounded-3xl p-8 md:p-12">
                                             <div className="flex items-center gap-4 mb-6">
                                                  <LuBuilding2 className="text-dark-gold text-2xl" />
                                                  <h3 className="text-white text-2xl md:text-3xl font-myanmar">
                                                       {t('sectionForms.professionals.title')}
                                                  </h3>
                                             </div>
                                             <p className="text-slate-400 text-lg mb-12 max-w-3xl">
                                                  {t('sectionForms.professionals.description')}
                                             </p>

                                             <div className="space-y-4 mb-12">
                                                  {[
                                                       t('sectionForms.professionals.list.l1'),
                                                       t('sectionForms.professionals.list.l2'),
                                                       t('sectionForms.professionals.list.l3'),
                                                       t('sectionForms.professionals.list.l4')
                                                  ].map((item, index) => (
                                                       <div key={index} className="bg-[#0f172a] p-4 rounded-xl border border-white/5 flex items-center gap-4">
                                                            <FaCheck className="text-dark-gold shrink-0" />
                                                            <span className="text-slate-300">{item}</span>
                                                       </div>
                                                  ))}
                                             </div>

                                             <div className="text-center">
                                                  <Link href="/adapted-stay/professional-services" className="inline-flex items-center border border-dark-gold text-dark-gold cursor-pointer px-8 py-3 rounded-full font-bold hover:bg-dark-gold hover:text-[#0f172a] transition-all duration-300">
                                                       {t('sectionForms.professionals.buttonCTA')}
                                                  </Link>
                                             </div>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </section>
                    <section className="py-20">
                         <div className="mx-5 md:mx-auto max-w-7xl">
                              <div className="flex items-center gap-4 max-w-md mx-auto text-dark-blue mb-5">
                                   <div className="flex-1 border-t border-gray-600"></div>
                                   <span className="text-dark-blue text-sm tracking-wide text-[1.4rem]">{t('sectionActivities.title')}</span>
                                   <div className="flex-1 border-t border-gray-600"></div>
                              </div>
                              <h2 className="text-[1.5rem] md:text-[3.25rem] leading-tight text-center text-dark-blue font-myanmar mb-8 max-w-5xl mx-auto">
                                   {t('sectionActivities.subtitle')}
                              </h2>
                              <p className=" text-lg mb-12 text-center">
                                   {t('sectionActivities.description')}
                              </p>
                         </div>
                         <div className="mx-auto max-w-7xl px-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                   <div className="bg-blue rounded-3xl p-8 md:p-12 border border-white/5">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                                             <FaWater className="text-dark-gold text-2xl" />
                                        </div>

                                        <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 font-myanmar">
                                             {t('sectionActivities.cards.card1.title')}
                                        </h3>


                                        <ul className="space-y-4">
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card1.li1')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card1.li2')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card1.li3')}</span>
                                             </li>
                                        </ul>
                                   </div>

                                   <div className="bg-blue rounded-3xl p-8 md:p-12 border border-white/5">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                                             <FaCamera className="text-dark-gold text-2xl" />
                                        </div>

                                        <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 font-myanmar">
                                             {t('sectionActivities.cards.card2.title')}
                                        </h3>

                                        <ul className="space-y-4">
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card2.li1')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card2.li2')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card2.li3')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card2.li4')}</span>
                                             </li>
                                        </ul>
                                   </div>

                                   <div className="bg-blue rounded-3xl p-8 md:p-12 border border-white/5">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                                             <LuDumbbell className="text-dark-gold text-2xl" />
                                        </div>

                                        <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 font-myanmar">
                                             {t('sectionActivities.cards.card3.title')}
                                        </h3>

                                        <ul className="space-y-4">
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card3.li1')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card3.li2')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card3.li3')}</span>
                                             </li>
                                        </ul>
                                   </div>

                                   <div className="bg-blue rounded-3xl p-8 md:p-12 border border-white/5">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                                             <TbBus className="text-dark-gold text-2xl" />
                                        </div>
                                        <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 font-myanmar">
                                             {t('sectionActivities.cards.card4.title')}
                                        </h3>
                                        <p className="text-slate-400 text-lg mb-8">
                                             {t('sectionActivities.cards.card4.description')}
                                        </p>
                                        <ul className="space-y-4">
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card4.li1')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card4.li2')}</span>
                                             </li>
                                             <li className="flex items-start gap-3">
                                                  <FaCheck className="text-dark-gold mt-1 shrink-0" />
                                                  <span className="text-slate-300">{t('sectionActivities.cards.card4.li3')}</span>
                                             </li>
                                        </ul>
                                   </div>
                              </div>
                         </div>
                    </section>
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
                                             translationScope="frontend.faq2"
                                             keys={['q1', 'q2', 'q3', 'q4', 'q5', 'q6']}
                                        />
                                   </div>
                              </div>
                         </div>
                    </section>
                    <section className="py-20">
                         <div className="mx-5 md:mx-auto max-w-7xl">
                              <h2 className="text-dark-blue text-3xl sm:text-4xl font-myanmar mb-4 text-center">
                                   {t('sectionCTA.title')}
                              </h2>
                              <p className="text-slate-600 text-lg mb-8 text-center">
                                   {t('sectionCTA.description')}
                              </p>
                              <div className="mt-12 text-center">
                                   <KoalendarButton className="bg-dark-blue text-white cursor-pointer px-8 py-5 rounded-full font-bold hover:bg-blue hover:text-white transition-colors duration-300" />
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