
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
                    <PageSection />
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