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
    <div className="bg-white shadow-2xl overflow-hidden flex flex-row w-full mx-auto transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-105 hover:-translate-y-2 cursor-pointer hover:bg-[var(--blue)] group xl:h-80">
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
          <h2 className="text-lg md:text-[32px] text-[var(--dark-blue)] mb-10 font-[var(--font-myanmar)] group-hover:text-[var(--gold)] transition-colors duration-400">{title}</h2>
          <p className="text-gray-600 text-sm md:text-base mb-4 group-hover:text-[var(--light-blue2)] transition-colors duration-300">{description}</p>
        </div>
        <Link href={buttonHref} className="inline-block text-center bg-white border border-[var(--blue)] text-[var(--blue)] px-4 py-4 shadow group-hover:bg-[var(--gold)] group-hover:text-[var(--dark-blue)] group-hover:border-[var(--gold)] font-medium text-sm transition-colors duration-300">
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
