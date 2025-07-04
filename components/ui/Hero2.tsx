'use client';
import { useTranslations, useLocale } from 'next-intl';
import Card from './Card';
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
               <div className="pt-40 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 justify-center items-stretch px-4 pb-12">

               </div>
          </div>
     );
}
