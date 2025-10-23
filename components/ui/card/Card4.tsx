import type { ComponentProps } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

type LinkHref = ComponentProps<typeof Link>['href'];

interface CardProps {
  image: string;
  category?: string;
  date?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: LinkHref;
}

export default function Card4({
  image,
  category,
  date,
  title,
  description,
  buttonText,
  buttonHref,
}: CardProps) {
  return (
    <Link
      href={buttonHref}
      className="block bg-white shadow-2xl overflow-hidden w-full mx-auto transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-105 hover:-translate-y-2 group"
      aria-label={`${title} - ${description}`}
    >
      <div className="flex flex-col">
        {/* Image */}
        <div className="relative w-full aspect-4/3">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col justify-between bg-white group-hover:bg-dark-blue transition-colors duration-500">
          {/* Meta (category & date) */}
          {(category || date) && (
            <div className="flex justify-between items-center mb-6 text-sm">
              {category && (
                <span className="text-dark-gold hover:text-gold font-semibold">
                  {category}
                </span>
              )}
              {date && (
                <span className="text-gray-600 group-hover:text-light-blue2 transition-colors duration-300">
                  {date}
                </span>
              )}
            </div>
          )}

          {/* Title & description */}
          <div>
            <h2 className="text-[1.5rem] md:text-[2rem] text-dark-blue mb-6 font-myanmar group-hover:text-white transition-colors duration-400">
              {title}
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-8 group-hover:text-light-blue2 transition-colors duration-300">
              {description}
            </p>
          </div>

          {/* Button */}
          <span className="inline-block text-center bg-white border border-dark-blue text-dark-blue px-4 py-4 shadow group-hover:bg-white group-hover:text-dark-blue group-hover:border-white font-medium text-sm transition-colors duration-300">
            {buttonText}
            <span className="sr-only">{` - ${title}`}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
