import HeroPage from "../ui/HearoPage";
import Footer from "../ui/Footer";
import ContactForm from "../ui/ContactForm";

export default function NursingView() {
     return (
          <>
               <HeroPage />
               <main className="pt-96">
               <ContactForm />
               </main>

               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}