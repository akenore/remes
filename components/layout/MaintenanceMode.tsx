import { useTranslations } from 'next-intl';
import ContactForm from "../ui/ContactForm";

export default function MaintenanceMode() {
     const t = useTranslations('frontend.maintenance');
     
     return (
          <main className="pt-20">
               <div className="mx-5 md:mx-auto max-w-7xl">
                    <blockquote className="text-[1.313rem] italic text-gray-800">
                         <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                              <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                         </svg>
                         <p className='mb-20'>
                              &ldquo;{t('message')}&rdquo;
                         </p>
                    </blockquote>

               </div>
               <ContactForm />
          </main>
     );
}