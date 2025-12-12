'use client';
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ContactForm2() {
     const t = useTranslations('contact');
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
     const [message, setMessage] = useState('');

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setIsSubmitting(true);
          setSubmitStatus('idle');

          const formData = new FormData(e.currentTarget);

          // Validate phone number
          const phone = formData.get('telephone') as string;
          const phoneRegex = /^[0-9+\-\s\(\)]+$/;
          if (phone && !phoneRegex.test(phone)) {
               setSubmitStatus('error');
               setMessage(t('form.phoneError'));
               setIsSubmitting(false);
               return;
          }

          const data = {
               access_key: process.env.NEXT_PUBLIC_WEB3FORM_KEY,
               name: formData.get('nom'),
               email: formData.get('email'),
               phone: phone,
               country: formData.get('pays'),
               message: formData.get('message'),
          };

          try {
               const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         Accept: "application/json",
                    },
                    body: JSON.stringify(data),
               });

               const result = await response.json();

               if (result.success) {
                    setSubmitStatus('success');
                    setMessage(t('form.success'));
                    // Reset form
                    (e.target as HTMLFormElement).reset();
               } else {
                    setSubmitStatus('error');
                    setMessage(t('form.error'));
               }
          } catch (error) {
               setSubmitStatus('error');
               setMessage(t('form.error'));
          } finally {
               setIsSubmitting(false);
          }
     };
     return (
          <div className="px-10 py-20 bg-white rounded-lg shadow-lg">
               <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                              {/* <label htmlFor="nom" className="block text-sm font-medium text-dark-blue mb-2">
                                   {t('form.name')}
                              </label> */}
                              <input
                                   type="text"
                                   id="nom"
                                   name="nom"
                                   required
                                   className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                   placeholder={t('form.namePlaceholder')}
                              />
                         </div>
                         <div>
                              {/* <label htmlFor="email" className="block text-sm font-medium text-dark-blue mb-2">
                                   {t('form.email')}
                              </label> */}
                              <input
                                   type="email"
                                   id="email"
                                   name="email"
                                   required
                                   className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                   placeholder={t('form.emailPlaceholder')}
                              />
                         </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                              {/* <label htmlFor="telephone" className="block text-sm font-medium text-dark-blue mb-2">
                                   {t('form.phone')}
                              </label> */}
                              <input
                                   type="tel"
                                   id="telephone"
                                   name="telephone"
                                   pattern="[0-9+\-\s\(\)]+"
                                   title={t('form.phoneError')}
                                   className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                   placeholder={t('form.phonePlaceholder')}
                                   onInput={(e) => {
                                        // Remove any non-numeric characters except +, -, spaces, and parentheses
                                        const value = e.currentTarget.value;
                                        const cleaned = value.replace(/[^0-9+\-\s\(\)]/g, '');
                                        if (value !== cleaned) {
                                             e.currentTarget.value = cleaned;
                                        }
                                   }}
                              />
                         </div>
                         <div>
                              {/* <label htmlFor="pays" className="block text-sm font-medium text-dark-blue mb-2">
                                   {t('form.country')}
                              </label> */}
                              <input
                                   type="text"
                                   id="pays"
                                   name="pays"
                                   className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                                   placeholder={t('form.countryPlaceholder')}
                              />
                         </div>
                    </div>
                    <div>
                         {/* <label htmlFor="message" className="block text-sm font-medium text-dark-blue mb-2">
                              {t('form.message')}
                         </label> */}
                         <textarea
                              id="message"
                              name="message"
                              rows={5}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 resize-vertical"
                              placeholder={t('form.messagePlaceholder')}
                         ></textarea>
                    </div>
                    <div className="pt-4">
                         <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full cursor-pointer bg-dark-blue text-white px-8 py-5 font-medium hover:bg-dark-blue/90 focus:outline-none focus:ring-4 focus:ring-dark-blue/20 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase"
                         >
                              {isSubmitting ? t('form.submitting') : t('form.submit')}
                         </button>
                    </div>

                    {/* Status Message */}
                    {submitStatus !== 'idle' && (
                         <div className={`mt-4 p-4 border-l-4 ${submitStatus === 'success'
                              ? 'bg-gold/20 border-gold text-dark-blue'
                              : 'bg-red-50 border-red-400 text-red-700'
                              }`}>
                              <p className="text-sm font-medium">{message}</p>
                         </div>
                    )}
               </form>
          </div>
     );
}