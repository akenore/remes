'use client';
import Navbar from '../Navbar';


// Reusable header component
function HeroHeader({ title, description }: { title: string; description: string }) {
     return (
          <div className='mb-20 max-h-80 sm:max-h-96 md:max-h-112 md:-mt-20 lg:-mt-32 xl:-ml-80'>
               <div className="min-h-40 flex flex-col justify-center md:justify-start">
                    <h1 className="px-6 md:px-0 text-[2rem] md:text-[3.5rem] mb-6 text-dark-blue leading-tight font-myanmar pt-10">
                         {title}
                    </h1>
                    <p className="px-6 md:px-0 text-gray text-[1rem] md:text-[1.2rem] drop-shadow-lg">
                         {description}
                    </p>
               </div>
          </div>
     );
}



interface Hero3Props {
     title?: string;
     description?: string;
     bgMobile?: string;
     bgDesktop?: string;
}

export default function Hero3({ title, description }: Hero3Props) {
    

     return (
          <div
               className="relative w-full bg-gray-100"
          >
              <div className='bg-linear-to-b from-dark-blue to-blue'><Navbar /></div>
               <div className='relative z-10 flex flex-col items-start justify-start w-full max-w-xl mx-auto text-center md:text-left gap-6 px-4'>
                    <HeroHeader
                         title={title ?? ""}
                         description={description ?? ""}
                    />
               </div>
          </div>
     );
}
