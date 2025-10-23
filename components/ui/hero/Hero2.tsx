'use client';
import { useTranslations, useLocale } from 'next-intl';
import Card2 from '../card/Card2';
import Icon from '../Icon';
import Navbar from '../Navbar';
import { ReactNode } from 'react';

// Reusable header component
function HeroHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className='mb-20 max-h-80 sm:max-h-96 md:max-h-112 md:-mt-20 lg:-mt-32 xl:-ml-80'>
      <div className="h-64 flex flex-col justify-center md:justify-start">
        <h1 className="px-6 md:px-0 text-[2rem] md:text-[3.875rem] mb-6 text-gold leading-tight font-myanmar max-w-sm sm:max-w-xl">
          {title}
        </h1>
        <p className="px-6 md:px-0 text-white text-[1rem] md:text-[1.2rem] mb-8 drop-shadow-lg max-w-sm sm:max-w-xl">
          {description}
        </p>
      </div>
    </div>
  );
}

interface HeroCard {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

interface Hero2Props {
  title?: string;
  description?: string;
  cards?: HeroCard[] | null;
  bgMobile?: string;
  bgDesktop?: string;
}

export default function Hero2({ title, description, cards, bgMobile, bgDesktop }: Hero2Props) {
  const t = useTranslations();
  const locale = useLocale();

  const defaultCards: HeroCard[] = [
    {
      icon: <Icon name="HomeIcon" sizeClass="w-full h-full" className="hover:text-gold" />,
      title: "Hébergement Permanent",
      description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
      buttonText: t('frontend.button'),
      buttonHref: "/",
    },
    {
      icon: <Icon name="BuildingIcon" sizeClass="w-full h-full" className="hover:text-gold" />,
      title: "Hébergement Temporaire",
      description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
      buttonText: t('frontend.button'),
      buttonHref: "/",
    },
    {
      icon: <Icon name="SunIcon" sizeClass="w-full h-full" className="hover:text-gold" />,
      title: "Accueil de Jour",
      description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
      buttonText: t('frontend.button'),
      buttonHref: "/",
    },
    {
      icon: <Icon name="MedicalPlusIcon" sizeClass="w-full h-full" className="hover:text-gold" />,
      title: "Séjour de Convalescence",
      description: "Un lieu de vie calme et sécurisé, avec un accompagnement médical personnalisé au quotidien.",
      buttonText: t('frontend.button'),
      buttonHref: "/",
    },
  ];

  const cardsToShow = cards === undefined ? defaultCards : cards;

  const mobileBg = bgMobile ?? "/hero-2/bg-mobile.jpeg";
  const desktopBg = bgDesktop ?? "/hero-2/bg-desktop.jpeg";

  return (
    <div
      className="relative w-full bg-cover bg-top bg-no-repeat dynamic-hero-bg min-h-[800px]"
      style={{
        '--hero-mobile-bg': `url('${mobileBg}')`,
        '--hero-desktop-bg': `url('${desktopBg}')`,
      } as React.CSSProperties}
    >
      <Navbar />
      <div className='relative z-10 flex flex-col items-start justify-start w-full max-w-xl mx-auto text-center md:text-left gap-6 px-4'>
        <HeroHeader
          title={title ?? ""}
          description={description ?? ""}
        />
      </div>
      {cardsToShow && (
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-0 justify-center items-stretch px-4 mb-20">
          {cardsToShow.map((card, i) => (
            <Card2
              key={i}
              icon={card.icon}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              buttonHref={card.buttonHref as any}
            />
          ))}
        </div>
      )}
    </div>
  );
}
