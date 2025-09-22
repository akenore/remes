import Hero2 from "../ui/hero/Hero2";
import Footer from "../ui/Footer";
import ContactForm from "../ui/ContactForm";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import Icon from "../ui/Icon";
import Link from "next/link";

export default function AdaptedView() {
     const t = useTranslations();
     const locale = useLocale();

     return (
          <>
               <Hero2
                    title="Découvrez la Tunisie autrement"
                    description="Plongez au cœur d’un pays aux mille et une couleurs, où l’histoire, les traditions et la beauté des paysages se mêlent pour offrir une expérience unique."
                    cards={[
                         {
                              icon: <Icon name="BedIcon" sizeClass="w-full h-full" />,
                              title: "Hébergement adapté",
                              description: "Confort et accessibilité : des chambres pensées pour tous.",
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/adapted-accommodation",
                         },
                         {
                              icon: <Icon name="BusIcon" sizeClass="w-full h-full" />,
                              title: "Transport adapté",
                              description: "La Tunisie, accessible à tous : transferts, sorties, excursions… nos véhicules adaptés vous emmènent partout en toute sécurité.",
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/adapted-transport",
                         },
                         {
                              icon: <Icon name="HeartHandIcon" sizeClass="w-full h-full" />,
                              title: "Un accompagnement personnalisé",
                              description: "Vos soins, sans compromis : une équipe discrète et bienveillante veille sur vous, même en vacances.",
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/adapted-care",
                         },
                         {
                              icon: <Icon name="WheelchairIcon" sizeClass="w-full h-full" />,
                              title: "Équipements médicaux adaptés",
                              description: "Voyagez léger, nous nous occupons du reste",
                              buttonText: t('frontend.button'),
                              buttonHref: "/adapted-stay/medical-equipment",
                         },
                    ]}
                    bgMobile="/hero-4/bg-mobile.jpg"
                    bgDesktop="/hero-4/bg-desktop.jpg"
               />
               <main className="pt-20">
                    <div className="mx-5 md:mx-auto max-w-7xl">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                              <div className="md:px-14">
                                   <h2 className="text-[1.5rem] md:text-[3.25rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                        Services aux professionnels
                                   </h2>
                                   <h3 className="text-[1.2rem] text-dark-blue font-myanmar mb-8">Des séjours adaptés en toute confiance</h3>
                                   <p className="text-[1.3rem] text-gray mb-8">
                                        Vous êtes une agence de voyages, une association, un tour-opérateur ou un organisme spécialisé dans les vacances adaptées ?
                                        La résidence REMES vous propose une offre réceptive complète, pensée pour accueillir dans les meilleures conditions les personnes en situation de handicap, les séniors ou les publics en perte d’autonomie.
                                   </p>
                                   <p className="text-[1.3rem] text-gray mb-10">
                                        Installée dans un hôtel 4 étoiles à Monastir, notre structure met à disposition :
                                   </p>
                                   <ul className="space-y-4 list-disc list-inside text-[1.313rem]">
                                        <li>Un hébergement entièrement accessible</li>
                                        <li>Une équipe soignante formée et disponible</li>
                                        <li>Du matériel médical sur place</li>
                                        <li>Un cadre balnéaire propice à la détente et au ressourcement</li>
                                        <li>Des sorties adaptées, encadrées par des professionnels locaux</li>
                                   </ul>

                              </div>
                              <div>
                                   <Image src="/adapted-r-desktop.jpg" alt="Maison de Repos" className="hidden md:block" width={610} height={648} style={{ width: "100%", height: "auto" }} />
                                   <Image src="/adapted-r-desktop.jpg" alt="Maison de Repos" className="block md:hidden" width={370} height={434} style={{ width: "100%", height: "auto" }} />
                              </div>
                         </div>
                         <div>
                              <p className="text-[1.3rem] text-gray mb-10">
                                   Nous travaillons en étroite collaboration avec vos équipes pour garantir le respect de vos protocoles, en vous offrant une solution clé en main : hébergement, soins, matériel, loisirs et excursions adaptées. Vous bénéficiez ainsi d’un partenaire fiable et expérimenté en Tunisie.
                              </p>
                              <blockquote className="text-xl italic font-semibold text-gray-900 mt-5">
                                   <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                                        <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                                   </svg>
                                   <p>"Ensemble, faisons de la Tunisie une destination accessible à tous vos voyageurs!"</p>
                              </blockquote>
                         </div>
                    </div>
                    <section className="max-w-7xl mx-5 md:mx-auto pt-10 pb-24">
                         <h2 className="text-dark-blue font-myanmar text-[1.75rem] md:text-[2.25rem] mb-4">Nos atouts géographiques</h2>
                         <ul className="space-y-4 list-disc list-inside text-[1.3rem]">
                              <li>Emplacement central : entre Sousse et Monastir, deux villes côtières emblématiques</li>
                              <li>
                                   Accessibilité optimale :
                                   <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                        <li>5 minutes de l’aéroport international de Monastir (Habib Bourguiba)</li>
                                        <li>40 minutes de l’aéroport international d’Enfidha</li>
                                   </ol>
                              </li>
                              <li>Cadre balnéaire privilégié : accès direct à une plage privée, proximité de marinas, terrains de golf, hôtels, cafés et commerces</li>
                              <li>Richesse culturelle : médinas de Sousse et Monastir, Ribat, musées, mausolée Bourguiba, sites classés UNESCO</li>
                              <li>Infrastructures médicales de pointe : cliniques et centres hospitaliers privés renommés, couvrant toutes les spécialités, pour une prise en charge optimale si nécessaire pendant le séjour</li>
                         </ul>
                         <blockquote className="text-xl italic font-semibold text-gray-900 mt-5">
                              <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                                   <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                              </svg>
                              <p>Contactez-nous dès aujourd’hui pour organiser vos vacances adaptées en toute confiance en Tunisie. Notre équipe est à votre écoute pour répondre à vos besoins.</p>
                         </blockquote>
                    </section>
                    <div className="flex justify-center my-10">
                         <Link href="/adapted-stay/professional-services" className="border-1 border-dark-blue text-xl text-white px-8 py-2.5 bg-dark-blue hover:bg-white hover:text-dark-blue transition-all duration-500 cursor-pointer">
                              Contactez-nous dès maintenant
                         </Link>
                    </div>
                    {/* <ContactForm /> */}
               </main>

               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}