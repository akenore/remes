import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function ContactForm() {
     return (
          <div className="relative -mb-32 z-10">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-2xl overflow-hidden">
                         <div className="flex flex-col lg:flex-row">
                              <div className="w-full lg:w-2/3 bg-gold p-8 sm:p-12 lg:p-16">
                                   <div className="max-w-xl mx-auto lg:mx-0">
                                        <h1 className="text-2xl sm:text-3xl lg:text-[3.25rem] font-myanmar text-dark-blue mb-4">
                                             Contactez-Nous
                                        </h1>
                                        <p className="text-dark-blue text-md sm:text-[1.375rem] mb-8 leading-relaxed">
                                             Une question, un besoin spécifique ou une demande de séjour ? Contactez-nous, notre équipe vous répondra dans les plus brefs délais.
                                        </p>

                                        <form className="space-y-6">
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                  <div>
                                                       <label htmlFor="nom" className="block text-sm font-medium text-dark-blue mb-2">
                                                            Nom et Prénom
                                                       </label>
                                                       <input
                                                            type="text"
                                                            id="nom"
                                                            name="nom"
                                                            className="w-full px-4 py-3 bg-dark-gold border border-dark-gold rounded-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 placeholder:text-[#FFE2BA]"
                                                            placeholder="Tapez votre nom complet"
                                                       />
                                                  </div>
                                                  <div>
                                                       <label htmlFor="email" className="block text-sm font-medium text-dark-blue mb-2">
                                                            Email
                                                       </label>
                                                       <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            className="w-full px-4 py-3 bg-dark-gold border border-dark-gold rounded-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 placeholder:text-[#FFE2BA]"
                                                            placeholder="Tapez votre email"
                                                       />
                                                  </div>
                                             </div>
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                  <div>
                                                       <label htmlFor="telephone" className="block text-sm font-medium text-dark-blue mb-2">
                                                            Téléphone
                                                       </label>
                                                       <input
                                                            type="tel"
                                                            id="telephone"
                                                            name="telephone"
                                                            className="w-full px-4 py-3 bg-dark-gold border border-dark-gold rounded-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 placeholder:text-[#FFE2BA]"
                                                            placeholder="Tapez votre numéro de téléphone"
                                                       />
                                                  </div>
                                                  <div>
                                                       <label htmlFor="pays" className="block text-sm font-medium text-dark-blue mb-2">
                                                            Pays
                                                       </label>
                                                       <input
                                                            type="text"
                                                            id="pays"
                                                            name="pays"
                                                            className="w-full px-4 py-3 bg-dark-gold border border-dark-gold rounded-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 placeholder:text-[#FFE2BA]"
                                                            placeholder="Tapez votre pays"
                                                       />
                                                  </div>
                                             </div>
                                             <div>
                                                  <label htmlFor="message" className="block text-sm font-medium text-dark-blue mb-2">
                                                       Message
                                                  </label>
                                                  <textarea
                                                       id="message"
                                                       name="message"
                                                       rows={5}
                                                       className="w-full px-4 py-3 bg-dark-gold border border-dark-gold rounded-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 placeholder:text-[#FFE2BA] resize-vertical"
                                                       placeholder="Tapez votre message"
                                                  ></textarea>
                                             </div>
                                             <div className="pt-4">
                                                  <button
                                                       type="submit"
                                                       className="w-full sm:w-auto bg-dark-blue text-white px-8 py-3 font-medium hover:bg-dark-blue/90 focus:outline-none focus:ring-4 focus:ring-dark-blue/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
                                                  >
                                                       Envoyer
                                                  </button>
                                             </div>
                                        </form>
                                   </div>
                              </div>
                              <div className="hidden lg:block w-full lg:w-1/3 relative min-h-[300px] lg:min-h-[600px]">
                                   <Image
                                        src="/form.jpg"
                                        alt="Interior of Remes residence"
                                        fill
                                        className="object-cover"
                                        sizes="50vw"
                                   />
                              </div>
                    </div>
                    </div>
               </div>
          </div>
     );
}