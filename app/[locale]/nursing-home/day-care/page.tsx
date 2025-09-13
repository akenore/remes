
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
import PriceCard from "@/components/ui/card/PriceCard";
import PageSection from "@/components/ui/PageSection";


export default function DayCare() {
     return (
          <>
               <Hero3
                    title="Accueil de Jour"
                    description="Maison de retraite / Accueil de Jour"
               />
               <main className="pt-40">
                    <PageSection
                         title="C'est Quoi Accueil de Jour ?"
                         paragraphs={[
                              "L’accueil de jour à REMES s’adresse aux seniors atteints de la maladie d’Alzheimer, de troubles apparentés ou en perte d’autonomie, qui souhaitent bénéficier d’un accompagnement adapté et stimulant tout en restant à domicile le reste du temps.",
                         ]}
                         lists={[
                              {
                                   text: "Il offre plusieurs avantages :",
                                   subItems: [
                                        "Préserver ou restaurer les contacts sociaux.",
                                        "Maintenir les capacités cognitives et motrices grâce à des activités variées.",
                                        "Apporter un temps de répit aux proches aidants, rassurés de savoir leur parent entouré et en sécurité.",
                                        
                                   ]
                              }
                         ]}
                    />
                    <div className="mx-5 md:mx-auto max-w-7xl text-[1.3rem] mb-20 mt-5 px-14">
                         <p className="text-[1.3rem] text-center md:text-left text-gray mb-8">
                         L’accueil de jour représente ainsi un équilibre précieux entre maintien à domicile et accompagnement spécialisé.
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