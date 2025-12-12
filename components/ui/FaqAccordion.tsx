'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GoPlus } from 'react-icons/go';

export default function FaqAccordion() {
     const t = useTranslations('frontend.faq');
     const [openItem, setOpenItem] = useState<string | null>(null);

     const keys = ['price', 'location', 'alzheimer', 'admission', 'visit', 'language'] as const;

     const toggleItem = (key: string) => {
          setOpenItem(openItem === key ? null : key);
     };

     return (
          <div className="w-full max-w-4xl mx-auto space-y-4">
               {keys.map((key) => (
                    <div
                         key={key}
                         className="border-b border-gray-700/50 pb-4"
                    >
                         <button
                              onClick={() => toggleItem(key)}
                              className="flex w-full items-center justify-between py-2 text-left text-lg font-medium text-white hover:text-amber-200 transition-colors duration-200"
                         >
                              <span>{t(`items.${key}.question`)}</span>
                              <span className={`transform transition-transform duration-300 ${openItem === key ? 'rotate-45 text-amber-200' : 'text-amber-400'}`}>
                                   <GoPlus size={24} />
                              </span>
                         </button>

                         <div
                              className={`grid overflow-hidden transition-all duration-300 ease-in-out ${openItem === key ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
                                   }`}
                         >
                              <div className="overflow-hidden">
                                   <p className="text-gray-300 leading-relaxed pr-8">
                                        {t(`items.${key}.answer`)}
                                   </p>
                              </div>
                         </div>
                    </div>
               ))}
          </div>
     );
}
