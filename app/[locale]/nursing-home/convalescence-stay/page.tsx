
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
import PriceCard from "@/components/ui/card/PriceCard";
import PageSection from "@/components/ui/PageSection";


export default function ConvalescenceStay() {
     return (
          <>
               <Hero3
                    title="Séjour de Convalescence"
                    description="Maison de retraite / Séjour de Convalescence"
               />
               <main className="pt-40">
                    <PageSection
                         title="C'est Quoi Séjour de Convalescence ?"
                         paragraphs={[
                              "Après une hospitalisation, une intervention ou une maladie, le retour à domicile peut sembler fragile et source d’inquiétude. Le séjour de convalescence à REMES permet d’aborder cette transition en toute sérénité.",
                         ]}
                         lists={[
                              {
                                   text: "Nos résidents convalescents bénéficient de :",
                                   subItems: [
                                        "Chambres confortables et adaptées.",
                                        "Repas équilibrés tenant compte des besoins nutritionnels de chacun.",
                                        "Un suivi médicalisé rigoureux et des séances de kinésithérapie personnalisées.",
                                        "Une prise en charge hôtelière complète et des services pratiques pour limiter la fatigue."

                                   ]
                              }
                         ]}
                    />
                    <div className="mx-5 md:mx-auto max-w-7xl text-[1.3rem] mb-20 mt-5 px-14">
                         <p className="text-[1.3rem] text-center md:text-left text-gray mb-8">
                              Ce cadre sécurisé et apaisant favorise un bon rétablissement. Après quelques semaines à REMES, chacun peut retrouver son domicile avec plus de confiance, de force et de sérénité.
                         </p>
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