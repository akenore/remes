import Hero from "@/components/ui/Hero";
import Image from "next/image";
import Footer from "@/components/ui/Footer";
import Masonary from "@/components/ui/gallery/Masonry";


export default function Home() {
  return (
    <>
      <Hero />
      <main className="pt-96">
        <div className="mx-5 md:mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-72">
            <div className="md:px-14">
              <h2 className="text-[1.5rem] md:text-[2rem] text-center md:text-left text-[var(--dark-blue)] font-[var(--font-myanmar)] mb-8">Premiere maison de retraite
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
                <button className="border-1 border-[var(--dark-blue)] text-[var(--dark-blue)] px-8 py-2.5 hover:bg-[var(--dark-blue)] hover:text-white transition-all duration-500 cursor-pointer">
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
      </main>
      <div className="bg-[var(--dark-blue)] pb-10">
        <Footer />
      </div>
    </>
  );
}
