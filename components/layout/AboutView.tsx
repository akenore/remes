import Hero2 from "../ui/hero/Hero2";
import Footer from "../ui/Footer";
import ContactForm from "../ui/ContactForm";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import Masonary from "../ui/gallery/Masonry";
import Playbutton from "../animations/Playbutton";
import Video from "../ui/Video";

export default function AboutView() {
     const t = useTranslations();
     const locale = useLocale();

     return (
          <>
               <Hero2
                    title="A propos de nous"
                    description="A cat named Mittens has made national headlines after she managed to find her way back home, despite being lost for over a week. Mittens"
                    cards={null}
                    bgMobile="/hero-4/bg-mobile.jpg"
                    bgDesktop="/hero-4/bg-desktop.jpg"
               />
               <main className="pt-20">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 md:mb-40">
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                        C'est Quoi REMES ?
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
                                   <Image src="/adapted-r-desktop.jpg" alt="Maison de Repos" className="hidden md:block" width={610} height={648} style={{ width: "100%", height: "auto" }} />
                                   <Image src="/adapted-r-desktop.jpg" alt="Maison de Repos" className="block md:hidden" width={370} height={434} style={{ width: "100%", height: "auto" }} />
                              </div>
                         </div>
                    </div>
                    <Masonary showIcons={false} />
                    <Video />
                    {/* <div className="flex justify-center items-center">
                         <Playbutton className="w-40"/>
                    </div> */}
                    <div className="mx-5 md:mx-auto max-w-7xl pt-40">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 md:mb-40">
                              <div>
                                   <Image src="/adapted-r-desktop.jpg" alt="Maison de Repos" className="hidden md:block" width={610} height={648} style={{ width: "100%", height: "auto" }} />
                                   <Image src="/adapted-r-desktop.jpg" alt="Maison de Repos" className="block md:hidden" width={370} height={434} style={{ width: "100%", height: "auto" }} />
                              </div>
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                        C'est Quoi REMES ?
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
                                             {t('frontend.button')}
                                        </button>
                                   </div>
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