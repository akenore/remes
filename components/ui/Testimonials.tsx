'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Testimonial data structure
const testimonials = [
  {
    quote:
      'Le personnel est toujours attentif, disponible et respectueux. Ici, je ne me sens jamais seul. Chaque jour, je profite du soleil, du jardin, et d\'activités adaptées qui me redonnent goût à la vie. REMES n\'est pas seulement une maison de repos, c\'est un lieu où l\'on se sent chez soi, en sécurité et entouré',
    author: 'Mohamed Chtioui',
    role: 'Client',
    avatar: '/home/h-r-1.jpg', // Placeholder avatar
  },
  {
    quote:
      'Depuis que ma mère est chez REMES, elle a retrouvé le sourire. L\'équipe médicale est exceptionnelle et les installations sont parfaites pour son bien-être. Nous sommes rassurés de la savoir entre de bonnes mains.',
    author: 'Sophie Martin',
    role: 'Fille d\'une résidente',
    avatar: '/home/h-r-1.jpg',
  },
];

// Arrow components
const PrevArrow = () => (
  <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="var(--dark-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NextArrow = () => (
  <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6L15 12L9 18" stroke="var(--dark-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  // Refs to measure individual slide heights
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [maxSlideHeight, setMaxSlideHeight] = useState<number>(0);

  // Calculate the tallest slide on mount & whenever the window resizes
  useEffect(() => {
    const calcHeight = () => {
      const heights = slideRefs.current.map((el) => el?.offsetHeight || 0);
      setMaxSlideHeight(Math.max(...heights));
    };

    // Initial calculation
    calcHeight();

    // Re-calculate on resize to keep responsiveness
    window.addEventListener('resize', calcHeight);
    return () => window.removeEventListener('resize', calcHeight);
  }, []);

  // Auto-rotate every 6s (optional)
  useEffect(() => {
    const id = setInterval(() => setCurrent((prev) => (prev + 1) % total), 6000);
    return () => clearInterval(id);
  }, [total]);

  const goTo = (idx: number) => setCurrent((idx + total) % total);

  return (
    <section className="max-w-7xl mx-5 md:mx-auto px-5 md:px-8 my-24 md:my-32">
      {/* Section heading */}
      <div className="mb-12 md:mb-20 max-w-3xl">
        <h2 className="text-[2rem] text-center md:text-left md:text-[2.5rem] text-dark-blue font-myanmar mb-4">Temoignages</h2>
        <p className="text-[var(--gray)] text-center md:text-left leading-relaxed text-[1.063rem] md:max-w-lg w-full">
          Ils partagent leur expérience à REMES — des paroles sincères de confiance, de confort et de bien-être.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-center">
        {/* Left fixed image – hidden on mobile, visible from md */}
        <div className="hidden md:block">
          <Image
            src="/home/left-h.jpg"
            alt="Résident jouant"
            width={610}
            height={648}
            className="w-full h-auto object-cover rounded"
            priority
          />
        </div>

        {/* Right slider */}
        <div
          className="relative flex flex-col md:pl-8 lg:pl-12 xl:pl-16 max-w-xl mx-auto md:mx-0"
          style={{ minHeight: maxSlideHeight }}
        >
          {/* Slides */}
          {testimonials.map((t, idx) => (
            <div
              ref={(el) => {
                slideRefs.current[idx] = el;
              }}
              key={idx}
              className={`transition-opacity duration-700 ease-in-out ${
                current === idx
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none absolute'
              }`}
            >
              <p className="text-[1.063rem] text-[var(--gray)] mb-10 leading-relaxed text-center md:text-left">{t.quote}</p>

              {/* Author */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-5 items-center text-center sm:text-left">
                <Image
                  src={t.avatar}
                  alt={t.author}
                  width={64}
                  height={64}
                  className="w-12 h-12 rounded-full object-cover shadow-lg mb-4 sm:mb-0"
                />
                <div>
                  <h3 className="text-dark-blue font-semibold">{t.author}</h3>
                  <span className="text-sm text-[var(--gray)]">{t.role}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <div className="flex justify-center md:justify-start space-x-8 mt-8 md:mb-6 order-last md:order-first">
            <button
              aria-label="Témoignage précédent"
              onClick={() => goTo(current - 1)}
              className="hover:scale-110 transition-transform"
            >
              <PrevArrow />
            </button>
            <button
              aria-label="Témoignage suivant"
              onClick={() => goTo(current + 1)}
              className="hover:scale-110 transition-transform"
            >
              <NextArrow />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
