

import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Footer from "../ui/Footer";

import Navbar from '../ui/Navbar';
import Breadcrumbs from '../ui/Breadcrumbs';
import KoalendarButton from '../KoalendarButton';
import { HiOutlineSparkles } from "react-icons/hi";
import { FaStar, FaHeart, FaShieldAlt, FaBed } from "react-icons/fa";
import { IoAirplane } from "react-icons/io5";
import { FaArrowRight, FaCalendar, FaCheck, FaStethoscope } from "react-icons/fa6";


export default function AdaptedView() {
     const t = useTranslations('frontend.adaptedStay');

     return (
          <>
               <div
                    className="relative w-full bg-cover bg-top bg-no-repeat dynamic-hero-bg min-h-[900px]"
                    style={{ backgroundImage: `url('/bg-ehpad.jpg')` }}>
                    <Navbar />
                    <div className='relative z-10 w-full max-w-7xl mx-auto px-4'>
                         <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                              <div className='mb-14 md:-mt-20 lg:-mt-32'>
                                   <div className="flex flex-col justify-center md:justify-start items-center md:items-start text-center md:text-left">
                                        <Breadcrumbs className='mb-10 text-white mt-10 md:mt-0' />
                                        <span
                                             className="max-w-[300px] inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-amber-400 bg-gradient-to-b from-amber-500/15 to-amber-500/5 border border-amber-400/30 shadow-[0_0_0_1px_rgba(251,191,36,0.15),0_0_20px_rgba(251,191,36,0.15)] backdrop-blur-sm mb-5"
                                        >
                                             <HiOutlineSparkles className="w-4 h-4" />
                                             Résidence médicalisée 4 étoiles
                                        </span>


                                        <h1 className="px-6 md:px-0 text-[2rem] md:text-[2.7rem] mb-6 text-white leading-tight font-myanmar max-w-sm sm:max-w-xl">
                                             Séjour Adapté en Tunisie:  <span className="text-dark-gold">Des Vacances Accessibles à Tous</span>
                                        </h1>

                                        <p className="px-6 md:px-0 text-slate-300 text-[1rem] md:text-[1.2rem] mb-10 drop-shadow-lg max-w-sm sm:max-w-xl leading-relaxed">
                                             Offrez-vous ou offrez à un proche des vacances adaptées en Tunisie, au bord de la Méditerranée. La résidence REMES à Monastir accueille les personnes à mobilité réduite, les seniors et les personnes en situation de handicap dans un cadre hôtelier 4 étoiles entièrement accessible.
                                        </p>

                                        <div className="flex flex-wrap gap-4 mb-10">
                                             <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm">
                                                  <FaStar className="text-[#c9a324]" />
                                                  <span className="text-white text-sm font-medium">4★ Hôtel</span>
                                             </div>
                                             <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm">
                                                  <FaShieldAlt className="text-[#c9a324]" />
                                                  <span className="text-white text-sm font-medium">24/7 Soins</span>
                                             </div>
                                             <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm">
                                                  <IoAirplane className="text-[#c9a324]" />
                                                  <span className="text-white text-sm font-medium">5 min Aéroport</span>
                                             </div>
                                             <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm">
                                                  <FaHeart className="text-[#c9a324]" />
                                                  <span className="text-white text-sm font-medium">100% PMR</span>
                                             </div>
                                        </div>

                                        <KoalendarButton className='bg-[#ECA824] hover:bg-[#d6961f] cursor-pointer text-black font-medium text-[1.1rem] py-4 px-8 rounded-full flex items-center gap-3 transition-colors duration-300 shadow-lg shadow-amber-500/20'>
                                             <FaCalendar className="text-black/80" /> Planifier un rendez-vous <FaArrowRight className="text-black/80" />
                                        </KoalendarButton>
                                   </div>
                              </div>
                              <div className="relative lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 mt-10 lg:mt-0 flex flex-col items-center gap-2 pb-8">
                                   <span className="text-gray-400 text-xs tracking-[0.2em] uppercase">DÉCOUVRIR</span>
                                   <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent"></div>
                              </div>
                         </div>
                    </div>
               </div>
               <main className="pt-20">
                    <section>
                         <div className="mx-5 md:mx-auto max-w-7xl">
                              <div className="flex items-center gap-4 max-w-md mx-auto text-dark-blue mb-5">
                                   <div className="flex-1 border-t border-gray-600"></div>
                                   <span className="text-dark-blue text-sm tracking-wide text-[1.4rem]">Nos services</span>
                                   <div className="flex-1 border-t border-gray-600"></div>
                              </div>
                              <h2 className="text-[1.5rem] md:text-[3.25rem] leading-tight text-center text-dark-blue font-myanmar mb-8 max-w-5xl mx-auto">
                                   Pourquoi choisir <strong>REMES</strong> pour votre séjour adapté en Tunisie ?
                              </h2>
                              <p className="text-[1.3rem] text-gray mb-10 max-w-5xl mx-auto">
                                   REMES est une résidence médicalisée unique en son genre : nous combinons le confort d'un hôtel 4 étoiles avec l'accompagnement d'une équipe soignante formée. Que vous voyagiez seul, en famille ou avec un groupe, nous adaptons chaque séjour à vos besoins spécifiques.
                              </p>

                              <div className="bg-[#0f172a] rounded-3xl p-8 md:p-12 mb-10 max-w-4xl mx-auto border border-white/5">
                                   <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                                        <FaBed className="text-[#FFB800] text-2xl" />
                                   </div>

                                   <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 font-myanmar">
                                        Un hébergement 100% accessible
                                   </h3>

                                   <p className="text-slate-400 text-lg mb-8">
                                        Nos chambres sont conçues pour accueillir tous les types de handicap :
                                   </p>

                                   <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Chambres spacieuses avec accès fauteuil roulant</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Salles de bain adaptées (douche à l'italienne, barres d'appui)</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Lits médicalisés disponibles sur demande</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Accès de plain-pied aux espaces communs</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Ascenseurs adaptés PMR</span>
                                        </li>
                                   </ul>
                              </div>

                              <div className="bg-[#0f172a] rounded-3xl p-8 md:p-12 mb-10 max-w-4xl mx-auto border border-white/5">
                                   <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                                        <FaHeart className="text-[#FFB800] text-2xl" />
                                   </div>

                                   <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 font-myanmar">
                                        Une équipe soignante à vos côtés
                                   </h3>

                                   <p className="text-slate-400 text-lg mb-8">
                                        Notre personnel qualifié assure une présence bienveillante 24h/24 :
                                   </p>

                                   <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Infirmiers et aides-soignants diplômés</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Assistance aux gestes de la vie quotidienne</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Administration des traitements médicaux</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Accompagnement personnalisé selon votre niveau d'autonomie</span>
                                        </li>
                                   </ul>
                              </div>

                              <div className="bg-[#0f172a] rounded-3xl p-8 md:p-12 mb-10 max-w-4xl mx-auto border border-white/5">
                                   <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                                        <FaStethoscope className="text-[#FFB800] text-2xl" />
                                   </div>

                                   <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 font-myanmar">
                                        Du matériel médical sur place
                                   </h3>

                                   <p className="text-slate-400 text-lg mb-8">
                                        Voyagez léger, nous nous occupons du reste :
                                   </p>

                                   <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Fauteuils roulants de prêt</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Lits médicalisés</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Lève-personnes</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Matériel d'oxygénothérapie (sur demande)</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                             <FaCheck className="text-[#FFB800] mt-1 shrink-0" />
                                             <span className="text-slate-300">Matelas anti-escarres</span>
                                        </li>
                                   </ul>
                              </div>
                         </div>
                    </section>
                    <section className="bg-[#0f172a] py-20">
                         <div className="mx-5 md:mx-auto max-w-7xl">
                              <div className="flex items-center gap-4 max-w-md mx-auto text-white mb-5">
                                   <div className="flex-1 border-t border-dark-gold"></div>
                                   <span className="text-dark-gold text-sm tracking-wide text-[1.4rem]">Nos services</span>
                                   <div className="flex-1 border-t border-dark-gold"></div>
                              </div>
                              <h2 className="text-[1.5rem] md:text-[3.25rem] leading-tight text-center text-white font-myanmar mb-8 max-w-5xl mx-auto">
                                   Nos formules de <span className="text-gold">séjours adaptés</span>
                              </h2>
                         </div>
                    </section>
                    <div className="flex justify-center my-10">
                         <Link href="/adapted-stay/professional-services" className="border border-dark-blue text-xl text-white px-8 py-2.5 bg-dark-blue hover:bg-white hover:text-dark-blue transition-all duration-500 cursor-pointer">
                              {t('geographical.contactButton')}
                         </Link>
                    </div>
               </main>

               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}