
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
import PriceCard from "@/components/ui/card/PriceCard";
import PageSection from "@/components/ui/PageSection";


export default function PermanentAccommodation() {
     return (
          <>
               <Hero3
                    title="Hébergement Permanent"
                    description="Maison de Repos / Hébergement Permanent"
               />
               <main className="pt-40">
                    <PageSection
                         title="C'est Quoi Hébergement Permanent ?"
                         paragraphs={[
                              "Resort Medical est la première maison de retraite médicalisée hôtelière en Tunisie, accueillant des francophones depuis 2009. Située à Skanes, à deux pas de la Méditerranée, elle offre un cadre arboré, lumineux et sécurisé.",
                              "Un lieu de vie paisible et haut de gamme, alliant confort, soins personnalisés et climat agréable. L'objectif : préserver l'autonomie et offrir une retraite sereine dans un environnement exceptionnel.",
                         ]}
                    />
                    <PriceCard
                         price="1000"
                         options={[
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                         ]}
                    />
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}