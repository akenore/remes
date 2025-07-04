import Hero2 from "../ui/Hero2";
import Footer from "../ui/Footer";
import ContactForm from "../ui/ContactForm";

export default function NursingView() {
     return (
          <>
               <Hero2 />
               <main className="pt-96">
               <ContactForm />
               </main>

               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}