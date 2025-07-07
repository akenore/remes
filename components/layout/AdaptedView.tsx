import Hero2 from "../ui/hero/Hero2";
import Footer from "../ui/Footer";
import ContactForm from "../ui/ContactForm";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import Icon from "../ui/Icon";

export default function AdaptedView() {
     const t = useTranslations();
     const locale = useLocale();

     return (
          <>
               <Hero2
                    title="Sejour Adaptee"
                    description="A cat named Mittens has made national headlines after she managed to find her way back home, despite being lost for over a week. Mittens"
                    cards={[
                         {
                              icon: <Icon name="BedIcon" sizeClass="w-full h-full" />,
                              title: "Hébergement adapté",
                              description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/adapted-accommodation",
                         },
                         {
                              icon: <Icon name="BusIcon" sizeClass="w-full h-full" />,
                              title: "Transport adapté",
                              description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/adapted-transport",
                         },
                         {
                              icon: <Icon name="HeartHandIcon" sizeClass="w-full h-full" />,
                              title: "Soins adapté",
                              description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/adapted-care",
                         },
                         {
                              icon: <Icon name="WheelchairIcon" sizeClass="w-full h-full" />,
                              title: "Matériel médical",
                              description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/medical-equipment",
                         },
                    ]}
                    bgMobile="/hero-4/bg-mobile.jpg"
                    bgDesktop="/hero-4/bg-desktop.jpg"
               />
               <main className="pt-20">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 md:mb-40">
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                   Services aux professionnels B2B
                                   </h2>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-8">
                                        Resort Medical est la première maison de retraite médicalisée hôtelière en Tunisie, accueillant des francophones depuis 2009.
                                        Située à Skanes, à deux pas de la Méditerranée, elle offre un cadre arboré, lumineux et sécurisé.
                                   </p>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
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
                    <section className="max-w-7xl mx-5 md:mx-auto text-center py-24 md:py-32">
                         <h2 className="text-dark-blue font-myanmar text-[1.75rem] md:text-[2.25rem] mb-4">Emplacement</h2>
                         <p className="text-gray max-w-xl mx-auto mb-12 leading-relaxed text-[0.938rem] md:text-base">
                              Nous collaborons avec des acteurs de confiance dans les domaines médical, hôtelier et du bien-être, partageant nos valeurs d'excellence et d'attention.
                         </p>

                         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
                              MAP
                         </div>
                    </section>
                    <ContactForm />
               </main>

               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}