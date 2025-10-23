import type { ComponentProps } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

type LinkHref = ComponentProps<typeof Link>['href'];

interface CardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: LinkHref;
}

export default function Card3({ image, title, description, buttonText, buttonHref }: CardProps) {
  return (
    <Link
      href={buttonHref}
      className="block bg-white shadow-2xl overflow-hidden w-full mx-auto transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-105 hover:-translate-y-2 group h-full"
      aria-label={`${title} - ${description}`}
    >
      <div className="flex flex-col h-full">
        <div className="relative w-full aspect-4/3">
          <Image
            src={image}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="flex-1 p-8 flex flex-col justify-between bg-white group-hover:bg-gold transition-colors duration-500 min-h-[200px]">
          <div className="flex-1 flex flex-col justify-start">
            <h2 className="text-[1.5rem] md:text-[2rem] text-dark-blue mb-6 font-myanmar group-hover:text-dark-blue transition-colors duration-400">{title}</h2>
            <p className="text-gray-600 text-sm md:text-base mb-8 group-hover:text-dark-blue transition-colors duration-300 flex-1">{description}</p>
          </div>
          <div className="mt-auto">
            <span className="inline-block text-center bg-white border border-dark-blue text-dark-blue px-4 py-4 shadow group-hover:bg-dark-blue group-hover:text-white group-hover:border-dark-blue font-medium text-sm transition-colors duration-300 w-full">
              {buttonText}
              <span className="sr-only">{` - ${title}`}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
