'use client';
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ContactFormB2B() {
     const t = useTranslations('b2b');
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
     const [message, setMessage] = useState('');

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setIsSubmitting(true);
          setSubmitStatus('idle');

          const formData = new FormData(e.currentTarget);
          
          // Validate phone number
          const phone = formData.get('phone') as string;
          const phoneRegex = /^[0-9+\-\s\(\)]+$/;
          if (phone && !phoneRegex.test(phone)) {
               setSubmitStatus('error');
               setMessage(t('form.phoneError'));
               setIsSubmitting(false);
               return;
          }

          const data = {
               access_key: process.env.NEXT_PUBLIC_WEB3FORM_KEY,
               name: formData.get('organization'),
               contact_person: formData.get('contact_person'),
               phone: phone,
               email: formData.get('email'),
               address: formData.get('address'),
               country: formData.get('country'),
               message: formData.get('message'),
               form_type: 'B2B'
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
          <form onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 mb-5">
                         <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="organization">
                              {t('form.organization')}
                         </label>
                         <input 
                              type="text" 
                              id="organization" 
                              name="organization" 
                              required
                              className="border border-gray-200 bg-gray-100 p-2" 
                              placeholder={t('form.organizationPlaceholder')} 
                         />
                    </div>
                    <div className="flex flex-col gap-2 mb-5">
                         <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="contact_person">
                              {t('form.contactPerson')}
                         </label>
                         <input 
                              type="text" 
                              id="contact_person" 
                              name="contact_person" 
                              required
                              className="border border-gray-200 bg-gray-100 p-2" 
                              placeholder={t('form.contactPersonPlaceholder')} 
                         />
                    </div>
                    <div className="flex flex-col gap-2 mb-5">
                         <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="phone">
                              {t('form.phone')}
                         </label>
                         <input 
                              type="tel" 
                              id="phone" 
                              name="phone" 
                              pattern="[0-9+\-\s\(\)]+"
                              title={t('form.phoneError')}
                              className="border border-gray-200 bg-gray-100 p-2"
                              placeholder={t('form.phonePlaceholder')}
                              onInput={(e) => {
                                   const value = e.currentTarget.value;
                                   const cleaned = value.replace(/[^0-9+\-\s\(\)]/g, '');
                                   if (value !== cleaned) {
                                        e.currentTarget.value = cleaned;
                                   }
                              }}
                         />
                    </div>
                    <div className="flex flex-col gap-2 mb-5">
                         <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="email">
                              {t('form.email')}
                         </label>
                         <input 
                              type="email" 
                              id="email" 
                              name="email" 
                              required
                              className="border border-gray-200 bg-gray-100 p-2"
                              placeholder={t('form.emailPlaceholder')} 
                         />
                    </div>
                    <div className="flex flex-col gap-2 mb-5">
                         <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="address">
                              {t('form.address')}
                         </label>
                         <input 
                              type="text" 
                              id="address" 
                              name="address" 
                              className="border border-gray-200 bg-gray-100 p-2"
                              placeholder={t('form.addressPlaceholder')} 
                         />
                    </div>
                    <div className="flex flex-col gap-2 mb-5">
                         <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="country">
                              {t('form.country')}
                         </label>
                         <input 
                              type="text" 
                              id="country" 
                              name="country" 
                              className="border border-gray-200 bg-gray-100 p-2"
                              placeholder={t('form.countryPlaceholder')} 
                         />
                    </div>
               </div>
               <div className="flex flex-col gap-2 mb-10">
                    <label className="text-dark-blue text-xl font-semibold mb-4" htmlFor="message">
                         {t('form.message')}
                    </label>
                    <textarea 
                         id="message" 
                         name="message" 
                         rows={6} 
                         required
                         className="border border-gray-200 bg-gray-100 p-2"
                         placeholder={t('form.messagePlaceholder')} 
                    />
               </div>
               
               {/* Status Message */}
               {submitStatus !== 'idle' && (
                    <div className={`mb-4 p-4 border-l-4 ${
                         submitStatus === 'success' 
                              ? 'bg-gold/20 border-gold text-dark-blue' 
                              : 'bg-red-50 border-red-400 text-red-700'
                    }`}>
                         <p className="text-sm font-medium">{message}</p>
                    </div>
               )}
               
               <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="border-1 border-dark-blue bg-dark-blue text-white px-12 py-2.5 hover:bg-white hover:text-dark-blue transition-all duration-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
               >
                    {isSubmitting ? t('form.submitting') : t('form.submit')}
               </button>
          </form>
     );
}