import Image from "next/image";

export default function Icons() {
     return (
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
               <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-20 pb-40 space-y-10 md:space-y-0">
                         <div className="flex flex-col items-center justify-center text-white">
                              <Image src="/icons/heart.svg" alt="Maison de Repos" width={86} height={86} className="w-[55px] h-[55px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+120</span>
                              <p className="text-[0.875rem]">Résidents heureux</p>
                         </div>
                         <div className="flex flex-col items-center justify-center text-white">
                              <Image src="/icons/bag.svg" alt="Maison de Repos" width={86} height={86} className="w-[55px] h-[55px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+30</span>
                              <p className="text-[0.875rem]">Années d’expérience</p>
                         </div>
                         <div className="flex flex-col items-center justify-center text-white">
                              <Image src="/icons/done.svg" alt="Maison de Repos" width={86} height={86} className="w-[55px] h-[55px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+6</span>
                              <p className="text-[0.875rem]">Espaces verts</p>
                         </div>
                         <div className="flex flex-col items-center justify-center text-white">
                              <Image src="/icons/location.svg" alt="Maison de Repos" width={86} height={86} className="w-[55px] h-[55px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+120</span>
                              <p className="text-[0.875rem]">Jours de soleil</p>
                         </div>
                         <div className="flex flex-col items-center justify-center text-white">
                              <Image src="/icons/user.svg" alt="Maison de Repos" width={86} height={86} className="w-[55px] h-[55px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+320</span>
                              <p className="text-[0.875rem]">Personnel dédié</p>
                         </div>
                         <div className="flex flex-col items-center justify-center text-white">
                              <Image src="/icons/user.svg" alt="Maison de Repos" width={86} height={86} className="w-[50px] h-[50px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+320</span>
                              <p className="text-[0.875rem]">Personnel dédié</p>
                         </div>
                         <div className="hidden">
                              <Image src="/icons/user.svg" alt="Maison de Repos" width={86} height={86} className="w-[50px] h-[50px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+320</span>
                              <p className="text-[0.875rem]">Personnel dédié</p>
                         </div>
                    </div>
               </div>
          </div>
     );
}