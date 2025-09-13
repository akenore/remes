
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
// import PriceCard from "@/components/ui/card/PriceCard";
import PageSection from "@/components/ui/PageSection";


export default function AdaptedAccommodation() {
     return (
          <>
               <Hero3
                    title="Hébergement Adapté"
                    description="Séjour Adaptée / Hébergement Adapté"
               />
               <main className="pt-40">
                    <PageSection
                         title="Confort et accessibilité : des chambres pensées pour tous."
                         paragraphs={[
                              "À la résidence REMES, nos chambres allient confort, accessibilité et sérénité pour que chacun profite pleinement de son séjour. Spacieuses, lumineuses et fonctionnelles, elles sont pensées pour répondre aux besoins de tous, sans compromis sur le bien-être.",
                              // "Un lieu de vie paisible et haut de gamme, alliant confort, soins personnalisés et climat agréable. L'objectif : préserver l'autonomie et offrir une retraite sereine dans un environnement exceptionnel.",
                         ]}
                    />
                    <div className="mx-5 md:mx-auto max-w-7xl text-[1.3rem] mb-20 mt-5">
                         <ul className="md:px-14">
                              <li>
                                   Les atouts de nos chambres :
                                   <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                        <li>Établissement entièrement de plain-pied, sans obstacles.</li>
                                        <li>Piscine, jacuzzi, spa et jardins arborés.</li>
                                        <li>Ascenseur, fauteuil roulant et équipements médicaux adaptés.</li>
                                        <li>Télévision, WiFi et canapés.</li>
                                        <li>Baignoires adaptées.</li>
                                   </ol>
                              </li>
                         </ul>
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