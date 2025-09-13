
import Hero3 from "@/components/ui/hero/Hero3";
import Footer from "@/components/ui/Footer";
import ContactFormB2B from "@/components/ui/ContactFormB2B";

export default function ProfessionalServices() {
     return (
          <>
               <Hero3
                    title="Services aux professionnels B2B"
                    description="Séjour Adaptée / Services aux professionnels B2B"
               />
               <main className="py-40">
                    <div className="max-w-7xl mx-5 md:mx-auto">
                         <ContactFormB2B />
                    </div>
               </main>
               <Footer />
          </>
     );
}