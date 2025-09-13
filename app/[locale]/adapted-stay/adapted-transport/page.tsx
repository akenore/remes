
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
import PriceCard from "@/components/ui/card/PriceCard";
import PageSection from "@/components/ui/PageSection";


export default function AdaptedTransport() {
     return (
          <>
               <Hero3
                    title="Transport Adapté"
                    description="Séjour Adaptée / Transport Adapté"
               />
               <main className="pt-40">
                    <PageSection
                         title="La Tunisie, accessible à tous"
                         paragraphs={[
                              "transferts, sorties, excursions… nos véhicules adaptés vous emmènent partout en toute sécurité.",
                              "Avec REMES, profitez de l’un des tout premiers services de transport spécialement adapté aux personnes à mobilité réduite en Tunisie.",
                              "Nos véhicules, aménagés selon les normes internationales, garantissent confort, sécurité et dignité, que vous soyez en fauteuil roulant manuel ou électrique."
                         ]}
                    />
                    <div className="mx-5 md:mx-auto max-w-7xl text-[1.3rem] mb-20 mt-5">
                         <ul className="md:px-14">
                              <li>
                                   Des trajets sur mesure
                                   <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                        <li>Transferts aéroport : à l’arrivée comme au départ</li>
                                        <li>Sorties détente : en ville, en bord de mer ou pour un café en terrasse</li>
                                        <li>Excursions découvertes : Sousse, Monastir, Carthage, Sidi Bou Saïd, le Sahara…</li>
                                   </ol>
                              </li>
                              <li className="mt-5">
                                   Des chauffeurs formés et attentifs
                                   <ol className="ps-5 mt-2 space-y-1 list-inside">
                                        <li>Nos chauffeurs, expérimentés et bienveillants, sont sensibilisés à l’accompagnement des personnes en situation de handicap. Leur mission : rendre chaque déplacement agréable et sans souci.</li>
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