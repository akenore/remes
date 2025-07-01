import Image from "next/image";

export default function Icons() {
     return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-20 pb-40">
               <div className="flex flex-col items-center justify-center text-white">
                    <Image src="/icons/heart.svg" alt="Maison de Repos" width={86} height={86} style={{ width: "auto", height: "auto" }} />
                    <span className="text-[2.75rem] mt-5 mb-2">+120</span>
                    <p className="text-[0.875rem]">Résidents heureux</p>
               </div>
               <div className="flex flex-col items-center justify-center text-white">
                    <Image src="/icons/heart.svg" alt="Maison de Repos" width={86} height={86} style={{ width: "auto", height: "auto" }} />
                    <span className="text-[2.75rem] mt-5 mb-2">+30</span>
                    <p className="text-[0.875rem]">Années d’expérience</p>
               </div>
               <div className="flex flex-col items-center justify-center text-white">
                    <Image src="/icons/heart.svg" alt="Maison de Repos" width={86} height={86} style={{ width: "auto", height: "auto" }} />
                    <span className="text-[2.75rem] mt-5 mb-2">+6</span>
                    <p className="text-[0.875rem]">Espaces verts</p>
               </div>
               <div className="flex flex-col items-center justify-center text-white">
                    <Image src="/icons/heart.svg" alt="Maison de Repos" width={86} height={86} style={{ width: "auto", height: "auto" }} />
                    <span className="text-[2.75rem] mt-5 mb-2">+120</span>
                    <p className="text-[0.875rem]">Jours de soleil</p>
               </div>
               <div className="flex flex-col items-center justify-center text-white">
                    <Image src="/icons/heart.svg" alt="Maison de Repos" width={86} height={86} style={{ width: "auto", height: "auto" }} />
                    <span className="text-[2.75rem] mt-5 mb-2">+320</span>
                    <p className="text-[0.875rem]">Personnel dédié</p>
               </div>
               <div className="flex flex-col items-center justify-center text-white">
                    <Image src="/icons/heart.svg" alt="Maison de Repos" width={86} height={86} style={{ width: "auto", height: "auto" }} />
                    <span className="text-[2.75rem] mt-5 mb-2">+320</span>
                    <p className="text-[0.875rem]">Personnel dédié</p>
               </div>
          </div>
     );
}