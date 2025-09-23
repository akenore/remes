import Link from "next/link";
import Image from "next/image";
import ContactForm from "../ui/ContactForm";

export default function MaintenanceMode() {
     return (
          <main className="pt-96">
               <div className="mx-5 md:mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                         <div className="md:px-14">
                              <h2 className="text-[1.5rem] md:text-[2rem] text-center md:text-left text-dark-blue font-myanmar mb-8">
                                   Un cadre unique, un accompagnement sur mesure
                              </h2>
                              <p className="text-[1.313rem] text-center md:text-left text-gray mb-8">
                                   À REMES, nous avons fait le choix d’un modèle unique : une résidence hôtelière médicalisée située au bord de la Méditerranée, qui conjugue soins, accompagnement et qualité de vie.
                              </p>
                              <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                   Nous accueillons des personnes âgées, en perte d’autonomie ou en situation de handicap, ainsi que toute personne ayant besoin d’un accompagnement adapté. Ici, chacun bénéficie d’un suivi personnalisé, respectueux de son rythme, de ses envies et de son histoire.
                              </p>
                              <p className="text-[1.313rem] text-center md:text-left text-gray mb-10">
                                   Plus qu’un lieu de soins, REMES est avant tout un lieu de vie : un cadre lumineux, verdoyant et sécurisé, où chaque résident est reconnu comme une personne unique, entourée d’attention et de bienveillance.
                              </p>

                              <div className="flex justify-center md:justify-start">
                                   <Link href="/about" className="border-1 border-dark-blue text-dark-blue px-8 py-2.5 hover:bg-dark-blue hover:text-white transition-all duration-500 cursor-pointer">
                                        En savoir plus
                                   </Link>
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
                    <blockquote className="text-[1.313rem] italic text-gray-800">
                         <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                              <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                         </svg>
                         <p className='mb-20'>
                              “En tant que directrice de REMES, ma conviction profonde est que chaque personne mérite d’être accompagnée avec respect et dignité, dans un environnement qui préserve son identité et ses habitudes de vie.
                              Grâce à la présence continue d’une équipe dynamique, compétente et investie, nous offrons à chaque personne accueillie la sécurité d’un accompagnement personnalisé. Nous nous adaptons aux besoins, au rythme et aux habitudes de chacun, qu’il s’agisse d’un séjour de longue durée, d’un court séjour ou de vacances adaptées, toujours avec chaleur et bienveillance.
                              Notre ambition : faire de REMES plus qu’un lieu de soins, un véritable lieu de vie, où l’on se sent reconnu, entouré et chez soi.”
                         </p>
                    </blockquote>

               </div>
               <ContactForm />
          </main>
     );
}