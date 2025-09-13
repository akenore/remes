
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
import PriceCard from "@/components/ui/card/PriceCard";
import PageSection from "@/components/ui/PageSection";


export default function TemporaryAccommodation() {
     return (
          <>
               <Hero3
                    title="Hébergement Temporaire"
                    description="Maison de retraite / Hébergement Temporaire"
               />
               <main className="pt-40">
                    <div className="mb-20 md:mb-46">
                     <PageSection
                          title="Hébergement temporaire"
                          paragraphs={[
                               "Le court séjour ou hébergement temporaire est une solution souple qui répond à différentes situations :",
                          ]}
                          lists={[
                               {
                                    text: "",
                                    subItems: [
                                         "Rompre l'isolement et retrouver une vie sociale.",
                                         "Se reposer après une hospitalisation.",
                                         "Découvrir la résidence avant un séjour permanent.",
                                         "Ou encore permettre aux familles et aux aidants de souffler le temps d'un voyage ou de vacances.",
                                    ]
                               }
                          ]}
                          afterParagraphs={[
                               "À REMES, les résidents accueillis en séjour temporaire bénéficient des mêmes services, soins et attentions que ceux en séjour permanent : hébergement confortable, restauration de qualité, accompagnement personnalisé."
                          ]}
                     />
                     <div className="mx-5 md:mx-auto max-w-7xl text-[1.3rem] mb-20 mt-5 px-14">
                         <p className="text-[1.3rem] text-center md:text-left text-gray mb-8">
                         La durée maximale est de trois mois. L’admission se fait simplement, avec un dossier administratif et médical, complété par une visite de préadmission et la signature d’un contrat de séjour clair et transparent.
                         </p>
                     </div>
                    </div>
                    
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