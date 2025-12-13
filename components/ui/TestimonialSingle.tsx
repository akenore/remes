'use client'
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { pb } from '@/lib/pocketbase';

interface Testimonial {
     id: string;
     full_name: string;
     description: string;
     description_fr: string;
     created: string;
     updated: string;
     role?: string; // Assuming role might be added later or mapped from somewhere, but relying on fetch map for now
     location?: string;
}

export default function TestimonialSingle() {
     const t = useTranslations('frontend');
     const locale = useLocale();
     const [current, setCurrent] = useState(0);
     const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
     const [loading, setLoading] = useState(true);
     const getLocalizedContent = (testimonial: Testimonial) => {
          const isFrench = locale === 'fr';
          return {
               description: isFrench && testimonial.description_fr
                    ? testimonial.description_fr
                    : testimonial.description
          };
     };

     const fetchTestimonials = async () => {
          try {
               setLoading(true);
               const result = await pb.collection('testimonials').getList(1, 10, {
                    sort: '-created',
                    requestKey: null,
               });

               const testimonialsData: Testimonial[] = result.items.map((item: any) => ({
                    id: item.id,
                    full_name: item.full_name || '',
                    description: item.description || '',
                    description_fr: item.description_fr || '',
                    created: item.created,
                    updated: item.updated,
                    role: item.role || "Fille de résidente",
                    location: item.location || "Paris"
               }));

               setTestimonials(testimonialsData);
          } catch (error) {
               console.error('Failed to fetch testimonials data:', error);
               setTestimonials([]);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchTestimonials();
     }, []);
     useEffect(() => {
          if (testimonials.length > 1) {
               const id = setInterval(() => setCurrent((prev) => (prev + 1) % testimonials.length), 8000);
               return () => clearInterval(id);
          }
     }, [testimonials.length]);

     if (loading) {
          return (
               <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-gold"></div>
               </div>
          );
     }

     if (testimonials.length === 0) return null;

     const testimonial = testimonials[current];
     const localizedContent = getLocalizedContent(testimonial);

     return (
          <div className="max-w-4xl mx-auto px-4 py-8 text-center relative min-h-[300px] flex items-center justify-center">
               {testimonials.map((item, idx) => {
                    const content = getLocalizedContent(item);
                    return (
                         <div
                              key={item.id}
                              className={`transition-opacity duration-1000 absolute inset-0 flex flex-col items-center justify-center ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                   }`}
                         >
                              <div className="font-serif italic text-dark-blue text-lg md:text-2xl leading-relaxed mb-8">
                                   &ldquo;{content.description}&rdquo;
                              </div>

                              <div className="w-16 h-0.5 bg-[#c9a324] mb-6"></div>

                              <div className="flex flex-col items-center">
                                   <span className="font-myanmar text-dark-blue font-bold text-lg">
                                        {item.full_name}
                                   </span>
                                   <span className="text-gray-500 text-sm mt-1">
                                        {item.role}, {item.location}
                                   </span>
                              </div>
                         </div>
                    );
               })}
          </div>
     );
}
