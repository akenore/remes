
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactForm from "@/components/ui/ContactForm";
import PriceCard from "@/components/ui/card/PriceCard";
import PageSection from "@/components/ui/PageSection";


export default function AdaptedCare() {
     return (
          <>
               <Hero3
                    title="Soins Adaptés"
                    description="Séjour Adaptée / Un accompagnement personnalisé"
               />
               <main className="pt-40">
                    <PageSection
                         title="Un accompagnement personnalisé"
                         paragraphs={[
                              "Vos soins, sans compromis : une équipe discrète et bienveillante veille sur vous, même en vacances.",
                              "Selon vos besoins, vous pouvez bénéficier de la présence d’un soignant ou d’un auxiliaire de vie pendant vos déplacements",
                              "Une équipe soignante discrète, bienveillante et toujours disponible",
                              "Parce que partir en vacances ne doit jamais signifier renoncer à la sécurité ou à la continuité des soins, la résidence REMES met à votre disposition une équipe pluridisciplinaire expérimentée et attentive.",
                              "Notre personnel est composé de médecins, infirmiers, aides-soignants, auxiliaires de vie et kinésithérapeutes, présents sur place et disponibles selon vos besoins, dans le respect de votre rythme et de votre intimité.",
                         ]}
                    />
                    <div className="mx-5 md:mx-auto max-w-7xl text-[1.3rem] mb-20 mt-5">
                         <ul className="md:px-14">
                              <li>
                              Une présence rassurante, sans intrusion
                                   <ol className="ps-5 mt-2 space-y-1 list-disc list-inside">
                                        <li>Aide à la toilette, à l’habillage, aux déplacements si nécessaires</li>
                                        <li>Soins infirmiers assurés sur place, sur prescription</li>
                                        <li>Possibilité de séances de kinésithérapie durant le séjour</li>
                                        <li>Accompagnement aux activités, aux repas ou aux sorties si besoin</li>
                                        <li>Coordination avec les médecins habituels pour assurer la continuité des soins avant, pendant et après le séjour</li>
                                   </ol>
                              </li>
                              <li className="mt-5">
                                   <ol className="ps-5 mt-2 space-y-1 list-inside">
                                        <li>Ici, tout est pensé pour que vous puissiez profiter pleinement de vos vacances, en toute confiance, avec le soutien d’une équipe formée, discrète et bienveillante.</li>
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