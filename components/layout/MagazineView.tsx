import { useTranslations, useLocale } from 'next-intl';
import Hero2 from "../ui/hero/Hero2";
import Footer from "../ui/Footer";
import VerticalGallery from "../ui/gallery/Vertical";
import VideosCarousel from "../ui/gallery/Videos";

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
               <main className="pt-10">
                    <section>
                         <VerticalGallery />
                    </section>
                    <section className="pt-10">
                         <VideosCarousel />
                    </section>
                    <section className="relative w-full overflow-hidden bg-white">
                         <div className="w-full pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-20 lg:pb-24">
                              <div className="max-w-3xl md:max-w-3xl lg:max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-24">
                                   <div className="mb-4 md:mb-8">
                                        <div className="text-center lg:text-left">
                                             <h2 className="text-[var(--dark-blue)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-myanmar mb-2 md:mb-4">
                                                  Notre Blog
                                             </h2>
                                             <p className="text-[var(--gray)] text-sm sm:text-base md:text-lg xl:text-xl max-w-md md:max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                                  A cat named mitedfsdfsdfsadasdasd dsfsf..s.df..sdfs
                                             </p>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </section>
               </main>

               <div className="bg-dark-blue pb-10">
                    <Footer />
               </div>
          </>
     );
}