import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
import PageSection from "@/components/ui/PageSection";
import EquipmentTable from "@/components/ui/table/EquipmentTable";


export default function MedicalEquipment() {
     return (
          <>
               <Hero3
                    title="Équipement Médical"
                    description="Séjour Adaptée / Équipement Médical"
               />
               <main className="pt-40">
                    <PageSection
                         title="C'est Quoi Matériel Médical ?"
                         paragraphs={[
                              "Resort Medical est la première maison de retraite médicalisée hôtelière en Tunisie, accueillant des francophones depuis 2009. Située à Skanes, à deux pas de la Méditerranée, elle offre un cadre arboré, lumineux et sécurisé.",
                              "Un lieu de vie paisible et haut de gamme, alliant confort, soins personnalisés et climat agréable. L'objectif : préserver l'autonomie et offrir une retraite sereine dans un environnement exceptionnel.",
                         ]}
                    />
                    <div className="max-w-7xl mx-5 md:mx-auto mb-20 md:mb-40">
                         <EquipmentTable />
                    </div>
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}