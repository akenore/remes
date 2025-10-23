'use client';
import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Video from '../Video';

interface Slide {
     poster: string;
     videoSrc: string;
}

const slides: Slide[] = [
     {
          poster: '/videos/video-1.jpg',
          videoSrc: 'https://cdn.strakon.fr/videos/strakon-presentation.mp4',
     },
     {
          poster: '/videos/video-1.jpg',
          videoSrc: 'https://cdn.strakon.fr/videos/strakon-presentation.mp4',
     },
     {
          poster: '/videos/video-1.jpg',
          videoSrc: 'https://cdn.strakon.fr/videos/strakon-presentation.mp4',
     },
];

export default function VideosCarousel() {
     // Embla init – loop + center alignment
     const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', skipSnaps: false });

     const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
     const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

     return (
          <section aria-label="Videos" className="w-full">
               {/* Track */}
               <div ref={emblaRef} className="overflow-hidden">
                    <div className="flex">
                         {slides.map((s, i) => (
                              <div
                                   key={i}
                                   className="embla__slide shrink-0 snap-center px-4 flex-[0_0_100%] sm:flex-[0_0_80%] lg:flex-[0_0_60%]"
                              >
                                   <div className="aspect-video w-full overflow-hidden *:max-w-none! *:mx-0! *:mt-0!">
                                        <Video poster={s.poster} videoSrc={s.videoSrc} />
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>

               {/* Navigation */}
               <div className="mt-6 flex justify-center gap-6">
                    <button
                         onClick={scrollPrev}
                         aria-label="Previous video"
                         className="p-3 rounded-full bg-white shadow hover:bg-gray-100"
                    >
                         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 18l-6-6 6-6" />
                         </svg>
                    </button>
                    <button
                         onClick={scrollNext}
                         aria-label="Next video"
                         className="p-3 rounded-full bg-white shadow hover:bg-gray-100"
                    >
                         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18l6-6-6-6" />
                         </svg>
                    </button>
               </div>
          </section>
     );
}
