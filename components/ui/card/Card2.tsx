import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface CardProps {
  icon?: ReactNode;
  image?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export default function Card2({ icon, image, title, description, buttonText, buttonHref }: CardProps) {
  return (
    <Link 
      href={buttonHref} 
      className="block bg-white shadow-2xl overflow-hidden w-full mx-auto transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-y-110 hover:scale-x-105 hover:-translate-y-2 hover:bg-blue group"
      aria-label={`${title} - ${description}`}
    >
      <div className="flex flex-col items-center text-center p-8 h-full">
        {icon ? (
          <div className="mb-6 w-12 h-12 flex items-center justify-center text-dark-blue group-hover:text-gold transition-colors duration-400">
            {icon}
          </div>
        ) : (
          image && (
            <Image
              src={image}
              alt={title}
              width={48}
              height={48}
              className="mb-6 w-12 h-12 object-contain"
            />
          )
        )}

        <h2 className="text-[1.375rem] md:text-[1.75rem] leading-tight text-dark-blue mb-6 font-myanmar group-hover:text-gold transition-colors duration-400">
          {title}
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-10 group-hover:text-light-blue2 transition-colors duration-300">
          {description}
        </p>
        <span className="mt-auto inline-block text-center bg-white border border-blue text-blue px-6 py-3 shadow group-hover:bg-gold group-hover:text-dark-blue group-hover:border-gold font-medium text-sm transition-colors duration-300">
          {buttonText}
          <span className="sr-only">{` - ${title}`}</span>
        </span>
      </div>
    </Link>
  );
}
