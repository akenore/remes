
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
// import PriceCard from "@/components/ui/card/PriceCard";
import PageSection from "@/components/ui/PageSection";


export default function PermanentAccommodation() {
     return (
          <>
               <Hero3
                    title="Hébergement Permanent"
                    description="Maison de retraite / Hébergement Permanent"
               />
               <main className="pt-40">
                    <PageSection
                         title="Hébergement permanent"
                         paragraphs={[
                              "Avec l’âge, certains gestes du quotidien deviennent difficiles et peuvent peser aussi bien sur la personne âgée que sur ses proches.",
                              "Vivre à REMES, c’est faire le choix d’une résidence médicalisée qui associe sécurité, confort et sérénité dans un cadre adapté à chaque situation.",
                              "Nos chambres, modernes et spacieuses, sont conçues pour garantir une accessibilité totale, quel que soit le degré d’autonomie. Chaque résident bénéficie d’un projet de soins personnalisé, défini en concertation avec lui et sa famille, et suivi par une équipe pluridisciplinaire disponible 24h/24 et 7j/7 (médecins, infirmiers, aides-soignants, kinésithérapeutes).",
                              "Notre priorité est simple : que chaque résident trouve à REMES un nouveau “chez soi”, où il se sente entouré de bienveillance et d’attention",
                         ]}
                    />
                    {/* <PriceCard
                         price="1000"
                         options={[
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                              "Option numerscvdsdvsdvsdvsdvsdvsdvsavsdvo un",
                         ]}
                    /> */}
                    <ContactForm />
               </main>
               <Footer />
          </>
     );
}