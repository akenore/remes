import Image from "next/image";


export default function PageSection() {
     return (
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
     );
}