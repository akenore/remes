import Image from "next/image";
import Icon from "./Icon";

export default function Icons() {
     return (
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
               <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-20 pb-40 space-y-10 md:space-y-0">
                         <div className="flex flex-col items-center justify-center text-white">
                              <Icon name="GHeart" className="w-[55px] h-[55px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+120</span>
                              <p className="text-[0.875rem]">Résidents heureux</p>
                         </div>
                         <div className="flex flex-col items-center justify-center text-white">
                              <Icon name="GBag" className="w-[55px] h-[55px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+30</span>
                              <p className="text-[0.875rem]">Années d’expérience</p>
                         </div>
                         <div className="flex flex-col items-center justify-center text-white">
                              <Icon name="GDone" className="w-[55px] h-[55px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+6</span>
                              <p className="text-[0.875rem]">Espaces verts</p>
                         </div>
                         <div className="flex flex-col items-center justify-center text-white">
                              <Icon name="GLocation" className="w-[55px] h-[55px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+120</span>
                              <p className="text-[0.875rem]">Jours de soleil</p>
                         </div>
                         <div className="flex flex-col items-center justify-center text-white">
                              <Icon name="GUser" className="w-[55px] h-[55px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+320</span>
                              <p className="text-[0.875rem]">Personnel dédié</p>
                         </div>
                         <div className="flex flex-col items-center justify-center text-white">
                              <Icon name="GUser" className="w-[50px] h-[50px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+320</span>
                              <p className="text-[0.875rem]">Personnel dédié</p>
                         </div>
                         <div className="hidden">
                              <Icon name="GUser" className="w-[50px] h-[50px] md:w-[86px] md:h-[86px]" />
                              <span className="text-[2rem] md:text-[2.75rem] mt-5 mb-2">+320</span>
                              <p className="text-[0.875rem]">Personnel dédié</p>
                         </div>
                    </div>
               </div>
          </div>
     );
}