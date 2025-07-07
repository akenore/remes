import Image from 'next/image';

const partners = [
  // '/partners/p1.png',
  '/home/left-h.jpg',
  '/home/left-h.jpg',
  '/home/left-h.jpg',
  '/home/left-h.jpg',
  '/home/left-h.jpg',
  '/home/left-h.jpg',
];

export default function Partners() {
  return (
    <section className="max-w-7xl mx-5 md:mx-auto text-center py-24 md:py-32">
      <h2 className="text-dark-blue font-myanmar text-[1.75rem] md:text-[2.25rem] mb-4">Nos Partenaires</h2>
      <p className="text-gray max-w-xl mx-auto mb-12 leading-relaxed text-[0.938rem] md:text-base">
        Nous collaborons avec des acteurs de confiance dans les domaines médical, hôtelier et du bien-être, partageant nos valeurs d'excellence et d'attention.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
        {partners.map((src, idx) => (
          <div key={idx} className="w-28 h-16 sm:w-32 sm:h-20 lg:w-36 lg:h-24 bg-gray-200 rounded flex items-center justify-center overflow-hidden shadow-sm">
            <Image
              src={src}
              alt={`Partenaire ${idx + 1}`}
              width={144}
              height={96}
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
} 