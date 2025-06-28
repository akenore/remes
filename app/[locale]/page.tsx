import Hero from "@/components/ui/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero />
      <main className="pt-72 mx-5 md:mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-[2rem] text-[var(--dark-blue)] font-[var(--font-myanmar)] mb-8">Premiere maison de retraite
              hoteliers, vivez une retraite
              paisible et exceptionnelle
            </h2>
            <p className="text-[1.313rem] text-[var(--gray)] mb-8">
              Resort Medical est la première maison de retraite médicalisée hôtelière en Tunisie, accueillant des francophones depuis 2009.
              Située à Skanes, à deux pas de la Méditerranée, elle offre un cadre arboré, lumineux et sécurisé.
            </p>
            <p className="text-[1.313rem] text-[var(--gray)] mb-8">
              Un lieu de vie paisible et haut de gamme, alliant confort, soins personnalisés et climat agréable.
              L’objectif : préserver l’autonomie et offrir une retraite sereine dans un environnement exceptionnel.
            </p>
          </div>
          <div className="h-auto relative p-5">
              <Image src="/home/h-r-1.jpg" alt="Maison de Repos" fill sizes="33vw" className="object-cover object-center" />
            </div>
        </div>
      </main>
    </>
  );
}
