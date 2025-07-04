import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";

import Hero from "../ui/hero/Hero";
import Footer from "../ui/Footer";
import Masonary from "../ui/gallery/Masonry";
import Testimonials from "../ui/Testimonials";
import Partners from "../ui/Partners";
import ContactForm from "../ui/ContactForm";

export default function HomeView() {

     const t = useTranslations();
     const locale = useLocale();
     return (
          <>
               <Hero />
               <main className="pt-96">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 md:mb-40 ">
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[2rem] text-center md:text-left text-dark-blue font-myanmar mb-8">Premiere maison de retraite
                                        hoteliers, vivez une retraite
                                        paisible et exceptionnelle
                                   </h2>
                                   <p className="text-[1.313rem] text-center md:text-left text-[var(--gray)] mb-8">
                                        Resort Medical est la première maison de retraite médicalisée hôtelière en Tunisie, accueillant des francophones depuis 2009.
                                        Située à Skanes, à deux pas de la Méditerranée, elle offre un cadre arboré, lumineux et sécurisé.
                                   </p>
                                   <p className="text-[1.313rem] text-center md:text-left text-[var(--gray)] mb-10">
                                        Un lieu de vie paisible et haut de gamme, alliant confort, soins personnalisés et climat agréable.
                                        L'objectif : préserver l'autonomie et offrir une retraite sereine dans un environnement exceptionnel.
                                   </p>
                                   <div className="flex justify-center md:justify-start">
                                        <button className="border-1 border-dark-blue text-dark-blue px-8 py-2.5 hover:bg-dark-blue hover:text-white transition-all duration-500 cursor-pointer">
                                             En savoir plus
                                        </button>
                                   </div>
                              </div>
                              <div>
                                   <Image src="/home/h-r-1.jpg" alt="Maison de Repos" width={610} height={648} style={{ width: "100%", height: "auto" }} />
                                   <div className="flex justify-center lg:hidden">
                                        <Image src="/rounded-logo.png" alt="remes logo" width={183} height={183} className="-mt-16 md:-mt-20 h-auto max-w-full" style={{ width: "auto", height: "25%" }} />
                                   </div>
                                   <Image src="/rounded-logo.png" alt="remes logo" width={183} height={183} className="hidden lg:block -mt-16 md:-mt-20 lg:-ml-10 h-auto max-w-full" style={{ width: "auto", height: "25%" }} />
                              </div>
                         </div>
                    </div>
                    <Masonary />
                    <Testimonials />
                    {/* Marquee strip */}
                    <div className="overflow-hidden py-20">
                         <div className="flex items-center space-x-10 animate-marquee whitespace-nowrap">
                              {Array.from({ length: 6 }).map((_, idx) => (
                                   <div key={"first-" + idx} className="flex items-center space-x-5 mx-5">
                                        <Image src="/icon-remes.png" alt="icon remes" width={89} height={89} className="w-[45px] h-[45px] md:w-[89px] md:h-[89px] flex-shrink-0" />
                                        <span className="text-dark-blue text-[2.25rem] lg:text-[4.3rem] font-vensfolk uppercase tracking-wide">Remes résidence médicalisée</span>
                                   </div>
                              ))}
                              {Array.from({ length: 6 }).map((_, idx) => (
                                   <div key={"second-" + idx} className="flex items-center space-x-5 mx-5">
                                        <Image src="/icon-remes.png" alt="icon remes" width={89} height={89} className="w-[45px] h-[45px] md:w-[89px] md:h-[89px] flex-shrink-0" />
                                        <span className="text-dark-blue text-[2.25rem] lg:text-[4.3rem] font-vensfolk uppercase tracking-wide">Remes résidence médicalisée</span>
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