import Hero2 from "../ui/hero/Hero2";
import Footer from "../ui/Footer";
import ContactForm from "../ui/ContactForm";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import Icon from "../ui/Icon";
import VerticalGallery from "../ui/gallery/Vertical";

export default function MagazineView() {
     const t = useTranslations();
     const locale = useLocale();

     return (
          <>
               <Hero2
                    title="Magazine & Blog"
                    description="A cat named Mittens has made national headlines after she managed to find her way back home, despite being lost for over a week. Mittens"
                    cards={null}
                    bgMobile="/hero-4/bg-mobile.jpg"
                    bgDesktop="/hero-4/bg-desktop.jpg"
               />
               <main className="pt-20">
                    <VerticalGallery />
                    <section className="max-w-7xl mx-5 md:mx-auto text-center py-24 md:py-32">
                         <h2 className="text-dark-blue font-myanmar text-[1.75rem] md:text-[2.25rem] mb-4">Emplacement</h2>
                         <p className="text-[var(--gray)] max-w-xl mx-auto mb-12 leading-relaxed text-[0.938rem] md:text-base">
                              Nous collaborons avec des acteurs de confiance dans les domaines médical, hôtelier et du bien-être, partageant nos valeurs d'excellence et d'attention.
                         </p>

                         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
                              MAP
                         </div>
                    </section>
                    <ContactForm />
               </main>

               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}