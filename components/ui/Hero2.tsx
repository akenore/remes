'use client';
import { useTranslations, useLocale } from 'next-intl';
import Card2 from './Card2';
import Icon from './Icon';
import Navbar from './Navbar';


export default function Hero2() {
     const t = useTranslations();
     const locale = useLocale();

     return (
          <div className="w-full h-[990px] bg-cover bg-top bg-[url('/hero-2/bg-mobile.jpg')] sm:bg-[url('/hero-2/bg-desktop.jpg')] bg-no-repeat">
               <Navbar />
               <div className='relative z-10 flex flex-col items-start justify-start w-full max-w-xl mx-auto text-center md:text-left gap-6 px-4'>
                    <div className='mb-20 max-h-80 sm:max-h-96 md:max-h-[28rem] md:-mt-20 lg:-mt-32 xl:-ml-80'>
                         <div className="h-64 flex flex-col justify-center md:justify-start">
                              <h1 className="px-6 md:px-0 text-[2rem] md:text-[3.875rem] mb-6 text-gold leading-tight font-myanmar max-w-sm sm:max-w-xl">
                                   Maison de Repos
                              </h1>
                              <p className="px-6 md:px-0 text-white text-[1rem] md:text-[1.2rem] mb-8 drop-shadow-lg max-w-sm sm:max-w-xl">
                                   A cat named Mittens has made national headlines after she managed to find her way back home, despite being lost for over a week. Mittens
                              </p>
                         </div>
                    </div>
               </div>
               <div className="pt-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-0 justify-center items-stretch px-4 pb-12">
                    <Card2
                         icon={<Icon name="HomeIcon" sizeClass="w-full h-full" className="hover:text-gold" />}
                         title="Hébergement Permanent"
                         description="Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien."
                         buttonText="Button 1"
                         buttonHref="/"
                    />
                    <Card2
                         icon={<Icon name="HomeIcon" sizeClass="w-full h-full" className="hover:text-gold" />}
                         title="Hébergement Temporaire"
                         description="Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien."
                         buttonText="Button 1"
                         buttonHref="/"
                    />
                    <Card2
                         icon={<Icon name="HomeIcon" sizeClass="w-full h-full" className="hover:text-gold" />}
                         title="Accueil de Jour"
                         description="Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien."
                         buttonText="Button 1"
                         buttonHref="/"
                    />
                    <Card2
                         icon={<Icon name="HomeIcon" sizeClass="w-full h-full" className="hover:text-gold" />}
                         title="Séjour de Convalescence"
                         description="Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien."
                         buttonText="Button 1"
                         buttonHref="/"
                    />
               </div>
          </div>
     );
}
