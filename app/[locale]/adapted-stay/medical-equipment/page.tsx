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
                         title="Voyagez léger, nous nous occupons du reste"
                         paragraphs={[
                              "Pour que vous puissiez voyager l’esprit tranquille, la résidence REMES met à votre disposition tout le matériel médical nécessaire à votre confort et à votre autonomie, durant votre séjour en Tunisie.",
                              "Plus besoin d’emporter fauteuil, lit médicalisé, lève-personne ou accessoires médicaux spécifiques :  Nous vous assurons la mise à disposition sur place d’équipements adaptés, installés selon vos besoins, avant votre arrivée.",
                              "",
                              "Vous pouvez également bénéficier, sur demande, de tout le consommable médical nécessaire (protections, pansements, matériel d’hygiène, etc.) pour un séjour serein et sans souci logistique."
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