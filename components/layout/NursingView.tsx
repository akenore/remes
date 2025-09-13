import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";

import Hero2 from "../ui/hero/Hero2";
import Footer from "../ui/Footer";
import ContactForm from "../ui/ContactForm";
import Card3 from "../ui/card/Card3";
import Icon from "../ui/Icon";


export default function NursingView() {
     const t = useTranslations();
     const locale = useLocale();

     return (
          <>
               <Hero2
                    title="Maison de retraite médicalisée"
                    description="Avec l’âge, certains gestes du quotidien deviennent difficiles et peuvent peser aussi bien sur la personne âgée que sur ses proches."
                    bgMobile="/hero-2/bg-mobile.jpg"
                    bgDesktop="/hero-2/bg-desktop.jpg"
                    cards={[
                         {
                              icon: <Icon name="HomeIcon" sizeClass="w-full h-full" />,
                              title: "Hébergement Permanent",
                              description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
                              buttonText: t('frontend.button'),
                              buttonHref: "/nursing-home/permanent-accommodation",
                         },
                         {
                              icon: <Icon name="BuildingIcon" sizeClass="w-full h-full" />,
                              title: "Hébergement Temporaire",
                              description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
                              buttonText: t('frontend.button'),
                              buttonHref: "/nursing-home/temporary-accommodation",
                         },
                         {
                              icon: <Icon name="SunIcon" sizeClass="w-full h-full" />,
                              title: "Accueil de Jour",
                              description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
                              buttonText: t('frontend.button'),
                              buttonHref: "/nursing-home/day-care",
                         },
                         {
                              icon: <Icon name="MedicalPlusIcon" sizeClass="w-full h-full" />,
                              title: "Séjour de Convalescence",
                              description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
                              buttonText: t('frontend.button'),
                              buttonHref: "/nursing-home/convalescence-stay",
                         },
                    ]}
               />
               <main className="pt-20">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                              <div>
                                   <Image src="/nursing-l-desktop.png" alt="Maison de Repos" className="hidden md:block" width={610} height={648} style={{ width: "100%", height: "auto" }} />
                                   <Image src="/nursing-l-desktop.png" alt="Maison de Repos" className="block md:hidden" width={370} height={434} style={{ width: "100%", height: "auto" }} />
                              </div>
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                        Planifiez un échange avec notre équipe
                                   </h2>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-8">
                                        Nous savons qu’organiser la recherche d’une résidence médicalisée peut être une étape exigeante. Pour vous simplifier la démarche, nous mettons à votre disposition un calendrier en ligne.
                                   </p>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                        Choisissez en toute simplicité le jour et l’heure qui vous conviennent, et notre équipe vous appellera directement à ce moment-là.
                                   </p>
                                   <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                        Lors de cet appel, nous prendrons le temps d’écouter vos besoins, de répondre à vos questions et de vous présenter en détail les solutions d’accueil proposées par REMES. Vous disposerez ainsi de toutes les informations nécessaires pour avancer sereinement dans votre projet.
                                   </p>

                                   {/* <div className="flex justify-center md:justify-start">
                                        <button className="border-1 border-dark-blue text-dark-blue px-8 py-2.5 hover:bg-dark-blue hover:text-white transition-all duration-500 cursor-pointer">
                                             En savoir plus
                                        </button>
                                   </div> */}
                              </div>

                         </div>
                    </div>
                    {/* <section className="relative w-full min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/home/bg-m-2.jpg')] sm:bg-[url('/home/bg-d-2.jpg')] mb-40">
                         <div className="w-full min-h-screen">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                                   <header className="text-center lg:text-left mb-12 lg:mb-16 pt-40">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                                             <div className="flex-1">
                                                  <h2 className="text-gold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-myanmar mb-4">
                                                       Notre Gallerie
                                                  </h2>
                                                  <p className="text-white text-sm sm:text-base lg:text-lg xl:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                                       A cat named mitedfsdfsdfsadasdasd dsfsf..s.df..sdfs
                                                  </p>
                                             </div>

                                        </div>
                                   </header>
                                   <div className="w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                             <Card3
                                                  image="/nursing-l-desktop.png"
                                                  title="Nos Activités"
                                                  description="Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien."
                                                  buttonText={t('frontend.button')}
                                                  buttonHref="/"
                                             />
                                             <Card3
                                                  image="/nursing-l-desktop.png"
                                                  title="Nos Animations"
                                                  description="Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien."
                                                  buttonText={t('frontend.button')}
                                                  buttonHref="/"
                                             />
                                             <Card3
                                                  image="/nursing-l-desktop.png"
                                                  title="Nos Services"
                                                  description="Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien."
                                                  buttonText={t('frontend.button')}
                                                  buttonHref="/"
                                             />

                                        </div>


                                   </div>
                              </div>
                         </div>
                    </section> */}
                    <section className="max-w-7xl mx-5 md:mx-auto text-center pb-24">
                        

                         <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                              Réservez dès maintenant le créneau de votre choix : c’est simple, rapide et sans engagement.
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