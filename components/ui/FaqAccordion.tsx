'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GoPlus } from 'react-icons/go';

interface FaqAccordionProps {
     translationScope?: string;
     keys?: string[];
}

export default function FaqAccordion({
     translationScope = 'frontend.faq',
     keys = ['price', 'location', 'alzheimer', 'admission', 'visit', 'language']
}: FaqAccordionProps) {
     const t = useTranslations(translationScope);
     const [openItem, setOpenItem] = useState<string | null>(null);

     const toggleItem = (key: string) => {
          setOpenItem(openItem === key ? null : key);
     };

     return (
          <div className="w-full max-w-4xl mx-auto space-y-4">
               {keys.map((key) => {
                    // Try to get all answer keys dynamically
                    let answers: string[] = [];
                    try {
                         const item = t.raw(`items.${key}`) as Record<string, any>;
                         if (item) {
                              // Sort keys to ensure answer, answer2, answer3 order
                              const sortedKeys = Object.keys(item).sort((a, b) => {
                                   if (a === 'answer') return -1;
                                   if (b === 'answer') return 1;
                                   return a.localeCompare(b, undefined, { numeric: true });
                              });

                              answers = sortedKeys
                                   .filter(k => k.startsWith('answer') && typeof item[k] === 'string')
                                   .map(k => item[k]);
                         }
                    } catch (e) {
                         // Fallback to single answer if raw fails or is not found
                         try {
                              const singleAnswer = t(`items.${key}.answer`);
                              if (singleAnswer) answers = [singleAnswer];
                         } catch (e2) {
                              console.warn(`No answer found for FAQ key: ${key}`);
                         }
                    }

                    return (
                         <div
                              key={key}
                              className="border-b border-gray-700/50 pb-4"
                         >
                              <button
                                   onClick={() => toggleItem(key)}
                                   className="flex w-full items-center justify-between py-2 text-left text-lg font-medium text-white hover:text-dark-gold transition-colors duration-200"
                              >
                                   <span>{t(`items.${key}.question`)}</span>
                                   <span className={`transform transition-transform duration-300 ${openItem === key ? 'rotate-45 text-dark-gold' : 'text-dark-gold'}`}>
                                        <GoPlus size={24} />
                                   </span>
                              </button>

                              <div
                                   className={`grid overflow-hidden transition-all duration-300 ease-in-out ${openItem === key ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
                                        }`}
                              >
                                   <div className="overflow-hidden">
                                        <div className="text-gray-300 leading-relaxed pr-8 space-y-4">
                                             {answers.map((answer, index) => (
                                                  <p key={index}>{answer}</p>
                                             ))}
                                        </div>
                                   </div>
                              </div>
                         </div>
                    );
               })}
          </div>
     );
}
