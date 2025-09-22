import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export default function Card({ image, title, description, buttonText, buttonHref }: CardProps) {
  return (
    <Link 
      href={buttonHref} 
      className="block bg-white shadow-2xl overflow-hidden w-full mx-auto transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-blue group xl:min-h-80"
      aria-label={`${title} - ${description}`}
    >
      <div className="flex flex-row w-full">
        <div className="w-1/3 h-auto relative">
          <Image
            src={image}
            alt={title}
            fill
            sizes="33vw"
            className="object-cover object-center"
          />
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className='lg:p-5'>
            <h2 className="text-lg md:text-[32px] text-dark-blue mb-10 font-myanmar group-hover:text-gold transition-colors duration-400">{title}</h2>
            <p className="text-gray-600 text-sm md:text-base mb-4 group-hover:text-light-blue2 transition-colors duration-300">{description}</p>
          </div>
          <span className="inline-block text-center bg-white border border-blue text-blue px-4 py-4 shadow group-hover:bg-gold group-hover:text-dark-blue group-hover:border-gold font-medium text-sm transition-colors duration-300">
            {buttonText}
            <span className="sr-only">{` - ${title}`}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
