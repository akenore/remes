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
    <div className="bg-white shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-xl mx-auto">
      <div className="md:w-1/3 w-full h-40 md:h-auto relative">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-center"
        />
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-lg md:text-xl text-gray-900 mb-2 font-[var(--font-myanmar)]">{title}</h3>
          <p className="text-gray-600 text-sm md:text-base mb-4">{description}</p>
        </div>
        <Link href={buttonHref} className="inline-block bg-white border border-[var(--blue)] text-[var(--blue)] px-4 py-2 rounded shadow hover:bg-[var(--blue)] hover:text-white font-medium text-sm transition-colors">
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
